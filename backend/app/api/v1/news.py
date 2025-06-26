from fastapi import APIRouter, HTTPException
import httpx
import asyncio
from typing import List, Dict
import os
from datetime import datetime, timedelta

router = APIRouter(prefix="/news", tags=["News"])

# Free news API (NewsAPI.org) - you can get a free key at https://newsapi.org/
NEWS_API_KEY = os.getenv("NEWS_API_KEY", "demo_key")
NEWS_API_URL = "https://newsapi.org/v2/top-headlines"

@router.get("/headlines")
async def get_headlines():
    """Get financial news headlines for the ticker"""
    
    # Demo headlines if no API key
    if NEWS_API_KEY == "demo_key":
        demo_headlines = [
            {
                "title": "S&P 500 Hits New Record High as Tech Stocks Rally",
                "source": "Financial Times",
                "publishedAt": datetime.now().isoformat(),
                "url": "https://www.ft.com/markets"
            },
            {
                "title": "Federal Reserve Signals Potential Rate Cut in September",
                "source": "Wall Street Journal",
                "publishedAt": (datetime.now() - timedelta(hours=2)).isoformat(),
                "url": "https://www.wsj.com/news/markets"
            },
            {
                "title": "Apple Reports Strong Q3 Earnings, Stock Up 5%",
                "source": "Reuters",
                "publishedAt": (datetime.now() - timedelta(hours=4)).isoformat(),
                "url": "https://www.reuters.com/markets"
            },
            {
                "title": "Tesla Announces New Battery Technology Breakthrough",
                "source": "Bloomberg",
                "publishedAt": (datetime.now() - timedelta(hours=6)).isoformat(),
                "url": "https://www.bloomberg.com/markets"
            },
            {
                "title": "Oil Prices Surge on Middle East Tensions",
                "source": "CNBC",
                "publishedAt": (datetime.now() - timedelta(hours=8)).isoformat(),
                "url": "https://www.cnbc.com/markets"
            },
            {
                "title": "Microsoft Cloud Revenue Exceeds Expectations",
                "source": "MarketWatch",
                "publishedAt": (datetime.now() - timedelta(hours=10)).isoformat(),
                "url": "https://www.marketwatch.com"
            },
            {
                "title": "Bitcoin Reaches $50,000 as Institutional Adoption Grows",
                "source": "CoinDesk",
                "publishedAt": (datetime.now() - timedelta(hours=12)).isoformat(),
                "url": "https://www.coindesk.com"
            },
            {
                "title": "Goldman Sachs Upgrades Market Outlook for 2024",
                "source": "Yahoo Finance",
                "publishedAt": (datetime.now() - timedelta(hours=14)).isoformat(),
                "url": "https://finance.yahoo.com"
            }
        ]
        return {
            "status": "ok",
            "totalResults": len(demo_headlines),
            "articles": demo_headlines,
            "demo_mode": True
        }
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                NEWS_API_URL,
                params={
                    "country": "us",
                    "category": "business",
                    "apiKey": NEWS_API_KEY,
                    "pageSize": 10
                },
                timeout=10.0
            )
            
            if response.status_code != 200:
                raise HTTPException(status_code=500, detail="News API error")
            
            data = response.json()
            
            # Filter and format headlines for ticker
            headlines = []
            for article in data.get("articles", []):
                if article.get("title") and article.get("title") != "[Removed]":
                    headlines.append({
                        "title": article["title"],
                        "source": article.get("source", {}).get("name", "Unknown"),
                        "publishedAt": article.get("publishedAt", ""),
                        "url": article.get("url", "#")
                    })
            
            return {
                "status": data.get("status", "ok"),
                "totalResults": data.get("totalResults", len(headlines)),
                "articles": headlines[:8],  # Limit to 8 headlines for ticker
                "demo_mode": False
            }
            
    except Exception as e:
        # Fallback to demo headlines on error
        return {
            "status": "error",
            "totalResults": 8,
            "articles": [
                {
                    "title": "Market Update: S&P 500 Continues Bullish Trend",
                    "source": "Market Data",
                    "publishedAt": datetime.now().isoformat(),
                    "url": "https://finance.yahoo.com/quote/%5EGSPC"
                },
                {
                    "title": "Tech Sector Leads Market Gains Today",
                    "source": "Market Data",
                    "publishedAt": datetime.now().isoformat(),
                    "url": "https://finance.yahoo.com/quote/%5EIXIC"
                }
            ],
            "demo_mode": True,
            "error": str(e)
        }

@router.get("/market-sentiment")
async def get_market_sentiment():
    """Get market sentiment indicators"""
    return {
        "fear_greed_index": 65,  # 0-100 scale
        "vix": 18.5,  # Volatility index
        "market_mood": "Bullish",
        "timestamp": datetime.now().isoformat()
    } 