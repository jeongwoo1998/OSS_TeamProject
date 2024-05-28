from flask import Flask, render_template, request, jsonify, Response, redirect, url_for
from datetime import datetime
import os
import json
import sys
import pyrebase
from werkzeug.utils import secure_filename, quote
from PIL import Image

# libs 디렉토리를 Python 경로에 추가
sys.path.append(os.path.abspath('libs'))

# quantity_est와 yolov3 디렉토리를 Python 경로에 추가
sys.path.append(os.path.abspath('libs/quantity_est'))
sys.path.append(os.path.abspath('libs/yolov3'))

# quantity_est, yolov3 음식 인식 모델 함수
from quantity_est.food_quantity_model import quantity
from yolov3.food_recognition_model import detect, get_nutrients

UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)


# 절대 경로로 Firebase 설정 로드
firebase_config_path = os.path.join(os.path.dirname(__file__), 'authentication/firebase_auth.json')
with open(firebase_config_path) as f:
    config = json.load(f)

firebase = pyrebase.initialize_app(config)
db = firebase.database()


def url_quote(s, safe='/'):
    return quote(s, safe=safe)

def allowed_file(filename):
    return '.' in filename and \
           filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/add_user', methods=['POST'])
def add_user():
    height = request.form.get('height')
    weight = request.form.get('weight')
    food_today = request.form.get('food_today')
    calories_today = request.form.get('calories_today')
    carbs = request.form.get('carbs')
    protein = request.form.get('protein')
    fat = request.form.get('fat')
    
    new_user = User(
        height=height, 
        weight=weight, 
        food_today=food_today,
        calories_today=calories_today,
        carbs=carbs,
        protein=protein,
        fat=fat
    )
    db.child("users").push(new_user)
    return redirect(url_for('index'))

@app.route('/users')
def users():
    all_users = db.child("users").get().val()
    if all_users:
        user_list = list(all_users.values())
    else:
        user_list = []
    return render_template('users.html', users=user_list)

@app.route('/upload_image', methods=['POST'])
def upload_image():
    if 'image_file' not in request.files:
        return jsonify({"error": "No file part"}), 400
    file = request.files['image_file']
    if file.filename == '':
        return jsonify({"error": "No selected file"}), 400
    if file and allowed_file(file.filename):
        filename = secure_filename(file.filename)
        file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
        file.save(file_path)
        # 여기에서 이미지 처리 함수를 호출
        return redirect(url_for('analyze_image', filename=filename))
    return jsonify({"error": "Invalid file type"}), 400

@app.route('/analyze_image/<filename>')
def analyze_image(filename):
    file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
    print(f"File path: {file_path}")  # 파일 경로 출력
    if not os.path.isfile(file_path):
        return jsonify({"error": "File not found"}), 404

    # quantity 및 detect 함수를 사용하여 이미지 분석
    quantity_value = quantity(file_path)
    detection_results = detect(file_path)
    nutrients = get_nutrients(detection_results)

    response = {
        "quantity": quantity_value,
        "nutrients": nutrients
    }
    return jsonify(response)


@app.route('/food_recognition')
def food_recognition():
    return render_template('food_recognition.html')


if __name__ == '__main__':
    app.run(debug=True)
