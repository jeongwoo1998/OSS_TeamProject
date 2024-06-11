from flask import Flask, redirect, request, jsonify, session, url_for
import requests
import jwt
from datetime import datetime, timedelta
from flask_cors import CORS
from google.oauth2 import id_token
from google.auth.transport import requests as google_requests
import os

app = Flask(__name__)
CORS(app)

JWT_SECRET = 'your_jwt_secret'
JWT_ALGORITHM = 'HS256'
JWT_EXP_DELTA_SECONDS = 3600

KAKAO_CLIENT_ID = ''
KAKAO_CLIENT_SECRET = ''
KAKAO_REDIRECT_URI = 'http://localhost:8081/login/kakao/callback'

GOOGLE_CLIENT_ID = ''
GOOGLE_CLIENT_SECRET = ''
GOOGLE_REDIRECT_URI = 'http://localhost:8081/login/google/callback'

class Kakao_Oauth:
    def __init__(self):
        self.auth_server = "https://kauth.kakao.com"
        self.api_server = "https://kapi.kakao.com"

    def auth(self, code):
        data = {
            "grant_type": "authorization_code",
            "client_id": KAKAO_CLIENT_ID,
            "redirect_uri": KAKAO_REDIRECT_URI,
            "code": code,
            "client_secret": KAKAO_CLIENT_SECRET
        }
        response = requests.post(f"{self.auth_server}/oauth/token", data=data)
        return response.json()

    def userinfo(self, access_token):
        headers = {
            "Authorization": f"Bearer {access_token}"
        }
        response = requests.get(f"{self.api_server}/v2/user/me", headers=headers)
        return response.json()

@app.route('/login/kakao')
def login_kakao():
    return redirect(f"https://kauth.kakao.com/oauth/authorize?client_id={KAKAO_CLIENT_ID}&redirect_uri={KAKAO_REDIRECT_URI}&response_type=code")

@app.route('/login/kakao/callback')
def login_kakao_callback():
    code = request.args.get('code')
    return redirect(f"myapp://UserInfo?code={code}")

@app.route('/api/kakao', methods=['POST'])
def api_kakao():
    code = request.json.get('code')
    kakao_oauth = Kakao_Oauth()
    auth_info = kakao_oauth.auth(code)

    if "error" in auth_info:
        return jsonify({'message': '인증 실패', 'error': auth_info}), 400

    access_token = auth_info['access_token']
    user_info = kakao_oauth.userinfo(access_token)

    if "error" in user_info:
        return jsonify({'message': '사용자 정보 가져오기 실패', 'error': user_info}), 400

    kakao_account = user_info["kakao_account"]
    profile = kakao_account['profile']
    user_id = str(user_info['id'])
    name = profile['nickname']
    email = kakao_account.get('email', 'unknown@example.com')

    payload = {
        'sub': user_id,
        'name': name,
        'email': email,
        'exp': datetime.utcnow() + timedelta(seconds=JWT_EXP_DELTA_SECONDS)
    }
    jwt_token = jwt.encode(payload, JWT_SECRET, JWT_ALGORITHM)

    return jsonify({'token': jwt_token})

@app.route('/login/google')
def login_google():
    state = os.urandom(16).hex()
    session['state'] = state
    authorization_url = (
        f"https://accounts.google.com/o/oauth2/v2/auth?response_type=code"
        f"&client_id={GOOGLE_CLIENT_ID}&redirect_uri={GOOGLE_REDIRECT_URI}"
        f"&scope=openid%20email%20profile&state={state}"
    )
    return redirect(authorization_url)

@app.route('/login/google/callback')
def login_google_callback():
    if request.args.get('state') != session.get('state'):
        return jsonify({'error': 'Invalid state parameter'}), 400

    code = request.args.get('code')
    data = {
        'code': code,
        'client_id': GOOGLE_CLIENT_ID,
        'client_secret': GOOGLE_CLIENT_SECRET,
        'redirect_uri': GOOGLE_REDIRECT_URI,
        'grant_type': 'authorization_code'
    }
    response = requests.post('https://oauth2.googleapis.com/token', data=data)
    token_info = response.json()

    if 'error' in token_info:
        return jsonify({'error': 'Failed to fetch token', 'details': token_info}), 400

    access_token = token_info['access_token']
    id_info = id_token.verify_oauth2_token(token_info['id_token'], google_requests.Request(), GOOGLE_CLIENT_ID)

    user_id = id_info.get('sub')
    name = id_info.get('name')
    email = id_info.get('email')

    payload = {
        'sub': user_id,
        'name': name,
        'email': email,
        'exp': datetime.utcnow() + timedelta(seconds=JWT_EXP_DELTA_SECONDS)
    }
    jwt_token = jwt.encode(payload, JWT_SECRET, JWT_ALGORITHM)

    return redirect(f"myapp://UserInfo?token={jwt_token}")

if __name__ == '__main__':
    app.run(port=8081)
