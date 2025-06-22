# Adaptive Beta Portfolio Management

A real-time portfolio management system that continuously calculates and displays portfolio beta, with intelligent hedging recommendations and event-driven risk adjustments.

## Features

- **E*TRADE Integration**: OAuth 1.0a authentication and portfolio data retrieval
- **Real-time Beta Calculation**: Continuous portfolio beta monitoring
- **Intelligent Hedging**: AI-powered risk management recommendations
- **Event Probability Overlay**: Market event impact analysis

## Tech Stack

- **Backend**: FastAPI, PostgreSQL, Redis, Celery
- **Frontend**: Next.js 14, Tailwind CSS, shadcn/ui
- **Data**: Polars, yfinance, Qdrant (vector search)
- **Infrastructure**: Docker, GitHub Actions

## Quick Start

```bash
# Clone and setup
git clone <repo>
cd adaptive-beta

# Start development environment
docker-compose up -d

# Backend
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload

# Frontend
cd frontend
npm install
npm run dev
```

## Development Roadmap

- [x] Project scaffold
- [ ] E*TRADE OAuth integration
- [ ] Portfolio data retrieval
- [ ] Real-time beta calculation
- [ ] Hedging recommendations
- [ ] Event probability overlay
