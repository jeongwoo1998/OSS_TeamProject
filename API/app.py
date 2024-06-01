import os
import sys
from flask import Flask, jsonify
from flask_cors import CORS

sys.path.append(os.path.join(os.path.dirname(__file__), 'Firebase'))
sys.path.append(os.path.join(os.path.dirname(__file__), 'Food recognition'))

from firebase import firebase_BP
from foodRecognition import foodRecognition_BP

app = Flask(__name__)
CORS(app)

# Register blueprint
app.register_blueprint(firebase_BP)
app.register_blueprint(foodRecognition_BP)

@app.route('/test', methods=['GET'])
def test_route():
    try:
        return jsonify({"message": "API is working correctly"}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
