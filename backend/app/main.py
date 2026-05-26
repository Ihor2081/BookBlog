from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
# імпорт маршрутизаторів
from app.routers import posts_router, auth_router, admin_router, user_dashboard, comments_router

# Імпорт бази даних для ініціалізації таблиць
from app.core.database import engine, Base

app = FastAPI(
    title="Book Blog API",
    description="Backend API для платформи блогів про книги",
    version="1.0.0"
)

# Вимикаємо примусові редиректи для слешів
app.router.redirect_slashes = False

# 1. Налаштування CORS (БЕЗ зірочки в origins, щоб не падав credentials)
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "https://book-blog-omega.vercel.app",   
        "https://book-blog-omega.vercel.app/",  
        "http://localhost:5173",                
        "http://127.0.0.1:5173"
    ],
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"], 
    allow_headers=["*"],
)

# 2. Підключення маршрутизаторів (префікс /api/posts вже всередині файлів)
app.include_router(posts_router.router)
app.include_router(auth_router.router) 
app.include_router(admin_router.router)
app.include_router(user_dashboard.router)
app.include_router(comments_router.router)

# 3. Автоматичне створення таблиць у новій базі даних при старті
@app.on_event("startup")
async def startup():
    print("FastAPI завантажується...")
    async with engine.begin() as conn:
        # Цей рядок створить усі таблиці на основі твоїх моделей SQLAlchemy
        await conn.run_sync(Base.metadata.create_all)

@app.get("/")
async def root():
    return {
        "status": "online",
        "message": "Welcome to Book Blog API",
        "docs": "/docs" 
    }