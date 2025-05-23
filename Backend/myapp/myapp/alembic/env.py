"""Pyramid bootstrap environment."""
from alembic import context
from pyramid.paster import get_appsettings, setup_logging
from sqlalchemy import engine_from_config

# Import your models here
from myapp.models.meta import Base
from myapp.models.mymodel import Product  # Import semua model yang ada

config = context.config

# Interpret the config file for Python logging.
# This line sets up loggers basically.
if config.config_file_name is not None:
    setup_logging(config.config_file_name)

# Try to get settings from pyramid config file if available
try:
    settings = get_appsettings(config.config_file_name)
    if 'sqlalchemy.url' in settings:
        config.set_main_option('sqlalchemy.url', settings['sqlalchemy.url'])
except:
    # Fallback to alembic.ini settings
    pass

# Set target metadata for autogenerate support
target_metadata = Base.metadata

def run_migrations_offline():
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
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
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """
    connectable = engine_from_config(
        config.get_section(config.config_ini_section),
        prefix="sqlalchemy.",
    )

    with connectable.connect() as connection:
        context.configure(
            connection=connection, 
            target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()