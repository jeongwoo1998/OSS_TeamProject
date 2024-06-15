from flask import Flask, request, redirect, jsonify, make_response, Blueprint
from flask_jwt_extended import create_access_token, JWTManager
import requests

app = Flask(__name__)
login_BP = Blueprint('login', __name__)

app.config['JWT_SECRET_KEY'] = 'secret_key'
jwt = JWTManager(app)

KAKAO_CLIENT_ID = ''
KAKAO_REDIRECT_URI = ''

GOOGLE_CLIENT_ID = ''
GOOGLE_CLIENT_SECRET = ''
GOOGLE_REDIRECT_URI = ''

@login_BP.route('/kakao/login')
def kakao_login():
    kakao_auth_url = (
        f"https://kauth.kakao.com/oauth/authorize?"
        f"client_id={KAKAO_CLIENT_ID}&"
        f"redirect_uri={KAKAO_REDIRECT_URI}&"
        f"response_type=code"
    )
    return redirect(kakao_auth_url)

@login_BP.route('/kakao/callback')
def kakao_callback():
    code = request.args.get('code')
    if not code:
        return jsonify({"error": "No code provided"}), 400
    
    return redirect(f'/kakao/token?code={code}')

@login_BP.route('/kakao/token')
def kakao_token():
    code = request.args.get('code')
    token_url = 'https://kauth.kakao.com/oauth/token'
    profile_url = 'https://kapi.kakao.com/v2/user/me'

    token_data = {
        'grant_type': 'authorization_code',
        'client_id': KAKAO_CLIENT_ID,
        'redirect_uri': KAKAO_REDIRECT_URI,
        'code': code,
    }
    token_headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    }
    token_response = requests.post(token_url, data=token_data, headers=token_headers)
    token_json = token_response.json()

    if 'access_token' in token_json:
        access_token = token_json['access_token']
        profile_headers = {
            'Authorization': f'Bearer {access_token}',
        }
        profile_response = requests.get(profile_url, headers=profile_headers)
        profile_json = profile_response.json()

        jwt_access_token = create_access_token(identity=profile_json['id'])
        print(f"JWT: {jwt_access_token}")

        html_response = f"""
        <html>
            <body>
                <script type="text/javascript">
                    window.ReactNativeWebView.postMessage(JSON.stringify({{"jwt_access_token": "{jwt_access_token}"}}));
                </script>
            </body>
        </html>
        """
        response = make_response(html_response)
        response.headers['Content-Type'] = 'text/html'
        return response
    else:
        return jsonify(token_json), 400
    

@login_BP.route('/google/login')
def google_login():
    google_auth_url = (
        f"https://accounts.google.com/o/oauth2/auth?"
        f"client_id={GOOGLE_CLIENT_ID}&"
        f"redirect_uri={GOOGLE_REDIRECT_URI}&"
        f"response_type=code&"
        f"scope=openid%20email%20profile&"
        f"prompt=login"
    )
    return redirect(google_auth_url)

@login_BP.route('/google/callback')
def google_callback():
    code = request.args.get('code')
    if not code:
        return jsonify({"error": "No code provided"}), 400
    
    token_url = 'https://oauth2.googleapis.com/token'
    token_data = {
        'code': code,
        'client_id': GOOGLE_CLIENT_ID,
        'client_secret': GOOGLE_CLIENT_SECRET,
        'redirect_uri': GOOGLE_REDIRECT_URI,
        'grant_type': 'authorization_code',
    }
    token_headers = {
        'Content-Type': 'application/x-www-form-urlencoded',
    }
    token_response = requests.post(token_url, data=token_data, headers=token_headers)
    token_json = token_response.json()

    if 'access_token' in token_json:
        access_token = token_json['access_token']
        profile_url = 'https://www.googleapis.com/oauth2/v1/userinfo'
        profile_headers = {
            'Authorization': f'Bearer {access_token}',
        }
        profile_response = requests.get(profile_url, headers=profile_headers)
        profile_json = profile_response.json()

        jwt_access_token = create_access_token(identity=profile_json['id'])
        print(f"JWT: {jwt_access_token}")

        html_response = f"""
        <html>
            <body>
                <script type="text/javascript">
                    window.ReactNativeWebView.postMessage(JSON.stringify({{"jwt_access_token": "{jwt_access_token}"}}));
                </script>
            </body>
        </html>
        """
        response = make_response(html_response)
        response.headers['Content-Type'] = 'text/html'
        return response
    else:
        return jsonify(token_json), 400