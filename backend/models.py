from sqlalchemy import Column, String, DateTime, JSON, Integer, Boolean
from sqlalchemy.sql import func
from database import Base

class TrackingRecord(Base):
    __tablename__ = "tracking_records"
    id = Column(Integer, primary_key=True)
    tracking_id = Column(String, index=True)
    courier = Column(String)
    status = Column(String)
    events = Column(JSON)
    current_location = Column(String)
    lat = Column(String, nullable=True)
    lng = Column(String, nullable=True)
    estimated_delivery = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

class AlertSubscription(Base):
    __tablename__ = "alert_subscriptions"
    id = Column(Integer, primary_key=True)
    tracking_id = Column(String, index=True)
    email = Column(String, nullable=True)
    phone = Column(String, nullable=True)
    active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())