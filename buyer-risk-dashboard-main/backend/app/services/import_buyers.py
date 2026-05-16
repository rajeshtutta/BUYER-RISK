import pandas as pd
from sqlalchemy import create_engine

# PostgreSQL connection
DATABASE_URL = "postgresql://postgres:Najus%4023@localhost:5432/buyer_risk_db"

engine = create_engine(DATABASE_URL)

# Excel file path
excel_file = r"C:\Users\sujan\Downloads\buyer-risk-dashboard\buyer-risk-dashboard\backend\uploads\buyers (1).xlsx"

# Read Excel
df = pd.read_excel(excel_file)

# Normalize column names
df.columns = [col.strip().lower() for col in df.columns]

# Clean return_ratio column
df["return_ratio"] = (
    df["return_ratio"]
    .astype(str)
    .str.replace("%", "", regex=False)
    .astype(float)
)

# Convert boolean columns
df["vpn_detected"] = df["vpn_detected"].astype(bool)
df["promo_abuse"] = df["promo_abuse"].astype(bool)

# Upload to PostgreSQL
df.to_sql(
    "buyers",
    engine,
    if_exists="append",
    index=False
)

print("Data imported successfully!")