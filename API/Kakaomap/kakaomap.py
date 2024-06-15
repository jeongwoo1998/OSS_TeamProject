from flask import Flask, request, jsonify, Blueprint
import requests

app = Flask(__name__)
Kakaomap_BP = Blueprint('kakaomap', __name__)

API_KEY = ''

@Kakaomap_BP.route('/searchKeyword', methods=['GET'])
def searchKeyword():
    keyword = request.args.get('keyword')
    latitude = request.args.get('latitude')
    longitude = request.args.get('longitude')
    radius = request.args.get('radius')
    
    if not keyword or not latitude or not longitude or not radius:
        return jsonify({'error': 'Missing required parameters'}), 400

    url = f"https://dapi.kakao.com/v2/local/search/keyword.json?query={keyword}&x={longitude}&y={latitude}&radius={radius}"
    
    headers = {
        "Authorization": f"KakaoAK {API_KEY}"
    }
    
    try:
        response = requests.get(url, headers=headers)
        
        if response.status_code == 200:
            data = response.json()
            return jsonify(data['documents'])
        else:
            return jsonify({'error': f"Error {response.status_code}: {response.reason}"}), response.status_code
    except Exception as e:
        return jsonify({'error': str(e)}), 500