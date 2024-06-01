from flask import Flask, request, jsonify, Response
import os
import json
import sys
from flask_cors import CORS

sys.path.append(os.path.abspath('Food recognition'))

# Import the food quantity and recognition models
from quantity_est.food_quantity_model import quantity
from yolov3.food_recognition_model import detect, get_nutrients

# Initialize the Flask app
app = Flask(__name__)
CORS(app)

# /quantity
@app.route('/quantity', methods=['POST'])
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
@app.route('/detect', methods=['POST'])
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

# /test
@app.route('/test', methods=['GET'])
def test_route():
    try:
        return jsonify({"message": "API is working correctly"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)