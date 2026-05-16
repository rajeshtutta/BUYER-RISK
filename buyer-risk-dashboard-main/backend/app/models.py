from sqlalchemy import Column, Integer, String, Boolean, Float
from app.database import Base

class Buyer(Base):
    __tablename__ = "buyers"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String)
    risk_score = Column(Integer)
    risk_level = Column(String)

    ip_address = Column(String)
    device_fingerprint = Column(String)
    google_app_instance_id = Column(String)

    shared_accounts = Column(Integer)
    return_ratio = Column(Float)
    orders_last_24h = Column(Integer)

    address_quality = Column(String)

    vpn_detected = Column(Boolean)
    promo_abuse = Column(Boolean)

    delivery_failures = Column(Integer)