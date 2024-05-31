from flask import Blueprint, render_template, request, redirect, url_for, session
from datetime import datetime
import json
import pyrebase
from google.auth.transport.requests import Request
from google.oauth2 import id_token
from google_auth_oauthlib.flow import Flow
import requests
import google.auth.transport.requests
import os

# Blueprint 설정
bp = Blueprint('main', __name__)

# 절대 경로로 Firebase 설정 로드
firebase_config_path = os.path.join(os.path.dirname(__file__), 'authentication/firebase_auth.json')
with open(firebase_config_path) as f:
    config = json.load(f)

firebase = pyrebase.initialize_app(config)
db = firebase.database()
client_id = config["web"]["client_id"]
client_secret = config["web"]["client_secret"]

# OAuth 2.0 설정
flow = Flow.from_client_secrets_file(
    firebase_config_path,
    scopes=["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email", "openid"],
    redirect_uri="http://localhost:5000/login/callback"
)

@bp.route('/')
def index():
    return render_template('index.html')

@bp.route('/login')
def login():
    authorization_url, state = flow.authorization_url()
    session['state'] = state
    return redirect(authorization_url)

@bp.route('/login/callback')
def callback():
    flow.fetch_token(authorization_response=request.url)

    if not session["state"] == request.args["state"]:
        return redirect(url_for('main.index'))

    credentials = flow.credentials
    request_session = requests.session()
    token_request = google.auth.transport.requests.Request(session=request_session)
    
    id_info = id_token.verify_oauth2_token(
        id_token=credentials._id_token,
        request=token_request,
        audience=client_id
    )

    session['google_id'] = id_info.get("sub")
    session['name'] = id_info.get("name")
    session['email'] = id_info.get("email")
    return redirect(url_for('main.profile'))

@bp.route('/profile')
def profile():
    if 'google_id' not in session:
        return redirect(url_for('main.index'))

    user_info = {
        'name': session['name'],
        'email': session['email']
    }
    return render_template('profile.html', user_info=user_info)

@bp.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('main.index'))

@bp.route('/add_user', methods=['POST'])
def add_user():
    height = request.form.get('height')
    weight = request.form.get('weight')
    sex = request.form.get('sex')
    intake_goal_calories = request.form.get('intake_goal_calories')
    intake_goal_carbs = request.form.get('intake_goal_carbs')
    intake_goal_fat = request.form.get('intake_goal_fat')
    intake_goal_protein = request.form.get('intake_goal_protein')
    
    new_user = {
        "user_info": {
            "user_height": height, 
            "user_weight": weight,
            "user_sex": sex
        },
        "intake_goal": {
            "calories": intake_goal_calories,
            "carbs": intake_goal_carbs,
            "fat": intake_goal_fat,
            "protein": intake_goal_protein
        },
        "date": {
            str(datetime.today().date()): {
                "breakfast": {
                    "calories": request.form.get('calories_today'),
                    "carbs": request.form.get('carbs'),
                    "fat": request.form.get('fat'),
                    "protein": request.form.get('protein')
                }
            }
        }
    }
    db.child("users").child(session['google_id']).set(new_user)
    return redirect(url_for('main.index'))

@bp.route('/users')
def users():
    all_users = db.child("users").get().val()
    if all_users:
        user_list = list(all_users.values())
    else:
        user_list = []
    return render_template('users.html', users=user_list)
