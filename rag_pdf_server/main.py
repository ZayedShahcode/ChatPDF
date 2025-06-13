from fastapi import FastAPI, File, Form, UploadFile, Depends
from fastapi.middleware.cors import CORSMiddleware
import os
import shutil
from dotenv import load_dotenv
from services.pdf_loader import extract_text_from_pdf
from services.vector_store import store_document
from services.qa_chain import get_qa_chain
from database import get_db, PDFMetadata
from sqlalchemy.orm import Session
import uuid

load_dotenv()

app = FastAPI(title="PDF Q&A API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_DIR = "uploads"
VECTOR_DIR = "vector_data"

os.makedirs(UPLOAD_DIR, exist_ok=True)
os.makedirs(VECTOR_DIR, exist_ok=True)

@app.get("/")
async def root():
    """Root endpoint to check if API is running"""
    return {"message": "PDF Q&A API is running", "status": "healthy"}

@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...), db: Session = Depends(get_db)):
    """Upload and process PDF file"""
    try:
        session_id = str(uuid.uuid4())
        
        file_path = os.path.join(UPLOAD_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
        
        text = extract_text_from_pdf(file_path)
    
        doc_vector_path = os.path.join(VECTOR_DIR, file.filename)
        store_document(text, doc_vector_path)
        
        pdf_metadata = PDFMetadata(
            filename=file.filename,
            file_path=file_path,
            vector_store_path=doc_vector_path,
            session_id=session_id
        )
        db.add(pdf_metadata)
        db.commit()
        
        return {
            "message": "PDF uploaded and indexed successfully",
            "filename": file.filename,
            "session_id": session_id,
            "status": "success"
        }
        
    except Exception as e:
        return {
            "message": f"Error processing PDF: {str(e)}",
            "status": "error"
        }

@app.post("/ask")
async def ask_question(filename: str = Form(...), question: str = Form(...)):
    """Ask a question about an uploaded PDF"""
    try:
        doc_vector_path = os.path.join(VECTOR_DIR, filename)
        if not os.path.exists(doc_vector_path):
            return {
                "message": f"No indexed document found for {filename}",
                "status": "error"
            }
        
        qa_chain = get_qa_chain(doc_vector_path)
        result = qa_chain.run(question)
        
        return {
            "answer": result,
            "filename": filename,
            "question": question,
            "status": "success"
        }
        
    except Exception as e:
        return {
            "message": f"Error processing question: {str(e)}",
            "status": "error"
        }

@app.delete("/files/{filename}")
async def delete_file(filename: str, db: Session = Depends(get_db)):
    """Delete a PDF file and its associated data"""
    try:
        pdf_metadata = db.query(PDFMetadata).filter(PDFMetadata.filename == filename).first()
        if pdf_metadata:
            db.delete(pdf_metadata)
            db.commit()
        
        file_path = os.path.join(UPLOAD_DIR, filename)
        vector_path = os.path.join(VECTOR_DIR, filename)
        
        if os.path.exists(file_path):
            os.remove(file_path)
        if os.path.exists(vector_path):
            shutil.rmtree(vector_path)
            
        return {
            "message": f"File {filename} deleted successfully",
            "status": "success"
        }
    except Exception as e:
        return {
            "message": f"Error deleting file: {str(e)}",
            "status": "error"
        }

@app.delete("/session/{session_id}")
async def delete_session(session_id: str, db: Session = Depends(get_db)):
    """Delete all files associated with a session"""
    try:
        session_files = db.query(PDFMetadata).filter(PDFMetadata.session_id == session_id).all()
        
        for pdf_metadata in session_files:
            if os.path.exists(pdf_metadata.file_path):
                os.remove(pdf_metadata.file_path)
            if os.path.exists(pdf_metadata.vector_store_path):
                shutil.rmtree(pdf_metadata.vector_store_path)
            
            db.delete(pdf_metadata)
        
        db.commit()
        
        return {
            "message": f"Session {session_id} deleted successfully",
            "status": "success"
        }
    except Exception as e:
        return {
            "message": f"Error deleting session: {str(e)}",
            "status": "error"
        }

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "upload_dir": os.path.exists(UPLOAD_DIR),
        "vector_dir": os.path.exists(VECTOR_DIR)
    }

@app.get("/files")
async def list_files(db: Session = Depends(get_db)):
    """List uploaded files with their metadata"""
    try:
        files_metadata = db.query(PDFMetadata).all()
        return {
            "files": [
                {
                    "filename": f.filename,
                    "upload_timestamp": f.upload_timestamp,
                    "session_id": f.session_id
                }
                for f in files_metadata
            ],
            "status": "success"
        }
    except Exception as e:
        return {
            "message": f"Error listing files: {str(e)}",
            "status": "error"
        }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)