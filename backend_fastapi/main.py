import fastapi
from fastapi import Depends, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi_swagger_dark import install as install_swagger_dark
from sqlalchemy.orm import Session

from .database import SessionLocal
from .models import Flight, Airport

app = fastapi.FastAPI(docs_url=None)  # 關閉預設 /docs

# 安裝深色 Swagger UI
router = fastapi.APIRouter()
install_swagger_dark(router)
app.include_router(router)

# CORS 設定
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # 可改成 ["http://localhost:5173"] 之類的實際前端 host
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Dependency：建立一次 SQLAlchemy session，請求結束即關閉
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


# ──────────────────────────────
# API endpoints
# ──────────────────────────────


@app.get("/api/flights")
def get_flights(
        page: int = Query(1, ge=1),
        limit: int = Query(50, ge=1, le=200),
        db: Session = Depends(get_db),
):
    offset = (page - 1) * limit
    flights = db.query(Flight).offset(offset).limit(limit).all()
    return flights


@app.get("/api/airports/{iata}")
def get_airport(iata: str, db: Session = Depends(get_db)):
    airport = (db.query(Airport).filter(Airport.iata == iata.upper()).first())
    if airport:
        return {
            "iata": airport.iata,
            "lat": airport.latitude,
            "lng": airport.longitude,
            "name": airport.name,
        }
    raise HTTPException(status_code=404, detail="Airport not found")
