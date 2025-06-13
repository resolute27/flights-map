import csv
from sqlalchemy.orm import Session
from .database import engine, SessionLocal
from .models import Base, Flight
import os


def import_csv(filepath: str):
    Base.metadata.create_all(bind=engine)
    db: Session = SessionLocal()

    with open(filepath, newline='') as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            flight = Flight(**{k: row[k] if row[k] else None for k in row})
            db.add(flight)
        db.commit()
        db.close()


if __name__ == "__main__":
    file_path = os.path.join(os.path.dirname(__file__), "flight_data.csv")
    import_csv(file_path)
