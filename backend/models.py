from sqlalchemy import Column, Integer, Float, String
from .database import Base


class Flight(Base):
    __tablename__ = "flights"

    id = Column(Integer, primary_key=True, index=True)
    year = Column(Integer)
    month = Column(Integer)
    day = Column(Integer)
    dep_time = Column(Float)
    sched_dep_time = Column(Integer)
    dep_delay = Column(Float)
    arr_time = Column(Float)
    sched_arr_time = Column(Integer)
    arr_delay = Column(Float)
    carrier = Column(String)
    flight = Column(Integer)
    tailnum = Column(String)
    origin = Column(String)
    dest = Column(String)
    air_time = Column(Float)
    distance = Column(Float)
    hour = Column(Integer)
    minute = Column(Integer)
    time_hour = Column(String)
    name = Column(String)


class Airport(Base):
    __tablename__ = "airports"

    iata = Column(String, primary_key=True, index=True)
    icao = Column(String)
    name = Column(String)
    country_code = Column(String)
    region_name = Column(String)
    latitude = Column(Float)
    longitude = Column(Float)
