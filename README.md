### OSS 0Kcal Login API
## 2024.06.04 UPDATE
## ★ 해당 서버 코드의 localhost 포트는 windows 기준으로 작성되어 있습니다
## ★ MAC의 Airplay 프로그램을 완전히 종료 한 뒤 사용하거나 포트 번호를 변경한 뒤에 사용해 주시기 바랍니다.
<br>
1. 해당 서버 프로그램은 VScode에서 실행을 기준으로 합니다
<br>
2.  Console을 실행하여
<br><br>
    python -m venv venv
    venv\Scripts\activate
    pip install -r requirements.txt
<br><br>
해당 작업으로 venv라는 가상환경을 생성
<br><br>
3. Firebase에서 json을 가져와 authenticaiotn/firebase_auth.json에
<br><br>
google_oauth_clinet.json<br>
1. firebase 프로젝트 개요 오른쪽의 톱나바퀴 설정 버튼을 누릅니다. <br>
2. 프로젝트 설정 창이 나오면 서비스 계정에 들어갑니다.<br>
3. Firebase Admin SDK를 선택하고, 새 비공개 키 생성을 누릅니다<br>
4. 생성해 준 json 파일을 다운로드 받아 authentificaiton 디렉토리 안에 넣습니다<br>
5. 이름을 google_oauth_clinet.json로 변경한 후 해당 서식을 복사 후 적절히 코드를 복사 및 붙여넣기 합니다.<br>

```json
{
  "web": {
    "client_id": "YOUR_GOOGLE_CLIENT_ID",
    "project_id": "YOUR_PROJECT_ID",
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_secret": "YOUR_GOOGLE_CLIENT_SECRET",
    "redirect_uris": [
      "http://localhost:5000/login/callback"
    ],
    "javascript_origins": [
      "http://localhost"
    ]
  },
  "apiKey": "YOUR_API_KEY",
  "authDomain": "YOUR_PROJECT_ID.firebaseapp.com",
  "databaseURL": "https://YOUR_PROJECT_ID.firebaseio.com",
  "projectId": "YOUR_PROJECT_ID",
  "storageBucket": "YOUR_PROJECT_ID.appspot.com",
  "messagingSenderId": "YOUR_MESSAGING_SENDER_ID",
  "appId": "YOUR_APP_ID",
  "measurementId": "YOUR_MEASUREMENT_ID"
  }
```
<br>
google_service_account_key.json<br>
1. firebase 프로젝트 개요 오른쪽의 톱나바퀴 설정 버튼을 누릅니다. <br>
2. 프로젝트 설정 창이 나오면 서비스 계정에 들어갑니다.<br>
3. 구글 클라우드 링크로 된 _서비스 계정_ 라 적힌 링크로 접속합니다 <br>
4. Google Cloud 로고 오른쪽 메뉴 바를 열어 API 및 서비스를 클릭합니다. <br>
5. 사용자 인증 정보 탭을 누르고 OAuth 2.0 클라이언트 ID를 생성합니다.<br>
5.1 사용자 인증 정보 라고 적힌 오른쪽 탭에 + 사용자 인증 정보 만들기 링크에서 Oauth 클라이언트 ID를 생성할 수 있습니다.<br>
5.2 유형은 웹 애플리케이션으로 설정합니다.<br>
6. 다시 사용자 인증 정보로 돌아와 Oauth2.0 클라이언트 ID 오른쪽 다운로드 표시를 다운 받습니다.<br>
7. google_service_account_key.json의 형태를 복사 한뒤 적절히 키를 덮어쓰기 합니다.

```json
{
  "web": {
    "type": "service_account",
  "project_id": "oss-teamproject",
  "private_key_id": "YOUR_PRIAVTE_ID_KEY",
  "private_key": "YOUR_PRIAVTE_KEY",
  "client_email": "firebase-adminsdk-24drk@oss-teamproject.iam.gserviceaccount.com",
  "client_id": "YOUR_CLIENT_ID",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-24drk%40oss-teamproject.iam.gserviceaccount.com",
  "universe_domain": "googleapis.com"
  }
```
<br>
kakao_oauth_client.json <br>
1.  https://developers.kakao.com/console/app 에 접속합니다.<br>
2. 애플리케이션을 추가합니다. <br>
#### 3. (중요) 이미지를 추가 해야 비즈니스가 가능해지니 꼭 이미지를 1개 업로드 해야 합니다. <br>
4. 로고 밑 메뉴 바를 클릭한 뒤에 카카오 로그인/ 동의 항목 으로 들어갑니다. <br>
5. 동의 항목에 들어가 개인정보 동의항목 심사 신청으로 이메일을 필수 동의로 받을 수 있도록 (비즈니스 정보 신청)합니다.<br>
6. 이제 다시 동의 항목 칸으로 돌아와 카카오 계정(이메일)을 활성화 합니다.<br>
7. 이제 다시 로고 밑 메뉴바를 열어 앱 키로 이동합니다.<br>
8. REST API키를 복사하여 YOUR_API_KEY에 적용합니다.<br>
9. 메뉴 바를 열어 보안 탭을 클릭한뒤 API 비밀번호를 받아 YOUR_API_SECRET에 적용합니다


```json
{
    "apiKey": "YOUR_API_KEY",
    "apiSecret" :"YOUR_API_SECRET",
    "redirect_uri": "http://localhost:5000/login/kakao/callback"
  }
```
<br>
<br>
5. app.py 실행합니다.