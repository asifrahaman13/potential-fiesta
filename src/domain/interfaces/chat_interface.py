from abc import ABC, abstractmethod
from typing import Any, AsyncGenerator, Dict, List


class ChatInterface(ABC):

    @abstractmethod
    def chat_response(
        self, user: str, password: str, query: str, all_messages: List[Dict[str, str]]
    ) -> None:
        """Generate a chat response based on the user, query, and previous messages."""
        pass
