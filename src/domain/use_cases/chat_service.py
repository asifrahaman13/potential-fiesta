from src.infastructure.repositories.chat_repository import (
    ChatResponseRepository,
)
from src.infastructure.repositories.database_repository import DatabaseRepository
import logging
import time


class ChatService:

    def __init__(
        self,
        chat_repository,
        database_repository,
    ) -> None:
        self.chat_repository = chat_repository
        self.database_repository = database_repository

    def chat_response(self, user, password: str, query, all_messages):

        user_data = self.database_repository.find_single_entity_by_field_name(
            "patient_data", "mrn", user
        )

        if user_data is None:
            return "User not found"

        if user_data["qr"]["password"] != password:
            return "Invalid password"

        # Get the chat response
        response = self.chat_repository.chat_response(query, all_messages)

        # Check if the response is a summary
        if response["summary"] == True:
            try:

                # Check if the user exists in the database
                if_data_exists = (
                    self.database_repository.find_single_entity_by_field_name(
                        "patient_data",
                        "mrn",
                        user,
                    )
                )

                # Add the timestamp to the response
                response["response_schema"]["timestamp"] = int(time.time())

                # Save the chat response
                if if_data_exists is not None:
                    self.database_repository.append_entity_to_array(
                        "mrn",
                        user,
                        "data",
                        response["response_schema"],
                        "patient_data",
                    )

                # If the user does not exist in the database, create a new document
                else:
                    self.database_repository.insert_data(
                        "patient_data",
                        {"email": user, "data": [response["response_schema"]]},
                    )

                # Return the response
                return response["response"]

            except Exception as e:
                logging.error(f"Failed to save chat response: {e}")
        else:
            return response["response"]
