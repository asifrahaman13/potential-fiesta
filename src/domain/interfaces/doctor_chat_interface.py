from abc import ABC, abstractmethod
from typing import Dict, List


class DoctorChatInterface(ABC):
    @abstractmethod
    async def get_query(query: str, history: List[Dict[str, str]]):
        pass
