# RAG PDF Parser Setup Instructions

This project consists of a FastAPI backend and a React frontend that work together to provide a PDF question-answering system using RAG (Retrieval Augmented Generation).

## Backend Setup (FastAPI)

1. Navigate to the backend directory:
```bash
cd rag_pdf_server
```

2. Install Python dependencies:
```bash
pip install -r requirements.txt
```

3. Start the FastAPI server:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The backend will be available at: `http://localhost:8000`

### Backend API Endpoints:
- `POST /upload` - Upload a PDF file for indexing
- `POST /ask` - Ask questions about the uploaded PDF
- `GET /` - Health check endpoint

## Frontend Setup (React)

1. Navigate to the frontend directory:
```bash
cd rag_pdf_parser
```

2. Install Node.js dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

The frontend will be available at: `http://localhost:5173`

## How to Use

1. **Start the Backend**: Make sure the FastAPI server is running on port 8000
2. **Start the Frontend**: Launch the React development server
3. **Upload a PDF**: Click the "Upload PDF" button in the top navigation and select a PDF file
4. **Ask Questions**: Once uploaded, you can ask questions about the PDF content in the chat interface

## Features Connected

✅ **PDF Upload**: Frontend now uploads PDFs to the FastAPI backend and indexes them for search
✅ **Question Answering**: Frontend sends questions to the backend and receives AI-generated answers
✅ **CORS Configuration**: Backend is configured to accept requests from the React frontend
✅ **Error Handling**: Proper error handling for API failures
✅ **Loading States**: UI shows loading indicators during API calls

## Architecture

```
Frontend (React) ←→ Backend (FastAPI) ←→ Vector Store (FAISS) ←→ LLM (Google Gemini)
```

The system works by:
1. Extracting text from uploaded PDFs
2. Creating vector embeddings and storing them in FAISS
3. Using similarity search to find relevant content for questions
4. Generating answers using Google's Gemini LLM with the retrieved context

## Troubleshooting

- **CORS Errors**: Make sure the backend is running on port 8000
- **Upload Failures**: Check that the backend can write to the `uploads/` and `vector_data/` directories
- **API Connection Issues**: Verify both servers are running and accessible 