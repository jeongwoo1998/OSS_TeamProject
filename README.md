### OSS 0Kcal Server

* 해당 서버 프로그램은 VScode에서 실행을 기준으로 합니다

1.  Console을 실행하여

    python -m venv venv
    <br>
    venv\Scripts\activate
    <br>
    pip install -r requirements.txt

2. Firebase에서 json을 가져와 authenticaiotn디렉토리에
    "firebase_auth.json"을 생성

3. Food_recognitoin Branch의 READ.ME에 적힌 Yolov3와 Quantity_est를 압축 해제 하여
    libs 디렉토리 안에 넣을 것.

4. app.py 실행
