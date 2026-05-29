import asyncio
import json
from fastapi import WebSocket
import redis.asyncio as aioredis

class RedisChatManager:
    def __init__(self, redis_url: str):
        # Ініціалізуємо асинхронний клієнт Redis
        self.redis = aioredis.from_url(redis_url, decode_responses=True)

    async def connect_room(self, websocket: WebSocket, room_id: str):
        """Підключає WebSocket до кімнати і починає трансляцію через Redis"""
        await websocket.accept()
        
        # Створюємо об'єкт підписки (Pub/Sub) для цієї кімнати
        pubsub = self.redis.pubsub()
        await pubsub.subscribe(f"room_{room_id}")

        # Створюємо два паралельні завдання: 
        # 1. Слухати повідомлення з Redis і відправляти в цей WebSocket
        # 2. Слухати повідомлення з цього WebSocket і публікувати в Redis
        consumer_task = asyncio.create_task(self._redis_to_websocket(pubsub, websocket))
        producer_task = asyncio.create_task(self._websocket_to_redis(websocket, room_id))

        # Чекаємо, поки якесь із завдань не завершиться (наприклад, клієнт закрив вкладку)
        done, pending = await asyncio.wait(
            [consumer_task, producer_task],
            return_when=asyncio.FIRST_COMPLETED
        )

        # Зачищаємо ресурси та скасовуємо інше завдання
        for task in pending:
            task.cancel()
        
        await pubsub.unsubscribe(f"room_{room_id}")
        await websocket.close()

    async def _redis_to_websocket(self, pubsub, websocket: WebSocket):
        """Слухає Redis канал і пересилає повідомлення у браузер"""
        try:
            async for message in pubsub.listen():
                if message["type"] == "message":
                    data = json.loads(message["data"])
                    await websocket.send_json(data)
        except Exception as e:
            print(f"Redis to WS error: {e}")

    async def _websocket_to_redis(self, websocket: WebSocket, room_id: str):
        """Слухає браузер і публікує повідомлення в Redis канал"""
        try:
            while True:
                # Очікуємо JSON від фронтенду (наприклад: {"sender": "admin", "text": "Привіт!"})
                data = await websocket.receive_json()
                
                # Публікуємо повідомлення в Redis (його почують усі підключені до цієї кімнати)
                await self.redis.publish(f"room_{room_id}", json.dumps(data))
        except Exception as e:
            print(f"WS to Redis error: {e}")

# Ініціалізуємо менеджер (встав свій REDIS_URL, на Render він буде у змінних оточення)
# Для локального тесту: "redis://localhost:6379"
REDIS_URL = "redis://localhost:6379" 
chat_manager = RedisChatManager(REDIS_URL)