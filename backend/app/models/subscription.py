from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from ..core.database import Base


class Subscription(Base):
    __tablename__ = "subscriptions"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    polar_order_id = Column(String, unique=True, nullable=False)
    status = Column(String, nullable=False)
    amount = Column(Integer, nullable=False)
    currency = Column(String, default="USD", nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
