import asyncio
import json
import logging
from typing import Any, Dict, List
from ai71 import AI71
from config.config import OPEN_AI_API_KEY
from src.constants.prompts import Prompts
import re
from openai import OpenAI
from config.config import AI71_API_KEY, AI71_BASE_URL
from src.infastructure.repositories.search_repository import SearchRepository

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
        self.__open_ai_model = "gpt-4o"
        self.__client = OpenAI(
            api_key=AI71_API_KEY,
            base_url=AI71_BASE_URL,
        )
        self.__openai_client = OpenAI(api_key=OPEN_AI_API_KEY)

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
                    - weight
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

                        {   "wight": 70,
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

    def process_output_from_json(self, output):

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
                "role": "system",
                "content": f"""You have the user query. Your task is to ask follow up question to the user query. The answer should only be in the json format only and no other form of text. It should be in the format of followup_question and the choices as the keys. Remember that there should not be un necessary follow up questions and the number of follow up questions should be as minimum as possible.\n

                    You should only ask follow up questions if the user query is related to the health domain or some common phrases like hi, hello, can you describe more etc. If the user query is neither related to healthcare or its off topic and neither some common queestion phrase then say give the response as followup_question as the key and the a value which tells someting like: sorry you can only respond to queries related to healthcare.\n

                    For example:
                    User query: "What is the HbA1c test?"
                    followup_question: “What would you like to know about the HbA1c test?”
        

                    User query: "I have a headache."
                    followup_question: “Can you describe the headache?”
       

                    User query: "Donepezil?"
                    followup_question: “What would you like to know about Donepezil?”
               

                    User query: "What is the capital of France?"
                    followup_question: "Sorry you can only respond to queries related to healthcare."
         

                    The user query is: User query: {user_query}


                   Remember you only need to  give the response the answer in the form of json as mentioned in this prompt.

                   """,
            }
        )

        completion = self.__openai_client.chat.completions.create(
            model=self.__open_ai_model,
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


class SummaryRepository:

    def __init__(self) -> None:
        self._model = "tiiuae/falcon-180B-chat"
        self._client = AI71(api_key=AI71_API_KEY)

    def generate_summary(self, data: list[str]):
        messages = []
        messages.append(
            {
                "role": "system",
                "content": """You are a helpful assistant. Your job is to provide a detailed summary on the content provided by the user. Your response should be in the form of json response. The keys of the json data should be as follows: \n
                - summmary
                - subjective 
                - objective 
                - assessment
                - plan
                \n
                """,
            }
        )

        messages.append(
            {
                "role": "user",
                "content": "".join(data),
            },
        )

        completion = self._client.chat.completions.create(
            model=self._model,
            messages=messages,
            max_tokens=3000,
            temperature=0.7,
        )
        raw_string = (
            completion.choices[0].message.content.strip("```json\n").strip("```")
        )
        print(raw_string)

        json_object = json.loads(raw_string)

        return json_object


class ChatResponseRepository:

    def __init__(self) -> None:
        self.__temperature = 0.7
        self.__max_tokens = 3000
        self.__model = "gpt-4o"
        self.__ai71_model = "tiiuae/falcon-180B-chat"
        self.__client = OpenAI(api_key=OPEN_AI_API_KEY)
        self.__ai71_client = OpenAI(
            api_key=AI71_API_KEY,
            base_url=AI71_BASE_URL,
        )

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

        # Query handler that coordinates web search and OpenAI completion

    def decider(self, query: str, history: List[Dict[str, Any]]) -> bool:
        messages = history.copy()

        messages = [item for item in messages if item["role"] == "user"]

        messages.append(
            {
                "role": "user",
                "content": query,
            },
        )

        messages.append(
            {
                "role": "system",
                "content": f"""You will be given a conversation below and a follow up question. You need to
                rephrase the follow-up question if needed so it is a standalone question that can be used by
                the LLM to search the web for information. You have the previous conversation of the user.
                Find what is the latest question the user is asking from previous few conversations and
                rephrase it as a standalone question optimized to be searched over the internet.

                Example:
                1. Follow up question: What is the capital of France?
                Rephrased: Capital of france


                2. Follow up question: What is the population of New York City?
                Rephrased: Population of New York City
                """,
            }
        )

        completion = self.__client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            max_tokens=50,
            temperature=0.7,
        )

        logging.info(
            "################## Searching for.......",
        )
        logging.info(completion.choices[0].message.content)

        return completion.choices[0].message.content

    async def get_query(
        self,
        query: str,
        history: List[Dict[str, str]],
    ):
        messages = history.copy()

        await asyncio.sleep(0)
        yield {"response": "framing", "status": True, "finished": False}
        await asyncio.sleep(0)

        messages.append(
            {
                "role": "system",
                "content": f"""You are a helpful care advocate assistant to patients and caregivers, who can ONLY provide responses to user queries about healthcare, wellness, and related topics, such as financial, legal, research only if relevant to healthcare and wellness.\n
                If the intent of a user’s query is clear, you must respond either as “internet_search” or "resource_finder". If the questions deals with something realted to healthcare data but not realted to finding any health care hospital etc then respond as "internet_search". If the user query is only a few words or if the intent is not fully clear, you should ask “followup_question” to clarify the intent before providing a final response. \n

                If however you got a clear picture of what the user wants then you must respond as "internet_search" or "resource_finder".

                Do not unnecessarily ask follow up questions. Only response as follow_up  when you are not clear
                about the user query or need more context.

                Example:
                User query: HbA1c test
                Response: followup_question\n

                User query: I am having headache
                Response: followup_question\n

                User query: HbA1c test?
                Response: followup_question\n

                User query: I want to know about HbA1c test
                Response: internet_search\n

                User query: I want to find hospital
                Response: followup_question\n

                User query: I want top3 hospitals nearest to my zip codes which deals with memory care
                Response: resource_finder\n

                User query: I want a python code to add two numbers.
                Response: Sorry, I am designed to assist only on query regardiong healthcare. If you need any assistant please let me know.

                Do not give your answer in bullet points. Write in paragraphs only. Remember you are not suppose
                to give any answer to the user. You are strictly suppose to response as "followup_question"
                when there is a need to ask follow up questions respond as "internet_search" only for normal response or "resource_finder" for resource finding.
                """,
            }
        )

        messages.append(
            {
                "role": "user",
                "content": query,
            },
        )
        logging.info("The messages: %s", messages)

        completion = self.__client.chat.completions.create(
            model=self.__model,
            messages=messages,
            max_tokens=50,
            temperature=0.2,
        )

        total_text = completion.choices[0].message.content
        print(total_text)

        logging.info("The messages: %s", messages)

        if total_text == "internet_search":

            await asyncio.sleep(0)
            yield {"response": "researching", "status": True, "finished": False}
            await asyncio.sleep(0)

            response = self.decider(query, history)

            print("########################### search query", response)

            knowledge_base = SearchRepository.search_result(response)
            knowledge_source = [{"body": item["content"]} for item in knowledge_base]

            extracted_docs = []
            await asyncio.sleep(0)
            yield {"response": "drafting", "status": True, "finished": False}
            await asyncio.sleep(0)
            internet_response = self.__ai71_client.chat.completions.create(
                model=self.__ai71_model,
                messages=[
                    {
                        "role": "system",
                        "content": f"""You are a helpful and empathetic care advocate assistant designed to help patients and caregivers. Your goal is to answer the user's query. The answer should be related to the users query only. Answer to the point that addresses the users query.\n

                        If the user query is related to the healthcare domain and the knowledge sources does not have enough information to answer the user query then you can try to give response on your own.\n
                        
                        \n If the none of the data  contain enough information to respond to the question and you are also not sure about the proper answer to the user query then you need to give the following phrase as the output only "NOT_ENOUGH_INFORMATION".
                    \n The data from which you can frame your answer are as follows:\n
                    1. {str(knowledge_source)} \n\n

                    Do not give your answer in bullet points. Write in paragraphs only.

                    The user query is as follows: {response}
                    """,
                    },
                ],
                max_tokens=1000,
                temperature=0.1,
                stream=True,
            )

            sentence_buffer = ""
            main_agent_total_text = ""

            for chunk in internet_response:
                if chunk.choices[0].delta.content is not None:
                    logging.info(chunk.choices[0].delta.content)
                    sentence_buffer += chunk.choices[0].delta.content
                    main_agent_total_text += chunk.choices[0].delta.content

                    if sentence_buffer.endswith((".", "!", "?")):

                        await asyncio.sleep(0)
                        yield {
                            "response": sentence_buffer.strip(),
                            "followup": False,
                            "status": False,
                            "finished": False,
                        }

                        await asyncio.sleep(0)
                        sentence_buffer = ""

            if main_agent_total_text == "NOT_ENOUGH_INFORMATION":
                await asyncio.sleep(0)
                yield {
                    "response": "Sorry I do not have enough information to answer your question.",
                    "status": False,
                    "finished": True,
                }
                await asyncio.sleep(0)

            else:
                extracted_data = [
                    {
                        "title": item["title"][:28],
                        "href": item["url"],
                        "content": item["content"][:40],
                        "source": "url",
                    }
                    for item in knowledge_base
                ]

                extracted_data.extend(extracted_docs)
                await asyncio.sleep(0)

                yield {
                    "response": "You can visit the below sources for more information or ask me to learn more",
                    "status": False,
                    "finished": False,
                }
                await asyncio.sleep(0)

                await asyncio.sleep(0)
                yield {"sources": extracted_data, "status": False, "finished": True}
                await asyncio.sleep(0)

        elif total_text == "followup_question":

            await asyncio.sleep(0)
            yield {"response": "followup", "status": True, "finished": False}

            await asyncio.sleep(0)
            health_assistant = HealthAssistant()
            response = health_assistant.run_health_assistant(history, query)

            await asyncio.sleep(0)
            yield {
                "response": response,
                "followup": True,
                "status": False,
                "finished": True,
            }
            await asyncio.sleep(0)

        else:
            await asyncio.sleep(0)
            yield {"response": total_text, "status": False, "finished": True}
            await asyncio.sleep(0)
