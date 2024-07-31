# src/infrastructure/repositories/user_repository.py

from typing import Any, Dict, List
from src.domain.entities.user import UserData, Vadata, VeteranData
from sqlmodel import Session, create_engine, select
from urllib.parse import quote
from src.domain.entities.user import PatientData, InformLogin
from datetime import datetime
from pymongo import MongoClient


class UserRepository:

    def __init__(self):
        self.__client = MongoClient("mongodb://localhost:27017/")
        self.__database = self.__client["fiesta"]

    def find_single_entity_by_field_name(
        self, collection_name: str, field_name: str, field_value: str
    ):
        try:
            collection = self.__database[collection_name]
            result = collection.find_one({field_name: field_value})
            result["_id"] = str(result["_id"])
            return result
        except Exception as e:
            return None

    def find_all_entities_by_field_name(
        self, collection_name: str, field_name: str, field_value: str
    ):
        try:
            collection = self.__database[collection_name]
            result_cursor = collection.find({field_name: field_value})

            # Convert cursor to list and ensure _id is a string
            result_list = []
            for item in result_cursor:
                item["_id"] = str(item["_id"])  # Convert ObjectId to string
                result_list.append(item)

            return result_list
        except Exception as e:
            print(f"An error occurred: {e}")
            return None
    

    # def get_patient_data(self, visitId: str, current_user: str):
    #     user_data = {}
    #     try:
    #         with Session(self.engine) as session:

    #             # Assuming you want to fetchall records, adjust the query as needed
    #             user_data_list = select(UserData).where(
    #                 (UserData.visitId == visitId) & (UserData.user_id == current_user)
    #             )
    #             results = session.exec(user_data_list).first()
    #             session.close()
    #             return results.model_dump()
    #     except Exception as e:
    #         print(e)

    #     return user_data

    # Append item to dictionary array
    def append_to_field_array(
        self,
        collection_name: str,
        field_name: str,
        field_value: str,
        array_name: str,
        new_data: str,
    ):
        try:
            collection = self.__database[collection_name]
            # Print the query for debugging
            print(
                f"Updating collection '{collection_name}' where {field_name} = '{field_value}'"
            )
            result = collection.update_one(
                {field_name: field_value}, {"$push": {array_name: new_data}}
            )
            # Print result details for debugging
            print(
                f"Update result: matched_count={result.matched_count}, modified_count={result.modified_count}"
            )
            return result
        except Exception as e:
            print(f"An error occurred: {e}")
            return None

    def insert_data(self, collection_name: str, data: List[Dict[str, Any]]):
        try:
            collection = self.__database[collection_name]
            result = collection.insert_one(data)
            print(result)
            return True
        except Exception as e:
            return False

    def get_summary(self, visitId: str):
        user_data = {}
        try:
            with Session(self.engine_evva) as session:
                # Assuming you want to fetchall records, adjust the query as needed
                user_data_list = select(VeteranData).where(
                    VeteranData.patient_id == visitId
                )
                results = session.exec(user_data_list).first()

                user_data = results.result

                session.close()
        except Exception as e:
            print(e)

        return user_data