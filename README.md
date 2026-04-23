# PDF Chat Application

A full-stack application that allows users to upload PDF documents and interact with them using natural language queries. The application uses Google's Gemini AI for intelligent document processing and question answering.

## Architecture Overview

The application consists of two main components:

### Backend (rag_pdf_server)
- FastAPI-based REST API
- SQLite database for metadata storage
- Google Gemini AI integration for document processing
- PDF text extraction and processing
- Session-based file management

### Frontend (rag_pdf_parser)
- React-based single-page application
- TypeScript for type safety
- Modern UI with Tailwind CSS
- Real-time file upload and chat interface

## Prerequisites

- Python 3.8+
- Node.js 16+
- Google API Key for Gemini AI
- npm or yarn package manager

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
```bash
cd rag_pdf_server
```

2. Create and activate virtual environment:
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

3. Install dependencies:
```bash
pip install -r requirements.txt
```

4. Create `.env` file:
```env
GOOGLE_API_KEY=your_google_api_key_here
```

5. Start the development server:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

1. Navigate to the frontend directory:
```bash
cd rag_pdf_parser
```

2. Install dependencies:
```bash
npm install
```

3. Create `.env` file:
```env
VITE_API_BASE_URL=http://localhost:8000
```

4. Start the development server:
```bash
npm run dev
```

## Production Deployment

### Backend Deployment

1. Install gunicorn:
```bash
pip install gunicorn
```

2. Start the production server:
```bash
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000
```

### Frontend Deployment

1. Build the production bundle:
```bash
npm run build
```

2. Serve the built files using a static file server (e.g., nginx)

## API Documentation

The backend API documentation is available at:
- Swagger UI: http://localhost:8000/docs
- ReDoc: http://localhost:8000/redoc

### Key API Endpoints

- `POST /upload`: Upload a PDF file
- `POST /ask`: Ask a question about the uploaded PDF
- `GET /files`: List all uploaded files
- `DELETE /files/{filename}`: Delete a specific file
- `DELETE /session`: Delete all files in the current session

## Features

- PDF file upload and management
- Natural language question answering
- Session-based file organization
- Real-time chat interface
- File metadata tracking
- Automatic file cleanup

## Project Structure

```
.
├── rag_pdf_server/           # Backend
│   ├── main.py              # FastAPI application
│   ├── database.py          # Database models and operations
│   ├── requirements.txt     # Python dependencies
│   └── .env                 # Environment variables
│
└── rag_pdf_parser/          # Frontend
    ├── src/
    │   ├── components/      # React components
    │   ├── services/        # API services
    │   └── types/          # TypeScript types
    ├── package.json        # Node.js dependencies
    └── .env               # Environment variables
```

## Environment Variables

### Backend (.env)
- `GOOGLE_API_KEY`: Your Google API key for Gemini AI

### Frontend (.env)
- `VITE_API_BASE_URL`: Backend API URL

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details. 