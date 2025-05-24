from sqlalchemy import Column, Integer, String, DateTime, func
from .meta import Base

class CustomerInfo(Base):
    __tablename__ = 'customer_info'
    
    id = Column(Integer, primary_key=True)
    full_name = Column(String(255), nullable=False)
    email = Column(String(255), nullable=False)
    address = Column(String(500), nullable=False)
    phone_number = Column(String(20), nullable=False)
    created_at = Column(DateTime, default=func.now())
    updated_at = Column(DateTime, default=func.now(), onupdate=func.now())
    
    def to_dict(self):
        return {
            'id': self.id,
            'fullName': self.full_name,
            'email': self.email,
            'address': self.address,
            'phoneNumber': self.phone_number,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None
        }