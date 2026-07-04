import os
from datetime import datetime
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.orm import declarative_base, sessionmaker
from dotenv import load_dotenv

load_dotenv()

# Fallback to local SQLite database if no DATABASE_URL is set in environment
DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./research.db")

connect_args = {}
if DATABASE_URL.startswith("sqlite"):
    connect_args = {"check_same_thread": False}

engine = create_engine(DATABASE_URL, connect_args=connect_args)
SessionLocal = sessionmaker(bind=engine, autocommit=False, autoflush=False)
Base = declarative_base()

class ResearchRun(Base):
    __tablename__ = "research_runs"

    id = Column(Integer, primary_key=True, index=True)
    topic = Column(String(500), nullable=True)
    status = Column(String(50), default="processing")
    search_result = Column(Text, nullable=True)
    scraped_result = Column(Text, nullable=True)
    report = Column(Text, nullable=True)
    feedback = Column(Text, nullable=True)
    critic_score = Column(String(50), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def init_db():
    Base.metadata.create_all(bind=engine)
