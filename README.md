# 🌐 OSS Team Project
_2024학년도 1학기 전북대학교 **OSS 팀 프로젝트**_
<br><br>

## 🚀 영칼로리

### ✅ 프로젝트 명
🧑🏼‍🍳 **`영칼로리`** = `영양소 + 칼로리`
<br><br>

### ✅ 팀 구성
|이름|담당|역할|
|---|---|---|
|이정우|**`Front-end`**|`팀장` `문서 작업` `UI 디자인` `Front-end 총괄`|
|이민혁|**`Front-end`**|`UI 디자인`|
|장정우|**`Back-end`**|`음식 인식 모델(AI)` `API 구축` `데이터베이스 구축`<br> `코드 연동 (Front + Back)` `GIT 버전 관리` `Notion 문서정리`|
|조훈희|**`Back-end`**|`데이터베이스 구축` `로그인 기능`|
<br>

### ✅ 기술 스택

✔ **`Front-end`**

<img src="https://img.shields.io/badge/javascript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black"><img src="https://img.shields.io/badge/react-61DAFB?style=for-the-badge&logo=react&logoColor=black"><img src="https://img.shields.io/badge/expo-000020?style=for-the-badge&logo=expo&logoColor=white">

✔ **`Back-end`**

<img src="https://img.shields.io/badge/python-3776AB?style=for-the-badge&logo=python&logoColor=white"><img src="https://img.shields.io/badge/flask-000000?style=for-the-badge&logo=flask&logoColor=white"><img src="https://img.shields.io/badge/firebase-FFCA28?style=for-the-badge&logo=firebase&logoColor=white"><img src="https://img.shields.io/badge/YOLO-071D49?style=for-the-badge&logo=YOLO&logoColor=black"><img src="https://img.shields.io/badge/ngrok-1F1E37?style=for-the-badge&logo=ngrok&logoColor=white"><img src="https://img.shields.io/badge/swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black">

✔ **`API`**

<img src="https://img.shields.io/badge/kakao-FFCD00?style=for-the-badge&logo=kakao&logoColor=white"><img src="https://img.shields.io/badge/google-4285F4?style=for-the-badge&logo=google&logoColor=black"><img src="https://img.shields.io/badge/openAI-412991?style=for-the-badge&logo=openAI&logoColor=black">

✔ **`Tool`**

<img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white"><img src="https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white"><img src="https://img.shields.io/badge/notion-000000?style=for-the-badge&logo=notion&logoColor=white"><img src="https://img.shields.io/badge/figma-F24E1E?style=for-the-badge&logo=figma&logoColor=white">
<br><br>

### ✅ 개요
_다이어트나 건강 관리와 같은 이유로 식단 조절이 필요한 사람한테 도움을 줄 수 있는 **식단 관리 지원 프로그램**_
<br><br>

### ✅ 주요 기능
_1. 소셜 로그인 연동 지원 **`(Google / Kakao)`**_ <br><br>
_2. 사용자가 업로드한 **음식 사진을 분석**하여 사진에 있는 **음식의 영양 성분, 칼로리** 등의 정보 제공_<br><br>
_3. 분석한 음식 정보를 바탕으로 사용자 **목표 섭취량** 달성 여부 확인_<br><br>
_4. 사용자의 식단에서 부족한 **영양 성분**을 기반으로 **음식 또는 근처 식당** 추천_
<br><br>

### ✅ 서비스 구성도
<img src="https://github.com/jeongwoo1998/OSS_TeamProject/assets/56586533/bf4159b1-a9a4-4b7c-8fb3-396678e7a296" width="800" height="600"/>
<br><br>

### ✅ 기대 효과
- _식단 관리가 필요한 사람에게 자동으로 음식에 대한 정보 **(영양소, 칼로리)** 를 제공 및 취합하여 사용자의 식단 관리 지원_
- _사용자의 **하루 목표 섭취량 달성 여부**가 한 눈에 보이므로 체중 관리에 동기부여_
- _**메뉴 선정 및 식당 선택**에 대한 고민 감소_
<br><br>

*“식습관을 기록하는 앱 사용자를 대상으로 한 연구 결과 대상자의 약 77.9%에서 성공적인 체중 감량 효과를 확인했으며 **이 중 23%는 본인 체중의 10% 이상 감량** 에 성공한 것으로 나타났다.”*

**[출처] 의학신문**
<br><br>

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
1. **`Notion`** 에 정리되어 있는  **`API KEY`** 참고하여 파일에 넣습니다.
<br><br>

### ⚠ 주의 사항

**`Google Login`**
1. **`ngrok`** 설치 후 터미널에서 실행합니다. <br><br>
2. **`ngrok http 5000`** 입력 후 나온 주소를 확인합니다.<br><br>
3. **`Google Cloud Console`** 에 접속합니다. <br><br> 
4. **`Google Client ID` `Google Client Secret` `Google Redirect URI`** 를 설정합니다. <br><br>
5. **`Back-end/Login/login.py` `Front-end/screens/GoogleLogin.js`** 의 코드를 알맞게 수정합니다.