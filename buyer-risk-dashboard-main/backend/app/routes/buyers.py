from fastapi import APIRouter, UploadFile, File, Depends
from sqlalchemy.orm import Session
import pandas as pd
import shutil
import os

from app.database import SessionLocal
from app.models import Buyer

router = APIRouter()

UPLOAD_FOLDER = "uploads"

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# GET BUYERS
@router.get("/buyers")
def get_buyers(db: Session = Depends(get_db)):

    buyers = db.query(Buyer).all()

    return [

        {
            "id": buyer.id,
            "name": buyer.name,
            "risk_score": buyer.risk_score,
            "risk_level": buyer.risk_level,
            "ip_address": buyer.ip_address,
            "device_fingerprint": buyer.device_fingerprint,
            "google_app_instance_id": buyer.google_app_instance_id,
            "shared_accounts": buyer.shared_accounts,
            "return_ratio": buyer.return_ratio,
            "orders_last_24h": buyer.orders_last_24h,
            "address_quality": buyer.address_quality,
            "vpn_detected": buyer.vpn_detected,
            "promo_abuse": buyer.promo_abuse,
            "delivery_failures": buyer.delivery_failures
        }

        for buyer in buyers
    ]

# UPLOAD EXCEL
@router.post("/upload")
async def upload_excel(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    file_path = os.path.join(
        UPLOAD_FOLDER,
        file.filename
    )

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(
            file.file,
            buffer
        )

    df = pd.read_excel(file_path)

    df.columns = [
        col.strip().lower()
        for col in df.columns
    ]

    # Clear old data
    db.query(Buyer).delete()

    for _, row in df.iterrows():

        buyer = Buyer(

            id=int(row["id"]),
            name=row["name"],
            risk_score=int(row["risk_score"]),
            risk_level=row["risk_level"],
            ip_address=row["ip_address"],
            device_fingerprint=row["device_fingerprint"],
            google_app_instance_id=row["google_app_instance_id"],
            shared_accounts=int(row["shared_accounts"]),
            return_ratio=float(
                str(row["return_ratio"]).replace("%", "")
            ),
            orders_last_24h=int(row["orders_last_24h"]),
            address_quality=row["address_quality"],
            vpn_detected=bool(row["vpn_detected"]),
            promo_abuse=bool(row["promo_abuse"]),
            delivery_failures=int(row["delivery_failures"])

        )

        db.add(buyer)

    db.commit()

    return {
        "message": "Excel uploaded successfully",
        "records_processed": len(df)
    }