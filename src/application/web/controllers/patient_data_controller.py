import logging
from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from src.infastructure.repositories.chat_repository import ChatResponseRepository
from src.infastructure.repositories.database_repository import DatabaseRepository
from src.domain.interfaces.chat_interface import ChatInterface
from src.domain.use_cases.chat_service import ChatService
from src.connection_manager.connection_manager import ConnectionManager

pateiend_router = APIRouter()

manager = ConnectionManager()

database_repository = DatabaseRepository()

chat_response_repository = ChatResponseRepository()
chat_service = ChatService(chat_response_repository, database_repository)


@pateiend_router.websocket("/health_metrics/{client_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    client_id: str,
    chat_interface: ChatInterface = Depends(chat_service),
):

    # Connect the websocket
    await manager.connect(websocket, client_id, "data")

    logging.info(f"Client #{client_id} connected for health metrics")
    all_messages = []
    try:
        while True:
            # Wait for the message from the client
            data = await websocket.receive_json()

            received_data = {"role": "user", "content": data["query"]}
            all_messages.append(received_data)

            logging.info(type(data))

            # Log the message
            logging.info(f"Client #{client_id} sent: {data}")

            # Create a chat response
            chat_response = chat_interface.chat_response(
                "user", data["query"], all_messages
            )

            # Log the response
            llm_response = {"role": "system", "content": chat_response}

            # Append the response to the all_messages list
            all_messages.append(llm_response)

            # Send the response to the client
            await manager.send_personal_message(chat_response, websocket)

    except WebSocketDisconnect:

        # Disconnect the websocket
        await manager.disconnect(websocket)
