### 🧑🏼‍🍳 사용 방법 
* * *

**`VS Code`** 를 통해 **`Back-end`** 폴더를 실행합니다.

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
❗ _실행 전 [🔑 필수 설정](#-필수-설정)을 확인합니다._
1. **`app.py`** 파일을 실행시킵니다. <br><br>

### ⚠ 오류 발생 시
**`quantity_est` `yolov3` 인식이 안될 경우** _(원인 ➡ 파일 압축 해제 과정에서 파일 중복)_

- _**`Back-end/FoodRecognition/foodRecognition.py` 코드 아래와 같이 수정**_

```python
from quantity_est.quantity_est.food_quantity_model import quantity
from yolov3.yolov3.food_recognition_model import detect, get_nutrients
```

### 🌈 _How to use API_
_**Swagger :**_ **`localhost:5000/swagger`**
<br><br>