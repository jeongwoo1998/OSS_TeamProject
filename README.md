## 💡 실행 방법

### 📁 폴더 구조

```bash
├── 📁 Front-end
│   │
│   └── ...
│
├── 📁 Back-end
│   │
│   └── ...
│   
├── 📁 Image
│   
└── 📁 ...
```

### 🧑🏼‍🍳 Front-end
* * *

### 🚀 실행
1. **`node.js`** 를 설치합니다.
2. **`npx expo start`** 를 터미널 창에 입력하여 **`Expo`** 를 실행시킵니다.
<br><br>

### 🧑🏼‍🍳 Back-end
* * *

### 🔗 Google Drive에서 음식 인식 및 양 추정 모델 다운로드
1. Google Drive 다운로드 링크로 이동합니다.  
   - [yolov3](https://drive.google.com/file/d/1DRJElnJSbhlmeyZ85NXpsqBcewgnrbcF/view?usp=sharing)
   - [quantity_est](https://drive.google.com/file/d/1QKwV2J-6kdMC6_h0L9kkJ0ueRWYmVMCi/view?usp=drive_link) <br><br>
2. 다음 파일들을 다운로드합니다.
   - **`yolov3.zip`**
   - **`quantity_est.zip`** <br><br>

### 🚦 파일 압축 해제
1. **`yolov3.zip`** 파일을 압축 해제합니다. <br><br>
2. **`quantity_est.zip`** 파일을 압축 해제합니다. <br><br>

### 🪄 파일 정리
1. 압축 해제한 파일들을 **`Back-end/FoodRecognition`** 폴더에 위치시킵니다. <br><br>

### 📦 필요한 패키지 설치
1. **`Back-end/requirements.txt`** 파일을 확인합니다. <br><br>
2. **`pip install -r requirements.txt`** <br><br>

### 🚀 실행
1. **`app.py`** 파일을 실행시킵니다. <br><br>

### 🌈 _How to use API_
_**Swagger :**_ **`localhost:5000/swagger`**
<br><br>

### 🧑🏼‍🍳 Android Emulator
* * *

### ⚙ 설정
1. **`Android Studio`** 를 설치합니다. <br><br>
2. **`Android Emulator`** 를 실행시킵니다. <br><br>
3. **`Android Emulator`** 의 **`Location`** 을 현재 위치로 바꿔줍니다. <br><br>
4. **`Image`** 폴더 안의 사진들을 **`Android Emulator`** 에 넣어줍니다.<br><br>

### 🚀 실행
1. **`Expo`** 를 실행시킨 **`Front-end`** 터미널로 돌아옵니다. <br><br>
2. **`Front-end`** 터미널에서 **`a`** 키를 눌러 **`Android Emulator`** 를 통해 어플을 실행합니다.
<br><br>

### 🔑 필수 설정
* * *

1. **`Notion`** 에 정리되어 있는  **`API KEY`** 참고하여 파일에 넣습니다.
<br><br>

### ⚠ 주의 사항
* * *

**`Google Login`**
1. **`ngrok`** 설치 후 터미널에서 실행합니다. <br><br>
2. **`ngrok http 5000`** 입력 후 나온 주소를 확인합니다.<br><br>
3. **`Google Cloud Console`** 에 접속합니다. <br><br> 
4. **`Google Client ID` `Google Client Secret` `Google Redirect URI`** 를 설정합니다. <br><br>
5. **`Back-end/Login/login.py` `Front-end/screens/GoogleLogin.js`** 의 코드를 알맞게 수정합니다. <br><br>
