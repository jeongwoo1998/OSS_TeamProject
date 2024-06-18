import openai
import json

# OpenAI API KEY 설정
openai.api_key = 'YOUR_API_KEY'

def food_recommendations(remaining_intake):
    def get_completion(prompt, model="gpt-3.5-turbo"):
        response = openai.ChatCompletion.create(
            model=model,
            messages=[
                {"role": "system", "content": "You are a nutrition expert."},
                {"role": "user", "content": prompt}
            ],
            temperature=0.5,
        )
        return response.choices[0].message["content"]

    # Prompt 작성
    prompt = f"""
    목표 섭취량까지 남은 영양 정보는 다음과 같습니다:
    {remaining_intake}

    이 정보를 바탕으로 부족한 영양소를 채울 수 있는 적절한 음식을 JSON 형식으로 3가지 추천해주세요.

    단, 제약 사항은 다음과 같습니다:

    1. 한국에 있는 식당에서 파는 음식이어야 한다. (꼭 한식일 필요는 없음)
    2. 음식 이름은 한글로, 아래 형식을 따라서 작성되어야 한다.
    3. 음식은 하나씩만 추천이 가능하다. (~와, ~과 불가능)

    [
        {{
            "food": ""
        }},
        {{
            "food": ""
        }},
        {{
            "food": ""
        }}
    ]
    """

    recommendation = get_completion(prompt)

    try:
        recommended_foods = json.loads(recommendation)
        return recommended_foods
    except json.JSONDecodeError:
        return f"Failed to parse JSON: {recommendation}"