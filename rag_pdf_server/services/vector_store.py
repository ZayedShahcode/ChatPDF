# vector_store.py
import os
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_text_splitters import RecursiveCharacterTextSplitter

def store_document(text: str, persist_dir: str):
    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=100)
    docs = splitter.create_documents([text])
    
    google_api_key = os.getenv("GOOGLE_API_KEY")
    if not google_api_key:
        raise ValueError("GOOGLE_API_KEY environment variable is not set")
    
    embeddings = GoogleGenerativeAIEmbeddings(
        model="gemini-embedding-2-preview",
        google_api_key=google_api_key
    )
    
    
    db = None
    for doc in docs:
        if db is None:
            db = FAISS.from_documents([doc], embeddings)
        else:
            db.add_documents([doc])
    
    db.save_local(persist_dir)