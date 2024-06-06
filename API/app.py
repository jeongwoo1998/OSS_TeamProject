import os
import sys
from flask import Flask, jsonify
from flask_cors import CORS
from flask_swagger_ui import get_swaggerui_blueprint    

sys.path.append(os.path.join(os.path.dirname(__file__), 'Firebase'))
sys.path.append(os.path.join(os.path.dirname(__file__), 'Food recognition'))

from firebase import firebase_BP
from foodRecognition import foodRecognition_BP

app = Flask(__name__)
CORS(app)

# Register blueprint
app.register_blueprint(firebase_BP)
app.register_blueprint(foodRecognition_BP)

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
