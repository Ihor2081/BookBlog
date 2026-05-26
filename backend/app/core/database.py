from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from .config import settings
import ssl 

# Конфігурація для SSL
ssl_context = ssl.create_default_context()
ssl_context.check_hostname = False
ssl_context.verify_mode = ssl.CERT_NONE

# Створення engine
engine = create_async_engine(
    settings.DATABASE_URL, 
    echo=True,
    connect_args={
        # Спробуємо передати як True (aiomysql сам створить базовий SSL контекст)
        # Або якщо Aiven дуже прискіпливий, використовуй: "ssl_context": ssl_context
        "ssl": True 
    }
)

# engine = create_async_engine(settings.DATABASE_URL, echo=True)
AsyncSessionLocal = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session