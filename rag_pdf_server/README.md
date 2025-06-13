# PDF Chat Backend

A FastAPI-based backend for the PDF Chat application that handles PDF processing and Q&A functionality.

## Environment Setup

1. Create a `.env` file in the root directory with the following content:
```env
GOOGLE_API_KEY=your_google_api_key_here
```

## Development

1. Create and activate virtual environment:
```bash
python -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Start the development server:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Production Deployment

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Start the production server:
```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --workers 4
```

For better production deployment, consider using:
- Gunicorn as the WSGI server
- Nginx as a reverse proxy
- Supervisor or systemd for process management

### Using Gunicorn (Recommended for Production)

1. Install gunicorn:
```bash
pip install gunicorn
```

2. Start with gunicorn:
```bash
gunicorn main:app -w 4 -k uvicorn.workers.UvicornWorker -b 0.0.0.0:8000
```

### Environment Variables

- `GOOGLE_API_KEY`: Your Google API key for Gemini and embeddings

## API Documentation

Once the server is running, you can access:
- API documentation: http://localhost:8000/docs
- Alternative documentation: http://localhost:8000/redoc 