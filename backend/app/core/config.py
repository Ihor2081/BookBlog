# import os
# from dotenv import load_dotenv

# load_dotenv()

# class Settings:
#     PROJECT_NAME: str = "Book Blog Platform"
#     DATABASE_URL: str = os.getenv("DATABASE_URL", "postgresql+asyncpg://user:pass@localhost/dbname")
#     SECRET_KEY: str = os.getenv("SECRET_KEY", "super-secret-key")
#     ALGORITHM: str = "HS256"
#     ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 # 1 day

# settings = Settings()

from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

# Динамічно визначаємо шлях до .env, який лежить у цій же папці (backend/app/core/)
CURRENT_DIR = Path(__file__).resolve().parent
ENV_FILE_PATH = CURRENT_DIR / ".env"

class Settings(BaseSettings):
    # Очікуємо, що ці змінні будуть знайдені в .env або в системі
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"  # Якщо в .env немає значення, візьметься це за замовчуванням
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 1440  # 24 години

    # Налаштування для Pydantic: читати саме наш файл .env
    model_config = SettingsConfigDict(
        env_file=ENV_FILE_PATH, 
        env_file_encoding="utf-8",
        extra="ignore"  # ігнорувати сторонні змінні, якщо вони є в системі
    )

# Екземпляр конфігу для використання в усьому проєкті
settings = Settings()