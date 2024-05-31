from flask import Flask
from controller import bp as main_bp

app = Flask(__name__)
app.secret_key = 'your_secret_key'
app.config['UPLOAD_FOLDER'] = 'uploads'

# 블루프린트 등록
app.register_blueprint(main_bp)

if __name__ == '__main__':
    app.run(debug=True)
