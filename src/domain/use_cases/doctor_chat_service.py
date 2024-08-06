import asyncio
from typing import Dict, List
from src.domain.interfaces.doctor_chat_interface import DoctorChatInterface


class DoctorChatService(DoctorChatInterface):
    def __init__(self, chat_repository) -> None:
        self.chat_repository = chat_repository

    async def get_query(
        self,
        query: str,
        history: List[Dict[str, str]],
    ):
        async for response in self.chat_repository.get_query(query, history):
            print(response)
            await asyncio.sleep(0)
            yield response
            await asyncio.sleep(0)
