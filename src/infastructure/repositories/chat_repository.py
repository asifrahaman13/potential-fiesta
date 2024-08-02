import json
import logging
from config.config import OPEN_AI_API_KEY
from src.constants.prompts import Prompts
import re
from openai import OpenAI
from config.config import AI71_API_KEY, AI71_BASE_URL

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)


def detect_summary(text):
    pattern = r"\bSummary(?:\sread)?\b"
    matches = re.findall(pattern, text)
    return bool(matches)


class HealthAssistant:
    def __init__(self):
        self.__model = "tiiuae/falcon-180B-chat"
        self.__client = OpenAI(
            api_key=AI71_API_KEY,
            base_url=AI71_BASE_URL,
        )

    def parse_output(self, raw_data: str):
        try:
            json_decoded_result = json.loads(raw_data)
            return json_decoded_result
        except Exception as e:
            logging.error(f"Error parsing output: {e}")
            return None

    def process_output(self, raw_data: str):
        # Streaming invocation:
        response = self.__client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": """You are a helpful and friendly assistant. Your job is to extract the details from the user provided data and format that into json. Only give the json response. There should be keys and values. No need to give any form of units. If any value is not provided just make the value as 0. The keys should be as follows:  \n
                    - systol_blood_pressure
                    - diastol_blood_pressure
                    - heart_rate
                    - respiratory_rate
                    - blood_temperature
                    - step_count
                    - calories_burned
                    - distance_travelled
                    - sleep_duration
                    - water_consumed
                    - caffeine_consumed
                    - alcohol_consumed\n
                        
                        Examples: 

                        {
                            "systol_blood_pressure": 120,
                            "diastol_blood_pressure": 80,
                            "heart_rate": 72,
                            "respiratory_rate": 18,
                            "blood_temperature": 37,
                            "step_count": 5000,
                            "calories_burned": 300,
                            "distance_travelled": 4.83,
                            "sleep_duration": 7,
                            "water_consumed": 2,
                            "caffeine_consumed": 150,
                            "alcohol_consumed": 44.36
                        }
                        
                
                """,
                },
                {
                    "role": "user",
                    "content": raw_data,
                },
            ],
            model=self.__model,
        )

        output = response.choices[0].message.content

        print(output)

        result = self.parse_output(output)

        return result


class ChatResponseRepository:

    def __init__(self) -> None:
        self.__temperature = 0.7
        self.__max_tokens = 3000
        self.__model = "gpt-4o"
        self.__client = OpenAI(api_key=OPEN_AI_API_KEY)

    def chat_response(self, _query, previous_messages=[]):

        messages = previous_messages
        messages.append(
            {"role": "user", "content": _query},
        )
        messages.append(
            {
                "role": "system",
                "content": Prompts.CHAT_RESPONSE.value,
            },
        )

        # Create a completion
        response = self.__client.chat.completions.create(
            model=self.__model,
            messages=messages,
            max_tokens=self.__max_tokens,
            temperature=self.__temperature,
        )

        # Get the response
        response = response.choices[0].message.content

        # Check if the response is a summary
        if detect_summary(response):
            assistant = HealthAssistant()
            health_data = assistant.process_output(response)
            logging.info(health_data)

            return {
                "summary": True,
                "response": response,
                "response_schema": health_data,
            }
        return {"summary": False, "response": response}
