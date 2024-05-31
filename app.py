from flask import Flask, render_template, request, jsonify, Response, redirect, url_for, session
from datetime import datetime
import os
import json
import pyrebase
from werkzeug.utils import secure_filename, quote
from google.auth.transport.requests import Request
from google.oauth2 import id_token
from google_auth_oauthlib.flow import Flow
import google.auth.transport.requests


app = Flask(__name__)
app.secret_key = 'your_secret_key'


# 절대 경로로 Firebase 설정 로드
firebase_config_path = os.path.join(os.path.dirname(__file__), 'authentication/firebase_auth.json')
with open(firebase_config_path) as f:
    config = json.load(f)

firebase = pyrebase.initialize_app(config)
db = firebase.database()
client_id = config["client_id"]
client_secret = config["client_secret"]

# OAuth 2.0 설정
flow = Flow.from_client_secrets_file(
    firebase_config_path,
    scopes=["https://www.googleapis.com/auth/userinfo.profile", "https://www.googleapis.com/auth/userinfo.email", "openid"],
    redirect_uri="http://localhost:5000/login/callback"
)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/login/callback')
def callback():
    flow.fetch_token(authorization_response=request.url)

    if not session["state"] == request.args["state"]:
        return redirect(url_for('index'))

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
    return redirect(url_for('profile'))
@app.route('/profile')
def profile():
    if 'google_id' not in session:
        return redirect(url_for('index'))

    user_info = {
        'name': session['name'],
        'email': session['email']
    }
    return render_template('profile.html', user_info=user_info)

@app.route('/logout')
def logout():
    session.clear()
    return redirect(url_for('index'))

@app.route('/add_user', methods=['POST'])
def add_user():
    height = request.form.get('height')
    weight = request.form.get('weight')
    food_today = request.form.get('food_today')
    calories_today = request.form.get('calories_today')
    carbs = request.form.get('carbs')
    protein = request.form.get('protein')
    fat = request.form.get('fat')
    
    new_user = {
        "user_info": {
            "user_height": height, 
            "user_weight": weight,
            "user_sex": request.form.get('sex')
        },
        "intake_goal": {
            "calories": request.form.get('intake_goal_calories'),
            "carbs": request.form.get('intake_goal_carbs'),
            "fat": request.form.get('intake_goal_fat'),
            "protein": request.form.get('intake_goal_protein')
        },
        "date": {
            str(datetime.today().date()): {
                "breakfast": {
                    "calories": calories_today,
                    "carbs": carbs,
                    "fat": fat,
                    "protein": protein
                }
            }
        }
    }
    db.child("users").child(session['google_id']).set(new_user)
    return redirect(url_for('index'))

@app.route('/users')
def users():
    all_users = db.child("users").get().val()
    if all_users:
        user_list = list(all_users.values())
    else:
        user_list = []
    return render_template('users.html', users=user_list)

if __name__ == '__main__':
    app.run(debug=True)