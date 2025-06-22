# Quick Start Guide

## Prerequisites

- Python 3.11+
- Node.js 18+
- Docker and Docker Compose
- E*TRADE Developer Account

## Setup

1. **Clone and setup the project:**
   ```bash
   ./setup.sh
   ```

2. **Configure E*TRADE API:**
   - Sign up at [E*TRADE Developer Portal](https://developer.etrade.com)
   - Create a Sandbox application
   - Copy your `CONSUMER_KEY` and `CONSUMER_SECRET`
   - Edit `.env` file and add your credentials

3. **Start the development servers:**

   **Backend (Terminal 1):**
   ```bash
   cd backend
   uvicorn app.main:app --reload --port 8000
   ```

   **Frontend (Terminal 2):**
   ```bash
   cd frontend
   npm run dev
   ```

4. **Access the application:**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000
   - API Docs: http://localhost:8000/docs

## E*TRADE OAuth Flow

1. Visit http://localhost:3000
2. Click "Connect E*TRADE"
3. Authorize the application on E*TRADE
4. You'll be redirected back to the dashboard
5. View your portfolio holdings and beta

## Project Structure

```
├── backend/                 # FastAPI backend
│   ├── app/
│   │   ├── api/v1/brokers/  # E*TRADE OAuth endpoints
│   │   ├── core/            # Configuration & security
│   │   └── main.py          # FastAPI app
│   ├── requirements.txt     # Python dependencies
│   └── test_main.py         # Basic tests
├── frontend/                # Next.js frontend
│   ├── app/                 # App router pages
│   ├── components/ui/       # shadcn/ui components
│   ├── lib/                 # Utilities
│   └── package.json         # Node.js dependencies
├── docker-compose.yml       # Development services
├── .github/workflows/       # CI/CD pipeline
└── setup.sh                 # Setup script
```

## Development

- **Backend API**: FastAPI with OAuth 1.0a for E*TRADE
- **Frontend**: Next.js 14 with Tailwind CSS and shadcn/ui
- **Database**: PostgreSQL (for future use)
- **Cache**: Redis (for OAuth tokens)
- **Vector DB**: Qdrant (for future ML features)

## Testing

```bash
# Backend tests
cd backend
pytest

# Frontend tests
cd frontend
npm run lint
npm run build
```

## Next Steps

After completing Milestone 1 (E*TRADE connection), we'll work on:

1. **Milestone 2**: Real-time beta calculation engine
2. **Milestone 3**: Intelligent hedging recommendations
3. **Milestone 4**: Event probability overlay
4. **Milestone 5**: Production polish

## Troubleshooting

- **OAuth errors**: Check your E*TRADE credentials in `.env`
- **Port conflicts**: Ensure ports 3000, 8000, 5432, 6379 are available
- **Docker issues**: Run `docker-compose down && docker-compose up -d`

## Support

For issues or questions, check the E*TRADE API documentation or create an issue in the repository. 