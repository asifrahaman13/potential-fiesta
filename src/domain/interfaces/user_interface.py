from abc import ABC, abstractmethod
from src.domain.entities.user import User
from src.domain.entities.user import PatientData


class UserInterface(ABC):
    @abstractmethod
    def get_data(self, current_user: str):
        pass

    @abstractmethod
    def check_user(self, membername, memberpass):
        pass

    @abstractmethod
    def store_data(self, current_user: str, patient: PatientData):
        pass

    @abstractmethod
    def append_data(self, patient: PatientData):
        pass

    @abstractmethod
    def get_patient_data(self, patient_id: str, current_user: str):
        pass

    @abstractmethod
    def get_patient_visits(self, mrn: str, current_user: str):
        pass

    @abstractmethod
    def generate_summary(self, patient_id: str, data: list[str]):
        pass

    @abstractmethod
    def get_summary(self, patient_id: str):
        pass

    @abstractmethod
    def update_qr(self, patient_id: str, data: dict):
        pass

    @abstractmethod
    def get_all_patients(self, doctor_username: str):
        pass
