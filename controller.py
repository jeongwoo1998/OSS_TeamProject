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
service_account_path = os.path.join(os.path.dirname(__file__), 'authentication/service_account_key.json')
cred = credentials.Certificate(service_account_path)
firebase_admin.initialize_app(cred)

# 절대 경로로 OAuth 2.0 클라이언트 구성 파일 로드
oauth_client_path = os.path.join(os.path.dirname(__file__), 'authentication/oauth_client.json')
with open(oauth_client_path) as f:
    config = json.load(f)

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

# 권장 칼로리 계산 함수
def calculate_recommended_calories(weight, height, age, sex, activity_level):
    if sex == 'male':
        bmr = 88.362 + (13.397 * weight) + (4.799 * height) - (5.677 * age)
    else:
        bmr = 447.593 + (9.247 * weight) + (3.098 * height) - (4.330 * age)
    
    activity_multiplier = {
        'sedentary': 1.2,
        'lightly_active': 1.375,
        'moderately_active': 1.55,
        'very_active': 1.725,
        'extra_active': 1.9
    }
    
    return bmr * activity_multiplier[activity_level]

# 매크로 영양소 목표 계산 함수
def calculate_macro_goals(calories):
    carbs_ratio = 0.55
    protein_ratio = 0.20
    fat_ratio = 0.25

    carbs = (calories * carbs_ratio) / 4  # 1g of carbs = 4 kcal
    protein = (calories * protein_ratio) / 4  # 1g of protein = 4 kcal
    fat = (calories * fat_ratio) / 9  # 1g of fat = 9 kcal

    return {
        "calories": calories,
        "carbs": int(carbs),
        "protein": int(protein),
        "fat": int(fat)
    }

@bp.route('/')
def index():
    return render_template('index.html')

@bp.route('/login')
def login():
    try:
        authorization_url, state = flow.authorization_url()
        session['state'] = state
        return redirect(authorization_url)
    except Exception as e:
        return jsonify({'message': 'Failed to initiate OAuth flow', 'error': str(e)}), 500

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

        height = int(request.form.get('height'))
        weight = int(request.form.get('weight'))
        sex = request.form.get('sex')
        age = int(request.form.get('age'))
        activity_level = request.form.get('activity_level')

        recommended_calories = calculate_recommended_calories(weight, height, age, sex, activity_level)
        intake_goal = calculate_macro_goals(recommended_calories)

        user_data = {
            "user_info": {
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

@bp.route('/logout')
def logout():
    try:
        session.clear()
        return redirect(url_for('main.index'))
    except Exception as e:
        return jsonify({'message': 'Failed to logout', 'error': str(e)}), 500