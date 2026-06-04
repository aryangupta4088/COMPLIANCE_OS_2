# ComplianceOS Backend

Backend API for ComplianceOS - A comprehensive compliance management platform.

## Setup

### Prerequisites
- Python 3.11+
- Docker & Docker Compose
- MongoDB
- Redis

### Installation

1. Create virtual environment:
```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. Install dependencies:
```bash
pip install -r requirements.txt
```

3. Configure environment:
```bash
cp .env.example .env
# Edit .env with your configuration
```

### Running Locally

```bash
uvicorn app.main:app --reload
```

The API will be available at `http://localhost:8000`

### Running with Docker

```bash
docker-compose up
```

## API Documentation

Once running, visit:
- Swagger UI: `http://localhost:8000/docs`
- ReDoc: `http://localhost:8000/redoc`

## Project Structure

```
app/
├── agents/          # AI agents (ARIA, VEDA, SCOUT, PATHWAY, SENTINEL)
├── models/          # Database models
├── routers/         # API routes
├── schemas/         # Pydantic schemas
├── services/        # Business logic services
├── tasks/           # Celery background tasks
├── utils/           # Utility functions
├── main.py          # App entry point
├── config.py        # Configuration
└── database.py      # Database setup
```

## Environment Variables

See `.env` file for all required variables.
