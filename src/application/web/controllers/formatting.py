import json
import logging
from typing import Any, Dict, List
from langchain_openai import ChatOpenAI
from openai import OpenAI
from config.config import OPEN_AI_API_KEY
from pydantic import BaseModel

client = OpenAI(api_key=OPEN_AI_API_KEY)


class HealthData(BaseModel):
    followup_question: str
    choices: List[str] | None = []


class HealthAssistant:
    def __init__(self):
        self.__model = "gpt-4o"
        self.__openai_api_key = OPEN_AI_API_KEY
        self.__max_tokens = 3000
        self.chat_model = ChatOpenAI(
            model=self.__model,
            openai_api_key=self.__openai_api_key,
            max_tokens=self.__max_tokens,
        )

    def process_output(self, output):

        # Extract the JSON content
        json_content = output.strip("```json\n").strip("```")
        try:
            return json.loads(json_content)
        except json.JSONDecodeError as e:
            logging.error(f"Failed to parse JSON: {e}")
            return None

    def format_input(self, history_data: List[Dict[str, Any]], user_query: str):

        messages = history_data.copy()
        messages.append(
            {
                "role": "user",
                "content": user_query,
            },
        )

        messages.append(
            {
                "role": "system",
                "content": f"""You have the user query. Your task is to ask follow up question to the user query. The answer should only be in the json format only and no other form of text. It should be in the format of followup_question and the choices as the keys. followup_question will be the followup question and the choices will be the choices in the form of list of strings. However if the question have free text answers then just return the followup question and empty array. Remember that there should not be un necessary follow up questions and the number of follow up questions should be as minimum as possible.\n

                    You should only ask follow up questions if the user query is related to the health domain or some common phrases like hi, hello, can you describe more etc. If the user query is neither related to healthcare or its off topic and neither some common queestion phrase then say give the response as followup_question as the key and the a value which tells someting like: sorry you can only respond to queries related to healthcare.\n

                    For example:
                    User query: "What is the HbA1c test?"
                    followup_question: “What would you like to know about the HbA1c test?”
                    choices: [“Why my physician prescribed it?”, “Help me interpret results”, “How to prepare for it?”, “How frequently should I test?”, "Something else"]\n

                    User query: "I have a headache."
                    followup_question: “Can you describe the headache?”
                    choices: []\n

                    User query: "Donepezil?"
                    followup_question: “What would you like to know about Donepezil?”
                    choices: [“Indications”, “How does it work?”, “When should I take it?”, “Side effects”, “Something else”]\n

                    User query: "What is the capital of France?"
                    followup_question: "Sorry you can only respond to queries related to healthcare."
                    choices: []\n

                    User query: {user_query}

                   """,
            }
        )

        completion = client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            max_tokens=100,
            temperature=0.7,
        )

        return completion.choices[0].message.content

    def run_health_assistant(self, history, user_query):
        # Format the input
        input_prompt = self.format_input(history, user_query)

        # Process the output
        return self.process_output(input_prompt)
