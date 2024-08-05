import json
from typing import Any, Dict
from config.config import AI71_API_KEY
from src.domain.entities.user import PatientData
from src.domain.interfaces.user_interface import UserInterface
from src.infastructure.repositories.database_repository import DatabaseRepository
from fastapi.security import OAuth2PasswordBearer
from ai71 import AI71

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


class UserService(UserInterface):
    def __call__(self) -> UserInterface:
        return self

    def __init__(self, database_repository: DatabaseRepository):
        self.database_repository = database_repository

    # API to log in the user. Its ch3ecks the user credentials and returns a boolean value
    def check_user(self, membername: str, memberpass: str) -> bool:
        # Check if the user exists in the database
        user_credentaials = self.database_repository.find_single_entity_by_field_name(
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
        return self.database_repository.insert_data("patient_data", combined_data)

    # Append the transcription data to the existing data
    def append_data(self, current_user: str, data: Dict[str, Any]):
        # Call the method to append a new element to the 'details' array
        result = self.database_repository.append_to_field_array(
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
        # return self.database_repository.get_data(current_user)

        return self.database_repository.find_all_entities_by_field_name(
            "patient_data", "doctor_username", current_user
        )

    def get_patient_data(self, patient_id: str, current_user: str):
        # return self.database_repository.get_patient_data(patient_id, current_user)

        return self.database_repository.find_single_entity_by_field_name(
            "patient_data", "visitId", patient_id
        )

    def get_patient_visits(self, mrn: str, current_user: str):
        result = self.database_repository.find_all_entities_by_field_name(
            "patient_data", "mrn", mrn
        )
        print(len(result))
        return result

    def generate_summary(self, patient_id: str, data: list[str]):

        print(patient_id, data)
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

        client = AI71(api_key=AI71_API_KEY)
        completion = client.chat.completions.create(
            model="tiiuae/falcon-180b-chat",
            messages=messages,
            max_tokens=1000,
            temperature=0.7,
        )
        raw_string = (
            completion.choices[0].message.content.strip("```json\n").strip("```")
        )
        print(raw_string)

        json_object = json.loads(raw_string)

        result = self.database_repository.insert_field(
            "patient_data", "visitId", patient_id, "summary", json_object
        )

        if result:
            return json_object

    def get_summary(self, patient_id: str):
        return self.database_repository.find_single_entity_by_field_name(
            "patient_data", "visitId", patient_id
        )["summary"]

    def update_qr(self, patient_id: str, data: dict):
        return self.database_repository.insert_field(
            "patient_data", "mrn", patient_id, "qr", data
        )
