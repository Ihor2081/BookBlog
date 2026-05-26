from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# імпорт маршрутизаторів
from app.routers import posts_router, auth_router, admin_router, user_dashboard, comments_router

# Імпорт бази даних для ініціалізації таблиць (опціонально, якщо не використовуєте Alembic)
from app.core.database import engine, Base

app = FastAPI(
    title="Book Blog API",
    description="Backend API для платформи блогів про книги",
    version="1.0.0"
)

# Додай цей рядок ОДРАЗУ після створення додатка app:
app.router.redirect_slashes = False

# # 1. Налаштування CORS (щоб фронтенд на Next.js міг робити запити)
# origins = [
#     "http://localhost:5173",
#     "http://127.0.0.1:5173",
# ]


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "https://book-blog-omega.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 2. Підключення маршрутизаторів
# Кожному роутеру можна задати спільний префікс та теги для документації Swagger
app.include_router(posts_router.router)
app.include_router(auth_router.router) 
app.include_router(admin_router.router)
app.include_router(user_dashboard.router)
app.include_router(comments_router.router)

# 3. Створення таблиць у БД при запуску (тільки для розробки)
# Примітка: для продакшну краще використовувати міграції Alembic
# @app.on_event("startup")
# async def startup():
#     async with engine.begin() as conn:
#         # Створює всі таблиці, описані у моделях
#         await conn.run_sync(Base.metadata.create_all)

@app.on_event("startup")
async def startup():
    print("FastAPI завантажується...")

@app.get("/")
async def root():
    return {
        "status": "online",
        "message": "Welcome to Book Blog API",
        "docs": "/docs" # Посилання на автоматичну документацію
    }