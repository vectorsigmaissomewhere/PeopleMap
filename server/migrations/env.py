from logging.config import fileConfig
from sqlalchemy import engine_from_config, pool
from alembic import context

from sqlmodel import SQLModel
from src.config import Config
from src.auth.models import User  # IMPORTANT: import models

# Alembic Config object
config = context.config

# Convert async URL → sync URL for Alembic
SYNC_DATABASE_URL = Config.DATABASE_URL.replace("+asyncpg", "")

config.set_main_option("sqlalchemy.url", SYNC_DATABASE_URL)

# Logging
if config.config_file_name is not None:
    fileConfig(config.config_file_name)

# Metadata for autogenerate
target_metadata = SQLModel.metadata


def run_migrations_offline():
    context.configure(
        url=SYNC_DATABASE_URL,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online():
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
        poolclass=pool.NullPool,
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection,
            target_metadata=target_metadata,
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
