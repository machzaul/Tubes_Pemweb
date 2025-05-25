from sqlalchemy import Column, Integer, String, Text, Numeric
from .meta import Base

class Product(Base):
    __tablename__ = 'products'
    
    id = Column(Integer, primary_key=True)
    title = Column(String(255), nullable=False)
    description = Column(Text)
    price = Column(Numeric(10, 3), nullable=False)
    stock = Column(Integer, default=0)
    image = Column(String(500))
    
    def to_dict(self):
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'price': float(self.price) if self.price else 0,
            'price_rupiah': self.format_rupiah(self.price),
            'stock': self.stock,
            'image': self.image
        }

    @staticmethod
    def format_rupiah(value):
        try:
            value = float(value)
            return f"Rp{value:,.0f}".replace(",", ".")
        except (ValueError, TypeError):
            return "Rp0"
