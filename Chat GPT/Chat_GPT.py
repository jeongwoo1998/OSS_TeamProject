import openai
import json

# OpenAI API KEY
openai.api_key = 'YOUR_API_KEY'

def get_completion(prompt, model="gpt-3.5-turbo"):
    response = openai.ChatCompletion.create(
        model=model,
        messages=[{"role": "user", "content": prompt}],
        temperature=0,
    )
    return response.choices[0].message["content"]

remaining_nutrients = [
    {'calories': 1000, 'carbs': 200, 'protein': 36, 'fat': 50}
]

# Write prompt 
prompt = f"""
목표 섭취량까지 남은 영양 정보는 다음과 같습니다:
{remaining_nutrients}

이 정보를 바탕으로 부족한 영양소를 채울 수 있는 요리를 다음과 같이 JSON 형식으로 3가지 추천해주세요. (추천 음식은 남은 영양 정보를 초과하지 않아야 합니다.):

[
    {{
        "food": "요리 이름",
        "calories": calories,
        "carbs": carbs,
        "protein": protein,
        "fat": fat
    }},
    {{
        "food": "요리 이름",
        "calories": calories,
        "carbs": carbs,
        "protein": protein,
        "fat": fat
    }},
    {{
        "food": "요리 이름",
        "calories": calories,
        "carbs": carbs,
        "protein": protein,
        "fat": fat
    }}
]
"""

recommendation = get_completion(prompt)

try:
    recommended_foods = json.loads(recommendation)
    print("Recommend foods")
    for food in recommended_foods:
        print(food)
except json.JSONDecodeError:
    print("Failed to parse JSON:")
    print(recommendation)
