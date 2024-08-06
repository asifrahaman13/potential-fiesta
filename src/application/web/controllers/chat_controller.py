import asyncio
import logging
from fastapi import APIRouter, Depends, WebSocket, WebSocketDisconnect
from src.domain.interfaces.doctor_chat_interface import DoctorChatInterface
from src.connection_manager.connection_manager import ConnectionManager
from exports.exports import get_doctor_chat_service

manager = ConnectionManager()
chat_router = APIRouter()


@chat_router.websocket("/chat/{client_id}")
async def websocket_endpoint(
    websocket: WebSocket,
    client_id: str,
    doctor_chat_interface: DoctorChatInterface = Depends(get_doctor_chat_service),
):
    await manager.connect(websocket, client_id)
    messages = []
    await asyncio.sleep(0)
    await manager.send_personal_message(
        {
            "response": "Hello I am your personal assistant. Ask me anything.",
            "followup": False,
            "status": False,
            "finished": True,
        },
        websocket,
    )
    await asyncio.sleep(0)
    try:
        while True:
            try:
                data = await websocket.receive_text()
                messages.append({"role": "user", "content": data})
                logging.info(data)
                async for response in doctor_chat_interface.get_query(data, messages):
                    logging.info(f"Received data is {response}")
                    if "response" in response:
                        messages.append(
                            {"role": "system", "content": str(response["response"])}
                        )
                    logging.info("################# Receive response")
                    logging.info(response)
                    await asyncio.sleep(0)
                    await manager.send_personal_message(response, websocket)
                    await asyncio.sleep(0)
            except WebSocketDisconnect:
                await manager.disconnect(websocket)
                break
    except WebSocketDisconnect:
        await manager.disconnect(websocket)
