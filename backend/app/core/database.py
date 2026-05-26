from sqlalchemy.ext.asyncio import create_async_engine, AsyncSession, async_sessionmaker
from sqlalchemy.orm import declarative_base
from .config import settings

# Створення engine для asyncmy
# Він автоматично підхопить SSL, якщо в параметрах Render буде вказано ?ssl=true
engine = create_async_engine(
    settings.DATABASE_URL, 
    echo=True,
    connect_args={
        "ssl": True  # Для asyncmy цього логічного True достатньо, щоб увімкнути безпечний режим
    }
)

# engine = create_async_engine(settings.DATABASE_URL, echo=True)
AsyncSessionLocal = async_sessionmaker(bind=engine, class_=AsyncSession, expire_on_commit=False)
Base = declarative_base()

async def get_db():
    async with AsyncSessionLocal() as session:
        yield session