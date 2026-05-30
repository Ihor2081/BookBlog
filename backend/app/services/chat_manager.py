import os
import asyncio
import json
from fastapi import WebSocket
# Додаємо коментар для лінтера, щоб він не підкреслював імпорти жовтим
from redis.asyncio import Redis  # type: ignore

class RedisChatManager:
    def __init__(self, redis_url: str):
        # Ініціалізуємо асинхронний клієнт Redis
        redis_kwargs = {
            "decode_responses": True,
            "socket_timeout": 300,        # 5 хвилин таймаут на читання
            "socket_keepalive": True,      # увімкнути TCP Keep-Alive
        }
        
        if redis_url.startswith("rediss://"):
            self.redis = Redis.from_url(
                redis_url, 
                ssl_cert_reqs=None,
                **redis_kwargs
            )
        else:
            self.redis = Redis.from_url(
                redis_url, 
                **redis_kwargs
            )
        
        self.active_rooms_key = "chat_active_rooms"

    async def connect_room(self, websocket: WebSocket, room_id: str):
        """Підключає WebSocket до кімнати і починає трансляцію через Redis"""
        await websocket.accept()
        
        # 1. Додаємо кімнату до списку активних у Redis
        await self.redis.sadd(self.active_rooms_key, room_id)
        
        # 2. Відправляємо історію повідомлень клієнту одразу при підключенні
        await self._send_room_history(websocket, room_id)

        # Створюємо об'єкт підписки (Pub/Sub) для цієї кімнати
        pubsub = self.redis.pubsub()
        await pubsub.subscribe(f"room_{room_id}")

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

        # 3. При відключенні прибираємо кімнату з активних
        await self.redis.srem(self.active_rooms_key, room_id)

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
        """Слухає браузер, зберігає повідомлення в історію та публікує в Redis"""
        try:
            while True:
                data = await websocket.receive_json()
                
                # Зберігаємо повідомлення в історію кімнати (ліст у Redis)
                history_key = f"room_history:{room_id}"
                await self.redis.lpush(history_key, json.dumps(data))
                await self.redis.ltrim(history_key, 0, 50)
                
                # Публікуємо в Pub/Sub для миттєвої доставки
                await self.redis.publish(f"room_{room_id}", json.dumps(data))
        except Exception as e:
            print(f"WS to Redis error: {e}")

    async def _send_room_history(self, websocket: WebSocket, room_id: str):
        """Завантажує та відправляє історію повідомлень підключеному сокету"""
        try:
            history_key = f"room_history:{room_id}"
            history = await self.redis.lrange(history_key, 0, -1)
            
            # Розгортаємо список для дотримання хронологічного порядку
            for msg_str in reversed(history):
                await websocket.send_json(json.loads(msg_str))
        except Exception as e:
            print(f"Error sending history: {e}")

    async def get_active_rooms(self):
        """Повертає список активних кімнат для адмінпанелі"""
        try:
            # Отримуємо всі ID кімнат із Redis Set
            room_ids = await self.redis.smembers(self.active_rooms_key)
            
            rooms_list = []
            for r_id in room_ids:
                rooms_list.append({
                    "user_id": r_id,
                    "username": f"Користувач {r_id}"
                })
            return rooms_list
        except Exception as e:
            print(f"Error getting active rooms: {e}")
            return []

# Ініціалізація менеджера чату з урахуванням змінних оточення Render
REDIS_URL = os.getenv("REDIS_URL", "redis://localhost:6379") 
chat_manager = RedisChatManager(REDIS_URL)