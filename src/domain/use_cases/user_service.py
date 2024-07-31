from typing import Any, Dict, List
from config.config import OPENAI_KEY
from src.domain.entities.user import PatientData
from src.domain.interfaces.user_interface import UserInterface
from src.infastructure.repositories.user_repository import UserRepository
from fastapi.security import OAuth2PasswordBearer
from openai import OpenAI

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


class UserService(UserInterface):
    def __call__(self) -> UserInterface:
        return self

    def __init__(self, user_repository: UserRepository):
        self.user_repository = user_repository

    # API to log in the user. Its ch3ecks the user credentials and returns a boolean value
    def check_user(self, membername: str, memberpass: str) -> bool:
        # Check if the user exists in the database
        user_credentaials = self.user_repository.find_single_entity_by_field_name(
            "userdata", "username", membername
        )
        if user_credentaials:
            if user_credentaials["password"] == memberpass:
                return True
        return False

    # Store the information of the patient in the database. The first one.
    def store_data(self, current_user: str, patient: PatientData):
        current_user = {"doctor_username": current_user}
        combined_data = {**current_user, **patient}
        return self.user_repository.insert_data("patient_data", combined_data)

    # Append the transcription data to the existing data
    def append_data(self, current_user: str, data: Dict[str, Any]):
        print("Appending data:", data)
        # Call the method to append a new element to the 'details' array
        result = self.user_repository.append_to_field_array(
            "patient_data",  # Collection name
            "visitId",  # Field name to match
            data["visitId"],  # Field value to match
            "details",  # Array field to update
            data["detail"],  # New data to append
        )
        # Return the result of the update operation
        return {
            "success": result.acknowledged,
            "matched_count": result.matched_count,
            "modified_count": result.modified_count,
        }

    # API to get all the patients of the doctor.
    def get_data(self, current_user: str):
        # return self.user_repository.get_data(current_user)
    
        return self.user_repository.find_all_entities_by_field_name("patient_data", "doctor_username", current_user)

    def get_patient_data(self, patient_id: str, current_user: str):
        # return self.user_repository.get_patient_data(patient_id, current_user)
        
        return self.user_repository.find_single_entity_by_field_name("patient_data", "visitId", patient_id)

    def generate_summary(self, patient_id: str, data: list[str]):

        print(patient_id, data)
        messages = []
        messages.append(
            {
                "role": "system",
                "content": """You are a helpful assistant. Your job is to provide a detailed summary on the content provided by the user. Your response should be in the form of json response. The keys of the json data should be as follows: 
       - Summmary
       - Subjective 
       - Objective 
       - Assessments
       - Plans
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

        client = OpenAI(api_key=OPENAI_KEY)
        completion = client.chat.completions.create(
            model="gpt-4o",
            messages=messages,
            max_tokens=50,
            temperature=0.2,
        )
        print(completion.choices[0].message.content)
        return completion.choices[0].message.content

    def get_summary(self, patient_id: str):
        return self.user_repository.get_summary(patient_id)
