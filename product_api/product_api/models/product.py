from sqlalchemy import Column, Integer, String, Text, Numeric
from .meta import Base

class Product(Base):
    __tablename__ = 'products'
    
    id = Column(Integer, primary_key=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    price = Column(Numeric(12, 3), nullable=False)
    stock = Column(Integer, default=0)
    image = Column(String(1000))
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'price': float(self.price) if self.price is not None else 0,
            'stock': self.stock,
            'image': self.image
        }