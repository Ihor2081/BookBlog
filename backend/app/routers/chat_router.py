from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.chat_manager import chat_manager

router = APIRouter(prefix="/ws", tags=["Chat"])

@router.websocket("/chat/{room_id}")
async def websocket_chat_endpoint(websocket: WebSocket, room_id: str):
    # Менеджер бере на себе всю роботу з Redis Pub/Sub
    await chat_manager.connect_room(websocket, room_id)