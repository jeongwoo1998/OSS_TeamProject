import os
from flask import Blueprint, request, jsonify
import firebase_admin
from firebase_admin import credentials, db, storage

firebase_BP = Blueprint('firebase', __name__)

service_account_key_path = os.getenv('GOOGLE_APPLICATION_CREDENTIALS')

# Firebase 관리자 SDK 초기화
cred = credentials.Certificate(service_account_key_path)
firebase_admin.initialize_app(cred, {
    'databaseURL': 'https://oss-teamproject-default-rtdb.firebaseio.com/',
    'storageBucket': 'oss-teamproject.appspot.com'
})

# Upload Image
@firebase_BP.route('/UploadImage', methods=['POST'])
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
def SetUserID():
    data = request.json
    user_id = data.get('user_id')
    
    if not user_id:
        return jsonify({'error': 'Missing user_id'}), 400
    
    ref = db.reference(f'/users/{user_id}')
    ref.set({'user_id': user_id})
    
    return jsonify({'success': True}), 200

# Set User Info
@firebase_BP.route('/SetUserInfo', methods=['POST'])
def SetUserInfo():
    data = request.json
    user_id = data.get('user_id')
    user_info = data.get('user_info')
    
    if not user_id or not user_info:
        return jsonify({'error': 'Missing data'}), 400
    
    ref = db.reference(f'/users/{user_id}/user_info')
    ref.set(user_info)
    
    return jsonify({'success': True}), 200

# Set Intake Goal
@firebase_BP.route('/SetIntakeGoal', methods=['POST'])
def SetIntakeGoal():
    data = request.json
    user_id = data.get('user_id')
    intake_goal = data.get('intake_goal')
    
    if not user_id or not intake_goal:
        return jsonify({'error': 'Missing data'}), 400
    
    ref = db.reference(f'/users/{user_id}/intake_goal')
    ref.set(intake_goal)

    update_remaining_intake_for_all_dates(user_id)

    return jsonify({'success': True}), 200

# Set Date data
@firebase_BP.route('/SetDate', methods=['POST'])
def SetDate():
    data = request.json
    user_id = data.get('user_id')
    date = data.get('date')
    date_data = data.get('date_data')
    
    if not user_id or not date or not date_data:
        return jsonify({'error': 'Missing data'}), 400
    
    ref = db.reference(f'/users/{user_id}/date/{date}')
    ref.set(date_data)
    
    return jsonify({'success': True}), 200

# Set Breakfast Data
@firebase_BP.route('/SetBreakfastData', methods=['POST'])
def SetBreakfastData():
    data = request.json
    user_id = data.get('user_id')
    date = data.get('date')
    breakfast_data = data.get('breakfast_data')
    
    if not user_id or not date or not breakfast_data:
        return jsonify({'error': 'Missing data'}), 400
    
    ref = db.reference(f'/users/{user_id}/date/{date}/breakfast')
    ref.set(breakfast_data)

    update_total_data(user_id, date)
    
    return jsonify({'success': True}), 200

# Set Lunch Data
@firebase_BP.route('/SetLunchData', methods=['POST'])
def SetLunchData():
    data = request.json
    user_id = data.get('user_id')
    date = data.get('date')
    lunch_data = data.get('lunch_data')
    
    if not user_id or not date or not lunch_data:
        return jsonify({'error': 'Missing data'}), 400
    
    ref = db.reference(f'/users/{user_id}/date/{date}/lunch')
    ref.set(lunch_data)

    update_total_data(user_id, date)
    
    return jsonify({'success': True}), 200

# Set Dinner Data
@firebase_BP.route('/SetDinnerData', methods=['POST'])
def SetDinnerData():
    data = request.json
    user_id = data.get('user_id')
    date = data.get('date')
    dinner_data = data.get('dinner_data')
    
    if not user_id or not date or not dinner_data:
        return jsonify({'error': 'Missing data'}), 400
    
    ref = db.reference(f'/users/{user_id}/date/{date}/dinner')
    ref.set(dinner_data)

    update_total_data(user_id, date)
    
    return jsonify({'success': True}), 200

# Set Total Data
@firebase_BP.route('/SetTotalData', methods=['POST'])
def SetTotalData():
    data = request.json
    user_id = data.get('user_id')
    date = data.get('date')
    total_data = data.get('total_data')
    
    if not user_id or not date or not total_data:
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

def update_remaining_intake_for_all_dates(user_id):
    dates_ref = db.reference(f'/users/{user_id}/date')
    dates = dates_ref.get()
    
    if dates:
        for date in dates.keys():
            update_remaining_intake(user_id, date)

# Get User Info Data
@firebase_BP.route('/GetUserInfo/<user_id>', methods=['GET'])
def GetUserInfo(user_id):
    ref = db.reference(f'/users/{user_id}/user_info')
    user_info = ref.get()
    
    if not user_info:
        return jsonify({'error': 'User info not found'}), 404
    
    return jsonify(user_info), 200

# Get Intake Goal Data
@firebase_BP.route('/GetIntakeGoal/<user_id>', methods=['GET'])
def GetIntakeGoal(user_id):
    ref = db.reference(f'/users/{user_id}/intake_goal')
    intake_goal = ref.get()
    
    if not intake_goal:
        return jsonify({'error': 'Intake goal not found'}), 404
    
    return jsonify(intake_goal), 200

# Get Date Data
@firebase_BP.route('/GetDateData/<user_id>/<date>', methods=['GET'])
def GetDateData(user_id, date):
    ref = db.reference(f'/users/{user_id}/date/{date}')
    date_data = ref.get()
    
    if not date_data:
        return jsonify({'error': 'Date data not found'}), 404
    
    return jsonify(date_data), 200

# Get Breakfast Data
@firebase_BP.route('/GetBreakfastData/<user_id>/<date>', methods=['GET'])
def GetBreakfastData(user_id, date):
    ref = db.reference(f'/users/{user_id}/date/{date}/breakfast')
    breakfast_data = ref.get()
    
    if not breakfast_data:
        return jsonify({'error': 'Breakfast data not found'}), 404
    
    return jsonify(breakfast_data), 200

# Get Lunch Data
@firebase_BP.route('/GetLunchData/<user_id>/<date>', methods=['GET'])
def GetLunchData(user_id, date):
    ref = db.reference(f'/users/{user_id}/date/{date}/lunch')
    lunch_data = ref.get()
    
    if not lunch_data:
        return jsonify({'error': 'Lunch data not found'}), 404
    
    return jsonify(lunch_data), 200

# Get Dinner Data
@firebase_BP.route('/GetDinnerData/<user_id>/<date>', methods=['GET'])
def GetDinnerData(user_id, date):
    ref = db.reference(f'/users/{user_id}/date/{date}/dinner')
    dinner_data = ref.get()
    
    if not dinner_data:
        return jsonify({'error': 'Dinner data not found'}), 404
    
    return jsonify(dinner_data), 200

# Get Total Data
@firebase_BP.route('/GetTotalData/<user_id>/<date>', methods=['GET'])
def GetTotalData(user_id, date):
    ref = db.reference(f'/users/{user_id}/date/{date}/total')
    total_data = ref.get()
    
    if not total_data:
        return jsonify({'error': 'Total data not found'}), 404
    
    return jsonify(total_data), 200

# Get Remaining Intake Data
@firebase_BP.route('/GetRemainingIntake/<user_id>/<date>', methods=['GET'])
def GetRemainingIntake(user_id, date):
    ref = db.reference(f'/users/{user_id}/date/{date}/remaining_intake')
    remaining_intake = ref.get()
    
    if not remaining_intake:
        return jsonify({'error': 'Remaining intake data not found'}), 404
    
    return jsonify(remaining_intake), 200