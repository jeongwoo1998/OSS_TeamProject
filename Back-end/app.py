import os
import sys
from flask import Flask, jsonify
from flask_cors import CORS
from flask_swagger_ui import get_swaggerui_blueprint
from flask_jwt_extended import JWTManager

sys.path.append(os.path.dirname(os.path.abspath(os.path.dirname(__file__))))
from Firebase.firebase import firebase_BP
from FoodRecognition.foodRecognition import foodRecognition_BP
from Login.login import login_BP
from Kakaomap.kakaomap import Kakaomap_BP

app = Flask(__name__)
CORS(app)

# JWT 설정
app.config['JWT_SECRET_KEY'] = 'secret_key'  # Change this to a random secret key
jwt = JWTManager(app)

# Register blueprint
app.register_blueprint(firebase_BP)
app.register_blueprint(foodRecognition_BP)
app.register_blueprint(login_BP)
app.register_blueprint(Kakaomap_BP)

# Swagger UI setup
SWAGGER_URL = '/swagger'
API_URL = '/static/swagger.yaml'
swaggerui_blueprint = get_swaggerui_blueprint(
    SWAGGER_URL,
    API_URL,
    config={
        'app_name': "영칼로리 API"
    }
)
app.register_blueprint(swaggerui_blueprint, url_prefix=SWAGGER_URL)

@app.route('/test', methods=['GET'])
def test_route():
    try:
        return jsonify({"message": "API is working correctly"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
