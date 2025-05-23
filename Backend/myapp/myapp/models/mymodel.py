from sqlalchemy import Column, Integer, String, Float, Text
from .meta import Base

class Product(Base):
    __tablename__ = 'products'
    
    id = Column(Integer, primary_key=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    price = Column(Float, nullable=False)
    stock = Column(Integer, default=0)
    image = Column(String(500))  # URL gambar
    
    def to_dict(self):
        """Convert model instance to dictionary for JSON serialization"""
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'price': self.price,
            'stock': self.stock,
            'image': self.image
        }