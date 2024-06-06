import os
from flask import Flask
from controller import bp as main_bp

# 개발 환경에서 HTTP를 허용하도록 설정
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'
app = Flask(__name__)
app.secret_key = 'oss_is_hard'
app.config['UPLOAD_FOLDER'] = 'uploads'

# 블루프린트 등록
app.register_blueprint(main_bp, url_prefix='/')

if __name__ == '__main__':
    app.run(debug=True)


