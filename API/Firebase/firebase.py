from flask import Flask, Blueprint, request, jsonify
import firebase_admin
from firebase_admin import credentials, db, storage
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

import sys
import os
sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))
from chatGPT.chatGPT import food_recommendations

app = Flask(__name__)
firebase_BP = Blueprint('firebase', __name__)

service_account_key_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')

# Firebase 관리자 SDK 초기화
cred = credentials.Certificate(service_account_key_path)
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://oss-teamproject-default-rtdb.firebaseio.com/',
    'storageBucket': 'oss-teamproject.appspot.com'
})

# JWT Example
@firebase_BP.route('/UserLogin', methods=['POST'])
def UserLogin():
    user_id = request.json.get('user_id', None)
    user_pwd = request.json.get('user_pwd', None)

    '''
    Here you should add login logic
    '''
 
    if user_id != 'test' or user_pwd != 'test':  # Example validation
        return jsonify({"error": "Bad user_id or user_pwd"}), 401

    access_token = create_access_token(identity = user_id)
    return jsonify(access_token=access_token), 200

# Upload Image
@firebase_BP.route('/UploadImage', methods=['POST'])
@jwt_required()
def UploadImage():
    if 'image' not in request.files:
        return jsonify({'error': 'Missing image file'}), 400

    image = request.files['image']
    image_name = image.filename
    
    # Firebase Storage에 이미지 업로드
    bucket = storage.bucket()
    blob = bucket.blob(image_name)
    blob.upload_from_file(image)

    # 이미지 URL 가져오기
    image_url = blob.public_url

    return jsonify({'image_url': image_url}), 200

# Set User ID
@firebase_BP.route('/SetUserID', methods=['POST'])
@jwt_required()
def SetUserID():
    user_id = get_jwt_identity()
    ref = db.reference(f'/users')
    ref.set(user_id)
    
    return jsonify({'success': True}), 200

# Set User Info
@firebase_BP.route('/SetUserInfo', methods=['POST'])
@jwt_required()
def SetUserInfo():
    data = request.json
    user_id = get_jwt_identity()
    user_info = data.get('user_info')
    
    if not user_info:
        return jsonify({'error': 'Missing data'}), 400
    
    ref = db.reference(f'/users/{user_id}/user_info')
    ref.set(user_info)
    
    return jsonify({'success': True}), 200

# Set Intake Goal
@firebase_BP.route('/SetIntakeGoal', methods=['POST'])
@jwt_required()
def SetIntakeGoal():
    data = request.json
    user_id = get_jwt_identity()
    intake_goal = data.get('intake_goal')
    
    if not user_id or not intake_goal:
        return jsonify({'error': 'Missing data'}), 400
    
    ref = db.reference(f'/users/{user_id}/intake_goal')
    ref.set(intake_goal)

    update_remaining_intake_for_all_dates(user_id)

    return jsonify({'success': True}), 200

# Set Breakfast Data
@firebase_BP.route('/SetBreakfastData', methods=['POST'])
@jwt_required()
def SetBreakfastData():
    data = request.json
    user_id = get_jwt_identity()
    date = data.get('date')
    breakfast_data = data.get('breakfast_data')
    
    if not date or not breakfast_data:
        return jsonify({'error': 'Missing data'}), 400
    
    ref = db.reference(f'/users/{user_id}/date/{date}/breakfast')
    ref.set(breakfast_data)

    update_total_data(user_id, date)
    
    return jsonify({'success': True}), 200

# Set Lunch Data
@firebase_BP.route('/SetLunchData', methods=['POST'])
@jwt_required()
def SetLunchData():
    data = request.json
    user_id = get_jwt_identity()
    date = data.get('date')
    lunch_data = data.get('lunch_data')
    
    if not date or not lunch_data:
        return jsonify({'error': 'Missing data'}), 400
    
    ref = db.reference(f'/users/{user_id}/date/{date}/lunch')
    ref.set(lunch_data)

    update_total_data(user_id, date)
    
    return jsonify({'success': True}), 200

# Set Dinner Data
@firebase_BP.route('/SetDinnerData', methods=['POST'])
@jwt_required()
def SetDinnerData():
    data = request.json
    user_id = get_jwt_identity()
    date = data.get('date')
    dinner_data = data.get('dinner_data')
    
    if not date or not dinner_data:
        return jsonify({'error': 'Missing data'}), 400
    
    ref = db.reference(f'/users/{user_id}/date/{date}/dinner')
    ref.set(dinner_data)

    update_total_data(user_id, date)
    
    return jsonify({'success': True}), 200

# Set Total Data
@firebase_BP.route('/SetTotalData', methods=['POST'])
@jwt_required()
def SetTotalData():
    data = request.json
    user_id = get_jwt_identity()
    date = data.get('date')
    total_data = data.get('total_data')
    
    if not date or not total_data:
        return jsonify({'error': 'Missing data'}), 400
    
    ref = db.reference(f'/users/{user_id}/date/{date}/total')
    ref.set(total_data)
    
    return jsonify({'success': True}), 200

def update_total_data(user_id, date):
    def get_meal_data(meal_ref):
        meal_data = meal_ref.get()
        if meal_data:
            return {
                'calories': meal_data.get('calories', 0),
                'protein': meal_data.get('protein', 0),
                'carbs': meal_data.get('carbs', 0),
                'fat': meal_data.get('fat', 0)
            }
        else:
            return {'calories': 0, 'protein': 0, 'carbs': 0, 'fat': 0}
    
    # Fetch breakfast data
    breakfast_ref = db.reference(f'/users/{user_id}/date/{date}/breakfast')
    breakfast_data = get_meal_data(breakfast_ref)
    
    # Fetch lunch data
    lunch_ref = db.reference(f'/users/{user_id}/date/{date}/lunch')
    lunch_data = get_meal_data(lunch_ref)
    
    # Fetch dinner data
    dinner_ref = db.reference(f'/users/{user_id}/date/{date}/dinner')
    dinner_data = get_meal_data(dinner_ref)
    
    # Calculate total intake
    total_data = {
        'calories': breakfast_data['calories'] + lunch_data['calories'] + dinner_data['calories'],
        'protein': breakfast_data['protein'] + lunch_data['protein'] + dinner_data['protein'],
        'carbs': breakfast_data['carbs'] + lunch_data['carbs'] + dinner_data['carbs'],
        'fat': breakfast_data['fat'] + lunch_data['fat'] + dinner_data['fat']
    }
    
    # Set total data
    total_ref = db.reference(f'/users/{user_id}/date/{date}/total')
    total_ref.set(total_data)

    # Update remaining intake
    update_remaining_intake(user_id, date)

def update_remaining_intake(user_id, date):
    intake_goal_ref = db.reference(f'/users/{user_id}/intake_goal')
    intake_goal = intake_goal_ref.get()
    
    if intake_goal:
        total_ref = db.reference(f'/users/{user_id}/date/{date}/total')
        total_data = total_ref.get()
        
        if total_data:
            remaining_intake = {
                'calories': intake_goal.get('calories', 0) - total_data.get('calories', 0),
                'protein': intake_goal.get('protein', 0) - total_data.get('protein', 0),
                'carbs': intake_goal.get('carbs', 0) - total_data.get('carbs', 0),
                'fat': intake_goal.get('fat', 0) - total_data.get('fat', 0)
            }
            remaining_intake_ref = db.reference(f'/users/{user_id}/date/{date}/remaining_intake')
            remaining_intake_ref.set(remaining_intake)

            recommended_foods = food_recommendations(remaining_intake)
            food_recommendation_ref = db.reference(f'/users/{user_id}/date/{date}/food_recommendations')
            food_recommendation_ref.set(recommended_foods)

def update_remaining_intake_for_all_dates(user_id):
    dates_ref = db.reference(f'/users/{user_id}/date')
    dates = dates_ref.get()
    
    if dates:
        for date in dates.keys():
            update_remaining_intake(user_id, date)

# Get User Info Data
@firebase_BP.route('/GetUserInfo', methods=['GET'])
@jwt_required()
def GetUserInfo():
    user_id = get_jwt_identity()
    ref = db.reference(f'/users/{user_id}/user_info')
    user_info = ref.get()
    
    if not user_info:
        return jsonify({'error': 'User info not found'}), 404
    
    return jsonify(user_info), 200

# Get Intake Goal Data
@firebase_BP.route('/GetIntakeGoal', methods=['GET'])
@jwt_required()
def GetIntakeGoal():
    user_id = get_jwt_identity()
    ref = db.reference(f'/users/{user_id}/intake_goal')
    intake_goal = ref.get()
    
    if not intake_goal:
        return jsonify({'error': 'Intake goal not found'}), 404
    
    return jsonify(intake_goal), 200

# Get Date Data
@firebase_BP.route('/GetDateData/<date>', methods=['GET'])
@jwt_required()
def GetDateData(date):
    user_id = get_jwt_identity()
    ref = db.reference(f'/users/{user_id}/date/{date}')
    date_data = ref.get()
    
    if not date_data:
        return jsonify({'error': 'Date data not found'}), 404
    
    return jsonify(date_data), 200

# Get Breakfast Data
@firebase_BP.route('/GetBreakfastData/<date>', methods=['GET'])
@jwt_required()
def GetBreakfastData(date):
    user_id = get_jwt_identity()
    ref = db.reference(f'/users/{user_id}/date/{date}/breakfast')
    breakfast_data = ref.get()
    
    if not breakfast_data:
        return jsonify({'error': 'Breakfast data not found'}), 404
    
    return jsonify(breakfast_data), 200

# Get Lunch Data
@firebase_BP.route('/GetLunchData/<date>', methods=['GET'])
@jwt_required()
def GetLunchData(date):
    user_id = get_jwt_identity()
    ref = db.reference(f'/users/{user_id}/date/{date}/lunch')
    lunch_data = ref.get()
    
    if not lunch_data:
        return jsonify({'error': 'Lunch data not found'}), 404
    
    return jsonify(lunch_data), 200

# Get Dinner Data
@firebase_BP.route('/GetDinnerData/<date>', methods=['GET'])
@jwt_required()
def GetDinnerData(date):
    user_id = get_jwt_identity()
    ref = db.reference(f'/users/{user_id}/date/{date}/dinner')
    dinner_data = ref.get()
    
    if not dinner_data:
        return jsonify({'error': 'Dinner data not found'}), 404
    
    return jsonify(dinner_data), 200

# Get Total Data
@firebase_BP.route('/GetTotalData/<date>', methods=['GET'])
@jwt_required()
def GetTotalData(date):
    user_id = get_jwt_identity()
    ref = db.reference(f'/users/{user_id}/date/{date}/total')
    total_data = ref.get()
    
    if not total_data:
        return jsonify({'error': 'Total data not found'}), 404
    
    return jsonify(total_data), 200

# Get Remaining Intake Data
@firebase_BP.route('/GetRemainingIntake/<date>', methods=['GET'])
@jwt_required()
def GetRemainingIntake(date):
    user_id = get_jwt_identity()
    ref = db.reference(f'/users/{user_id}/date/{date}/remaining_intake')
    remaining_intake = ref.get()
    
    if not remaining_intake:
        return jsonify({'error': 'Remaining intake data not found'}), 404
    
    return jsonify(remaining_intake), 200

# Get Food Recommendations Data
@firebase_BP.route('/GetFoodRecommendations/<date>', methods=['GET'])
@jwt_required()
def GetFoodRecommendations(date):
    user_id = get_jwt_identity()
    ref = db.reference(f'/users/{user_id}/date/{date}/food_recommendations')
    food_recommendations = ref.get()
    
    if not food_recommendations:
        return jsonify({'error': 'Food recommendations not found'}), 404
    
    return jsonify(food_recommendations), 200