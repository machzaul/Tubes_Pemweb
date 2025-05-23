from sqlalchemy import Column, Integer, String, Float, Text
from .meta import Base

# Import semua model untuk Alembic autogenerate
from .mymodel import Product

class Item(Base):
    __tablename__ = 'items'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    description = Column(String)

# Re-export Product untuk kemudahan import
__all__ = ['Item', 'Product']