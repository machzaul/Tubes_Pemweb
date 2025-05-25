from sqlalchemy import Column, Integer, String, Text, Numeric, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship
from sqlalchemy import func
from .meta import Base

class Order(Base):
    __tablename__ = 'orders'
    
    id = Column(Integer, primary_key=True)
    order_id = Column(String(50), unique=True, nullable=False)  # Custom order ID
    customer_info_id = Column(Integer, ForeignKey('customer_info.id'), nullable=False)
    subtotal = Column(Numeric(12, 3), nullable=False)
    shipping = Column(Numeric(10, 2), nullable=False, default=0)
    total = Column(Numeric(12, 3), nullable=False)
    status = Column(String(50), nullable=False, default='pending')
    status_history = Column(JSON)  # Store status history as JSON
    order_date = Column(DateTime, default=func.now())
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    # Relationships
    customer_info = relationship("CustomerInfo", backref="orders")
    order_items = relationship("OrderItem", back_populates="order", cascade="all, delete-orphan")
    
    def to_dict(self):
        return {
            'id': self.id,
            'orderId': self.order_id,
            'customerInfo': self.customer_info.to_dict() if self.customer_info else None,
            'items': [item.to_dict() for item in self.order_items],
            'subtotal': float(self.subtotal) if self.subtotal else 0,
            'shipping': float(self.shipping) if self.shipping else 0,
            'total': float(self.total) if self.total else 0,
            'status': self.status,
            'statusHistory': self.status_history,
            'orderDate': self.order_date.isoformat() if self.order_date else None,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None
        }

class OrderItem(Base):
    __tablename__ = 'order_items'
    
    id = Column(Integer, primary_key=True)
    order_id = Column(Integer, ForeignKey('orders.id'), nullable=False)
    product_id = Column(Integer, ForeignKey('products.id'), nullable=False)
    quantity = Column(Integer, nullable=False)
    price = Column(Numeric(10, 2), nullable=False)  # Price at time of order
    
    # Relationships
    order = relationship("Order", back_populates="order_items")
    product = relationship("Product")
    
    def to_dict(self):
        return {
            'id': self.id,
            'productId': self.product_id,
            'product': self.product.to_dict() if self.product else None,
            'quantity': self.quantity,
            'price': float(self.price) if self.price else 0
        }