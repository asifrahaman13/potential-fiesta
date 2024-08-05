from src.domain.use_cases.user_service import UserService
from src.domain.use_cases.auth_service import AuthenticationService
from src.domain.use_cases.chat_service import ChatService
from src.infastructure.repositories.auth_repository import AuthRepository
from src.infastructure.repositories.chat_repository import ChatResponseRepository, SummaryRepository
from src.infastructure.repositories.database_repository import DatabaseRepository


class DIContainer:
    def __init__(self):
        self.__instances={}

    def get_database_repository(self):
        if "database_repository" not in self.__instances:
            self.__instances["database_repository"] = DatabaseRepository()
        return self.__instances["database_repository"]
    
    def get_chat_response_repository(self):
        if "chat_response_repository" not in self.__instances:
            self.__instances["chat_response_repository"] = ChatResponseRepository()
        return self.__instances["chat_response_repository"]
    
    def get_summaary_repository(self):
        if "summary_repository" not in self.__instances:
            self.__instances["summary_repository"]=SummaryRepository()
        return self.__instances["summary_repository"]
    
    def get_auth_repository(self):
        if "auth_repository" not in self.__instances:
            self.__instances["auth_repository"] = AuthRepository()
        return self.__instances["auth_repository"]
    
    def get_chat_service(self):
        if "chat_service" not in self.__instances:
            self.__instances["chat_service"] = ChatService(self.get_chat_response_repository(), self.get_database_repository())
        return self.__instances["chat_service"]
    
    def get_auth_service(self):
        if "auth_service" not in self.__instances:
            self.__instances["auth_service"] = AuthenticationService(self.get_auth_repository())
        return self.__instances["auth_service"]
    
    def get_user_service(self):
        if "user_service" not in self.__instances:
            self.__instances["user_service"] = UserService(self.get_database_repository(), self.get_summaary_repository())
        return self.__instances["user_service"]
    

container = DIContainer()


def get_auth_service():
    return container.get_auth_service()

def get_chat_service():
    return container.get_chat_service()

def get_user_service():
    return container.get_user_service()

def get_database_repository():
    return container.get_database_repository()