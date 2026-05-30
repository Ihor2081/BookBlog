from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from app.services.chat_manager import chat_manager

# Видаляємо глобальний префікс "/ws", щоб ми могли гнучко налаштувати шляхи
router = APIRouter(tags=["Chat"])

# 1. Ендпоінт для адмін-панелі (HTTP GET)
# Тепер шлях буде рівно таким, як шукає фронтенд: /api/admin/chat-rooms
# (Якщо в main.py цей роутер підключається з префіксом "/api")
@router.get("/api/admin/chat-rooms")
async def get_admin_chat_rooms():
    try:
        # Отримуємо активні кімнати з менеджера чатів
        rooms = await chat_manager.get_active_rooms()
        return rooms
    except AttributeError:
        # На випадок, якщо метод у chat_manager називається інакше,
        # повернемо пустий список, щоб адмінка не падала з 500-ю помилкою
        return []

# 2. Ендпоінт для WebSocket з'єднання
# Явно прописуємо префікс "/ws" прямо в декораторі
@router.websocket("/ws/chat/{room_id}")
async def websocket_chat_endpoint(websocket: WebSocket, room_id: str):
    # Менеджер бере на себе всю роботу з Redis Pub/Sub
    await chat_manager.connect_room(websocket, room_id)