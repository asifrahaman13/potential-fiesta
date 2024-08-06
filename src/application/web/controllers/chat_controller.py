import logging
from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from src.application.web.controllers.function import get_query
from src.connection_manager.connection_manager import ConnectionManager

manager = ConnectionManager()
chat_router = APIRouter()


@chat_router.websocket("/chat/{client_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    client_id: str,
):
    await manager.connect(websocket, client_id)
    messages = []
    try:
        while True:
            try:
                data = await websocket.receive_text()
                messages.append({"role": "user", "content": data})
                logging.info(data)
                async for response in get_query(data, messages):
                    logging.info(f"Received data is {response}")
                    if "response" in response:
                        messages.append(
                            {"role": "system", "content": str(response["response"])}
                        )
                    logging.info("################# Receive response")
                    logging.info(response)
                    await manager.send_personal_message(response, websocket)
            except WebSocketDisconnect:
                await manager.disconnect(websocket)
                break
    except WebSocketDisconnect:
        await manager.disconnect(websocket)
