# contorllers.py는 
# Flask 웹 애플리케이션에서 Google 및 Kakao OAuth 2.0 로그인을 처리하고,
# Firebase 인증 및 사용자 데이터를 관리하는 코드.
from flask import Blueprint, render_template, request, redirect, url_for, session, jsonify
from datetime import datetime, timedelta
import json
import pyrebase
from google.auth.transport.requests import Request
from google.oauth2 import id_token
from google_auth_oauthlib.flow import Flow
import requests
import google.auth.transport.requests
import os
import jwt
import firebase_admin
from firebase_admin import credentials, auth
import atexit
from apscheduler.schedulers.background import BackgroundScheduler

# Blueprint 설정
bp = Blueprint('main', __name__)

# 절대 경로로 Firebase Admin SDK 서비스 계정 인증 파일 로드
service_account_path = os.path.join(os.path.dirname(__file__), 'authentication/google_service_account_key.json')
cred = credentials.Certificate(service_account_path)
firebase_admin.initialize_app(cred)

# 절대 경로로 OAuth 2.0 클라이언트 구성 파일 로드
oauth_client_path = os.path.join(os.path.dirname(__file__), 'authentication/google_oauth_client.json')
with open(oauth_client_path) as f:
    config = json.load(f)

# 카카오 API 설정 파일 로드
kakao_oauth_client_path = os.path.join(os.path.dirname(__file__), 'authentication/kakao_oauth_client.json')
with open(kakao_oauth_client_path) as f:
    kakao_config = json.load(f)

# 카카오 보안 키 로드
KAKAO_CLIENT_ID = kakao_config["apiKey"]
KAKAO_CLIENT_SECRET = kakao_config["apiSecret"]
KAKAO_REDIRECT_URI = kakao_config["redirect_uri"]

# Firebase 초기화
firebase = pyrebase.initialize_app(config)
auth_pyrebase = firebase.auth()
db = firebase.database()
client_id = config["web"]["client_id"]
client_secret = config["web"]["client_secret"]

# OAuth 2.0 설정
flow = Flow.from_client_secrets_file(
    oauth_client_path,
    scopes=["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email", "openid"],
    redirect_uri="http://localhost:5000/login/callback"
)

# JWT 비밀 키 설정
JWT_SECRET = 'oss_is_hard'
JWT_ALGORITHM = 'HS256'
JWT_EXP_DELTA_SECONDS = 3600  # 1 hour

#kakao oauth 클래스 정의
class Kakao_Oauth:

    def __init__(self):
        self.auth_server = "https://kauth.kakao.com%s"
        self.api_server = "https://kapi.kakao.com%s"
        self.default_header = {
            "Content-Type": "application/x-www-form-urlencoded",
            "Cache-Control": "no-cache",
        }
    # 인증 코드로 액세스 토큰 요청
    def auth(self, code):
        return requests.post(
            url=self.auth_server % "/oauth/token",
            headers=self.default_header,
            data={
                "grant_type": "authorization_code",
                "client_id": KAKAO_CLIENT_ID,
                "client_secret": KAKAO_CLIENT_SECRET,
                "redirect_uri": KAKAO_REDIRECT_URI,
                "code": code,
            },
        ).json()
    # 액세스 토큰으로 사용자 정보 요청
    def userinfo(self, bearer_token):
        return requests.post(
            url=self.api_server % "/v2/user/me",
            headers={
                **self.default_header,
                **{"Authorization": bearer_token}
            },
            #"property_keys":'["kakao_account.profile_image_url"]'
            data={}
        ).json()

# 구글 로그인 라우트
@bp.route('/login')
def login():
    try:
        authorization_url, state = flow.authorization_url()
        session['state'] = state
        return redirect(authorization_url)
    except Exception as e:
        return jsonify({'message': 'Failed to initiate OAuth flow', 'error': str(e)}), 500
# 구글 로그인 콜백 라우트
@bp.route('/login/callback')
def callback():
    try:
        flow.fetch_token(authorization_response=request.url)

        if not session["state"] == request.args["state"]:
            return redirect(url_for('main.index'))

        credentials = flow.credentials
        request_session = requests.session()
        token_request = google.auth.transport.requests.Request(session=request_session)

        try:
            id_info = id_token.verify_oauth2_token(
                credentials._id_token,
                token_request,
                audience=client_id
            )
        except ValueError as e:
            return jsonify({'message': 'Failed to verify token', 'error': str(e)}), 401

        session['google_id'] = id_info.get("sub")
        session['name'] = id_info.get("name")
        session['email'] = id_info.get("email")

        # Firebase 사용자 인증 생성 및 로그인
        try:
            user = auth.get_user(session['google_id'])
        except firebase_admin.auth.UserNotFoundError:
            user = auth.create_user(
                uid=session['google_id'],
                email=session['email'],
                display_name=session['name']
            )
        
        # Pyrebase를 사용하여 Firebase에 로그인
        try:
            custom_token = auth.create_custom_token(session['google_id'])
            custom_token_str = custom_token.decode('utf-8')  # bytes 객체를 utf-8 문자열로 디코딩
            pyrebase_user = auth_pyrebase.sign_in_with_custom_token(custom_token_str)
        except Exception as e:
            return jsonify({'message': 'Firebase authentication failed', 'error': str(e)}), 500

        # JWT 생성
        payload = {
            'sub': session['google_id'],
            'name': session['name'],
            'email': session['email'],
            'exp': datetime.utcnow() + timedelta(seconds=JWT_EXP_DELTA_SECONDS)
        }
        jwt_token = jwt.encode(payload, JWT_SECRET, JWT_ALGORITHM)

        session['id_token'] = pyrebase_user['idToken']

        return redirect(url_for('main.profile', token=jwt_token))
    except Exception as e:
        return jsonify({'message': 'Callback processing failed', 'error': str(e)}), 500
    
# 카카오 로그인 라우트
@bp.route('/login/kakao')
def login_kakao():
    return redirect(
        f"https://kauth.kakao.com/oauth/authorize?client_id={KAKAO_CLIENT_ID}&redirect_uri={KAKAO_REDIRECT_URI}&response_type=code"
    )
# 카카오 로그인 콜백 라우트
@bp.route('/login/kakao/callback')
def login_kakao_callback():
    try:
        code = request.args.get('code')
        # 전달받은 authorization code를 통해서 access_token을 발급
        kakao_oauth=Kakao_Oauth()
        auth_info= kakao_oauth.auth(code)
        # error 발생 시 로그인 페이지로 redirect
        if "error" in auth_info:
            print("에러가 발생했습니다.")
            return {'message': '인증 실패'}, 404
        #error가 없을 때
        
        user = kakao_oauth.userinfo("Bearer "+auth_info['access_token'])
        #print(user)
        kakao_account = user["kakao_account"]
        #print(kakao_account)
        profile = kakao_account['profile']
        session['kakao_id']=str(user['id'])
        session['name'] = profile['nickname']
        session['email'] = kakao_account['email']
        #print(type(session['kakao_id']))
        # Firebase 사용자 인증 생성 및 로그인
        try:
            user = kakao_oauth.userinfo("Bearer"+auth_info['access_token'])
        except firebase_admin.auth.UserNotFoundError:
            user = auth.create_user(
                uid=str(session['kakao_id']),
                email=session['email'],
                name=session['name']
            )

        # Pyrebase를 사용하여 Firebase에 로그인
        try:
            custom_token = auth.create_custom_token(session['kakao_id'])
            custom_token_str = custom_token.decode('utf-8')
            pyrebase_user = auth_pyrebase.sign_in_with_custom_token(custom_token_str)
        except Exception as e:
            return jsonify({'message': 'Firebase authentication failed', 'error': str(e)}), 500

        # JWT 생성
        payload = {
            'sub': str(session['kakao_id']),
            'name': session['name'],
            'email': session['email'],
            'exp': datetime.utcnow() + timedelta(seconds=JWT_EXP_DELTA_SECONDS)
        }
        jwt_token = jwt.encode(payload, JWT_SECRET, JWT_ALGORITHM)

        session['id_token'] = pyrebase_user['idToken']
      
        return redirect(url_for('main.profile', token=jwt_token))
    except Exception as e:
        return jsonify({'message': 'Kakao callback processing failed', 'error': str(e)}), 500   
# 파이어베이스 등록 시 해당 정보들  입력한 후에 등록 함으로 프로필은 남겨둠
# 프로필 페이지 라우트
@bp.route('/profile')
def profile():
    try:
        token = request.args.get('token')
        if not token:
            return redirect(url_for('main.index'))
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        except jwt.ExpiredSignatureError:
            payload = {}
        except jwt.InvalidTokenError:
            payload = {}

        user_info = {
            'name': payload.get('name', 'Unknown'),
            'email': payload.get('email', 'Unknown')
        }
        return render_template('profile.html', user_info=user_info, token=token, payload=payload)
    except Exception as e:
        return jsonify({'message': 'Failed to load profile', 'error': str(e)}), 500
# 프로필 제출 라우트
@bp.route('/submit_profile', methods=['POST'])
def submit_profile():
    try:
        token = request.form.get('token')
        try:
            payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        except jwt.ExpiredSignatureError:
            payload = {}
        except jwt.InvalidTokenError:
            payload = {}

        name = request.form.get('name')  # 수정된 이름을 받음
        email = payload.get('email', 'unknown_email')  # JWT 토큰에서 이메일을 가져옴
        height = int(request.form.get('height'))
        weight = int(request.form.get('weight'))
        sex = request.form.get('sex')
        age = int(request.form.get('age'))
        activity_level = request.form.get('activity_level')

        recommended_calories = calculate_recommended_calories(weight, height, age, sex, activity_level)
        intake_goal = calculate_macro_goals(recommended_calories)

        user_data = {
            "user_info": {
                "user_name": name,  # 수정된 이름을 사용
                "user_email": email,  # 이메일은 JWT에서 가져온 그대로 사용
                "user_height": height,
                "user_weight": weight,
                "user_sex": sex,
                "user_age": age,
                "activity_level": activity_level,
            },
            "intake_goal": intake_goal
        }

        # Firebase에 데이터 쓰기
        id_token = session.get('id_token')
        db.child("users").child(payload.get('sub', 'unknown_user')).set(user_data, token=id_token)
        return render_template('profile_result.html', user_info=user_data["user_info"], intake_goal=intake_goal, token=token, payload=payload)
    except Exception as e:
        return jsonify({'message': 'Failed to submit profile', 'error': str(e)}), 500
# 로그아웃 라우트
@bp.route('/logout')
def logout():
    try:
        session.clear()
        return redirect(url_for('main.index'))
    except Exception as e:
        return jsonify({'message': 'Failed to logout', 'error': str(e)}), 500