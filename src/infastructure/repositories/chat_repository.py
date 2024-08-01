import json
import logging
from config.config import OPEN_AI_API_KEY
from openai import OpenAI
from src.domain.entities.chat import HealthData
from langchain.output_parsers import PydanticOutputParser
from langchain.prompts import ChatPromptTemplate, HumanMessagePromptTemplate
from src.constants.prompts import Format, Prompts

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(levelname)s - %(message)s"
)

import re
from langchain_openai import ChatOpenAI


def detect_summary(text):
    pattern = r"\bSummary(?:\sread)?\b"
    matches = re.findall(pattern, text)
    return bool(matches)

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
        json_content = output.content.strip("```json\n").strip("```")
        try:
            return json.loads(json_content)
        except json.JSONDecodeError as e:
            logging.error(f"Failed to parse JSON: {e}")
            return None

    def format_input(self, user_query):

        # Create a prompt
        parser = PydanticOutputParser(pydantic_object=HealthData)

        # Create a prompt
        prompt = ChatPromptTemplate(
            messages=[
                HumanMessagePromptTemplate.from_template(
                    Format.HEALTH_ASSISTANT_FORMAT_PROMPT.value
                )
            ],
            # Define the input variables
            input_variables=["question"],
            partial_variables={"format_instructions": parser.get_format_instructions()},
        )
        return prompt.format_prompt(question=user_query)


        # Create a prompt
        parser = PydanticOutputParser(pydantic_object=GeneralParameters)

        # Create a prompt
        prompt = ChatPromptTemplate(
            messages=[
                HumanMessagePromptTemplate.from_template(
                    Format.FORMAT_USER_GENERAL_METRICS_PROMPT.value
                )
            ],
            # Define the input variables
            input_variables=["question"],
            partial_variables={"format_instructions": parser.get_format_instructions()},
        )
        return prompt.format_prompt(question=user_query)

    def run_health_assistant(self, user_query):

        # Format the input
        input_prompt = self.format_input(user_query)

        # Invoke the model
        output = self.chat_model.invoke(input_prompt.to_messages())

        # Process the output
        return self.process_output(output)



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
            health_data = assistant.run_health_assistant(response)
            logging.info(health_data)

            return {
                "summary": True,
                "response": response,
                "response_schema": health_data,
            }

        return {"summary": False, "response": response}