### OSS 0Kcal Server
## 해당 코드는 아직 실행되지 않는 스켈레톤 코드임을 알림
<br>
1. 해당 서버 프로그램은 VScode에서 실행을 기준으로 합니다
<br>
2.  Console을 실행하여
<br>
    python -m venv venv
    venv\Scripts\activate
    pip install -r requirements.txt
<br>
해당 작업으로 venv라는 가상환경을 생성
<br>
3. Firebase에서 json을 가져와 authenticaiotn/firebase_auth.json에
<br>

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
4. https://console.cloud.google.com/ 에서 Outh클라이언트ID를 발급받고 ID와 시크릿 키를 Firebase_auth에 입력
<br>
5. app.py 실행(아직 실행되지 않음)