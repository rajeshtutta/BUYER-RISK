
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.routes.buyers import router as buyer_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(buyer_router)

@app.get("/")
def home():
    return {"message": "Buyer Risk Dashboard API Running"}
