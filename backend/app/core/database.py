import ssl
from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from .config import settings
# Створюємо правильний SSL-контекст для asyncpg
ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE
# Створення engine для asyncmy
# Він автоматично підхопить SSL, якщо в параметрах Render буде вказано ?ssl=true
engine = create_async_engine(
    settings.DATABASE_URL, 
    echo=True,
    connect_args={
        "ssl": ssl_context  # Для asyncmy цього логічного True достатньо, щоб увімкнути безпечний режим
    }
)

# engine = create_async_engine(settings.DATABASE_URL, echo=True)
AsyncSessionLocal = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session