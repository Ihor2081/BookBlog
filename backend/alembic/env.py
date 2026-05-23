import sys
import os
from logging.config import fileConfig

from sqlalchemy import engine_from_config, pool
from alembic import context

# Додаємо корінь папки backend у sys.path, щоб Alembic бачив модуль 'app'
sys.path.insert(0, os.path.abspath(os.path.join(os.path.dirname(__file__), "..")))

from app.core.config import settings
from app.core.database import Base
import app.models.models  # 👈 Важливо: підтягує всі моделі для генерації міграцій

# Це об'єкт конфігурації Alembic, який надає доступ до значень з alembic.ini
config = context.config

# Налаштування логування
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Передаємо метадані наших моделей для auto-generate міграцій
target_metadata = Base.metadata


def run_migrations_offline():
    """Запуск міграцій в 'offline' режимі (генерація SQL-скриптів)."""
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    """Запуск міграцій в 'online' режимі (пряме підключення до бази даних)."""
    
    # Отримуємо секцію налаштувань sqlalchemy. з alembic.ini
    configuration = config.get_section(config.config_ini_section) or {}
    
    # Створюємо двигун з'єднання з підтримкою SSL для PyMySQL
    connectable = engine_from_config(
        configuration,
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
        connect_args={"ssl": {}}  # 👈 БЕЗПЕКА: Вмикає SSL-шифрування для хмари Aiven
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, 
            target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


# Визначаємо режим роботи (online чи offline)
if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()