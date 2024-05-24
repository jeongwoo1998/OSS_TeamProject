from flask import Flask, request, jsonify, Response
import os
import json
import sys

sys.path.append(os.path.abspath('quantity_est'))
sys.path.append(os.path.abspath('yolov3'))

# quantity_est, yolov3 음식 인식 모델 함수
from quantity_est.food_quantity_model import quantity
from yolov3.food_recognition_model import detect, get_nutrients

# Flask 실행
app = Flask(__name__)

# '/quantity'에 POST 요청 시 처리
@app.route('/quantity', methods=['POST'])
def quantity_route():
    data = request.json
    image_path = data.get('image_path')
    if not image_path:
        return jsonify({"error": "image_path is required"}), 400

    if not os.path.isfile(image_path):
        return jsonify({"error": "image_path is invalid or does not exist"}), 400

    try:
        quantity_value = quantity(image_path) # quantity 함수 호출을 통한 음식 양 분석
        response = {"quantity": quantity_value}
        return jsonify(response)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# '/detect'에 POST 요청 시 처리
@app.route('/detect', methods=['POST'])
def detect_route():
    data = request.json
    image_path = data.get('image_path')
    if not image_path:
        return jsonify({"error": "image_path is required"}), 400

    results = detect(image_path) # detect 함수 호출을 통한 음식 사진 인식
    nutrients = get_nutrients(results) # get_nutrients 함수 호출을 통해 인식된 음식의 영양 정보 파악
    response = Response(json.dumps(nutrients, ensure_ascii=False), content_type='application/json; charset=utf-8')
    return response

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
