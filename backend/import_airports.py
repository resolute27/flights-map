import csv
import os
from sqlalchemy.orm import Session
from .database import engine, SessionLocal
from .models import Base, Airport


def import_airports(filepath: str):
    # 建立資料表（如果尚未建立）
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    with open(filepath, newline='', encoding='utf-8') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            # 避免空白 IATA 欄位
            if not row["iata"]:
                continue

            try:
                airport = Airport(iata=row["iata"].strip(),
                                  icao=row["icao"].strip(),
                                  name=row["airport"].strip(),
                                  country_code=row["country_code"].strip(),
                                  region_name=row["region_name"].strip(),
                                  latitude=float(row["latitude"]),
                                  longitude=float(row["longitude"]))
                db.merge(airport)  # ✅ 自動 upsert
                db.commit()  # ✅ 每筆單獨提交（避免批次衝突）
            except Exception as e:
                print(f"❌ Error on {row['iata']}: {e}")
                db.rollback()

    db.close()
    print("✅ Airport data import completed.")


if __name__ == "__main__":
    file_path = os.path.join(os.path.dirname(__file__), "iata-icao.csv")
    import_airports(file_path)
