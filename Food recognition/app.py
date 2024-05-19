from flask import Flask, request, jsonify, Response
import os
import json
import sys

# 모듈 경로 추가
sys.path.append(os.path.abspath('quantity_est'))
sys.path.append(os.path.abspath('yolov3'))

from quantity_est.food_quantity_model import quantity
from yolov3.food_recognition_model import detect, get_nutrients

app = Flask(__name__)

@app.route('/quantity', methods=['POST'])
def quantity_route():
    data = request.json
    image_path = data.get('image_path')
    if not image_path:
        return jsonify({"error": "image_path is required"}), 400

    if not os.path.isfile(image_path):
        return jsonify({"error": "image_path is invalid or does not exist"}), 400

    try:
        quantity_value = quantity(image_path)
        response = {"quantity": quantity_value}
        return jsonify(response)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/detect', methods=['POST'])
def detect_route():
    data = request.json
    image_path = data.get('image_path')
    if not image_path:
        return jsonify({"error": "image_path is required"}), 400

    results = detect(image_path)
    nutrients = get_nutrients(results)
    response = Response(json.dumps(nutrients, ensure_ascii=False), content_type='application/json; charset=utf-8')
    return response

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
