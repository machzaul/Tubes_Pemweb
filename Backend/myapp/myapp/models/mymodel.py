from sqlalchemy import Column, Integer, String
from .meta import Base

class Product(Base):
    __tablename__ = 'products'
    id = Column(Integer, primary_key=True)
    name = Column(String)
    price = Column(Integer)
