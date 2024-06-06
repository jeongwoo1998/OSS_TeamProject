import os
from flask import Blueprint, request, jsonify, Response
import json
import sys

sys.path.append(os.path.abspath('FoodRecognition'))

# Import the food quantity and recognition models
from quantity_est.food_quantity_model import quantity
from yolov3.food_recognition_model import detect, get_nutrients

foodRecognition_BP = Blueprint('foodRecognition', __name__)

# /quantity
@foodRecognition_BP.route('/quantity', methods=['POST'])
def quantity_route():
    data = request.json
    image_path = data.get('image_path')
    if not image_path:
        return jsonify({"error": "image_path is required"}), 400

    if not os.path.isfile(image_path):
        return jsonify({"error": "image_path is invalid or does not exist"}), 400

    try:
        quantity_value = quantity(image_path)  # Call the quantity function to analyze the food quantity
        response = {"quantity": quantity_value}
        return jsonify(response)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# /detect
@foodRecognition_BP.route('/detect', methods=['POST'])
def detect_route():
    data = request.json
    image_path = data.get('image_path')
    if not image_path:
        return jsonify({"error": "image_path is required"}), 400

    try:
        results = detect(image_path)  # Call the detect function to recognize food in the image
        nutrients = get_nutrients(results)  # Call get_nutrients to get the nutritional information of recognized food
        response = Response(json.dumps(nutrients, ensure_ascii=False), content_type='application/json; charset=utf-8')
        return response
    except Exception as e:
        return jsonify({"error": str(e)}), 500