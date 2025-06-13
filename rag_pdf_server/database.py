from sqlalchemy import create_engine, Column, Integer, String, DateTime
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker
from datetime import datetime
import os
import shutil

DATABASE_URL = "sqlite:///./pdf_metadata.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()

class PDFMetadata(Base):
    __tablename__ = "pdf_metadata"

    id = Column(Integer, primary_key=True, index=True)
    filename = Column(String, index=True)
    upload_timestamp = Column(DateTime, default=datetime.utcnow)
    file_path = Column(String)
    vector_store_path = Column(String)
    session_id = Column(String, index=True)

def clear_all_data():
    try:
        if os.path.exists("pdf_metadata.db"):
            os.remove("pdf_metadata.db")
        
        uploads_dir = "uploads"
        if os.path.exists(uploads_dir):
            shutil.rmtree(uploads_dir)
            os.makedirs(uploads_dir)
        
        vector_dir = "vector_data"
        if os.path.exists(vector_dir):
            shutil.rmtree(vector_dir)
            os.makedirs(vector_dir)
        
        Base.metadata.create_all(bind=engine)
        print("All data cleared successfully")
    except Exception as e:
        print(f"Error clearing data: {str(e)}")

clear_all_data()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close() 