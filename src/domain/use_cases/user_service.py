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

    def check_user(self, membername: str, memberpass: str) -> bool:
        return self.user_repository.check_user(membername, memberpass)

    def get_data(self, current_user: str):
        return self.user_repository.get_data(current_user)

    def get_patient_data(self, patient_id: str, current_user: str):
        return self.user_repository.get_patient_data(patient_id, current_user)

    def store_data(self, current_user: str, patient: PatientData):
        return self.user_repository.store_data(current_user, patient)

    def append_data(self, current_user: str, patient: PatientData):
        return self.user_repository.append_data(current_user, patient)
    
    def generate_summary(self, patient_id: str, data: list[str]):

        print(patient_id, data)
        messages=[]
        messages.append({
      "role":"system",
      "content":"""You are a helpful assistant. Your job is to provide a detailed summary on the content provided by the user. Your response should be in the form of json response. The keys of the json data should be as follows: 
       - Summmary
       - Subjective 
       - Objective 
       - Assessments
       - Plans
      \n

      
      """
        })

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
    
    def inform_login(self, username: str):
        return self.user_repository.inform_login(username)
    
    def save_detailed_data(self, patient_id: str, prev):
        return self.user_repository.save_detailed_data(patient_id, prev)
    
    def update_transctiption(self, patient_id: str, details, summary):
        return self.user_repository.update_transctiption(patient_id, details, summary)


