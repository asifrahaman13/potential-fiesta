import asyncio
import logging
from typing import Any, List, Dict
from openai import OpenAI
from config.config import OPEN_AI_API_KEY
from src.application.web.controllers.formatting import HealthAssistant
import concurrent.futures
from src.application.web.controllers.search import search_result


health_assistant = HealthAssistant()
client = OpenAI(api_key=OPEN_AI_API_KEY)


# Query handler that coordinates web search and OpenAI completion
def decider(query: str, history: List[Dict[str, Any]]) -> bool:
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

    completion = client.chat.completions.create(
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

    completion = client.chat.completions.create(
        model="gpt-4o",
        messages=messages,
        max_tokens=50,
        temperature=0.2,
    )

    total_text = completion.choices[0].message.content
    print(total_text)

    logging.info("The messages: %s", messages)

    if total_text == "resource_finder":
        await asyncio.sleep(0)
        yield {"response": "researching", "status": True, "finished": False}
        await asyncio.sleep(0)

        response = decider(query, history)

        wrapper_texts = client.chat.completions.create(
            model="gpt-4o",
            messages=[
                {
                    "role": "system",
                    "content": f"""You are a helpful and empathetic care advocate assistant. User asked about some questions on resources finding/heealthcare data finding. You should give some gesture response. Do not include any specific information on the resources.\n


                    If none of the data contain enough information to respond to the question then give a sorry message that you could not find any relevant sources.

                    Examples:

                    Happy to help here are few relevant resources in your nearby location. Let me know if you need more information.\n

                Do not give your answer in bullet points. Write in paragraphs only. Only give few words on gestures only. Do not include much details on the resources. The total sentences should not exceed 2-3.

                The user query is as follows: {response}

                """,
                },
            ],
            max_tokens=50,
            temperature=0.1,
        )

        await asyncio.sleep(0)
        yield {
            "response": wrapper_texts.choices[0].message.content,
            "status": False,
            "finished": False,
        }
        await asyncio.sleep(0)

    elif total_text == "internet_search":

        await asyncio.sleep(0)
        yield {"response": "researching", "status": True, "finished": False}
        await asyncio.sleep(0)

        response = decider(query, history)

        print("########################### search query", response)

        knowledge_base = search_result(response)
        knowledge_source = [{"body": item["content"]} for item in knowledge_base]

        extracted_docs = []
        await asyncio.sleep(0)
        yield {"response": "drafting", "status": True, "finished": False}
        await asyncio.sleep(0)
        internet_response = client.chat.completions.create(
            model="gpt-4o",
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
            max_tokens=500,
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
