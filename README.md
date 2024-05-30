### OSS 0Kcal Server
## 해당 코드는 아직 실행되지 않는 스켈레톤 코드임을 알림
<br>
1. 해당 서버 프로그램은 VScode에서 실행을 기준으로 합니다

2.  Console을 실행하여

    python -m venv venv
    venv\Scripts\activate
    pip install -r requirements.txt

해당 작업으로 venv라는 가상환경을 생성

3. Firebase에서 json을 가져와 authenticaiotn디렉토리에
    "firebase_auth.json"을 생성

4. https://console.cloud.google.com/dptj Outh클라이언트ID를 발급받고 ID와 시크릿 키를 Firebase_auth에 입력

5. app.py 실행(아직 실행되지 않음)
