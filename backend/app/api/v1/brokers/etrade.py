from fastapi import APIRouter, Depends, HTTPException, Response
from fastapi.responses import RedirectResponse
from requests_oauthlib import OAuth1Session
import redis
import json
from app.core.config import settings
from app.core.security import encrypt_json, decrypt_json

router = APIRouter(prefix="/brokers/etrade", tags=["E*TRADE"])

# E*TRADE API endpoints
REQUEST_TOKEN = "https://apisb.etrade.com/oauth/request_token" \
    if settings.ETRADE_ENV == "sandbox" else "https://api.etrade.com/oauth/request_token"
ACCESS_TOKEN = "https://apisb.etrade.com/oauth/access_token" \
    if settings.ETRADE_ENV == "sandbox" else "https://api.etrade.com/oauth/access_token"
AUTH_URL = "https://us.etrade.com/e/t/etws/authorize"

# API base URL
BASE_URL = "https://apisb.etrade.com/v1" \
    if settings.ETRADE_ENV == "sandbox" else "https://api.etrade.com/v1"

# Redis connection
try:
    redis_client = redis.from_url(settings.REDIS_URL)
except:
    # Fallback for development without Redis
    redis_client = None

@router.get("/login")
async def login():
    """Initiate E*TRADE OAuth 1.0a flow"""
    # Check if we're in demo mode
    if settings.ETRADE_CONSUMER_KEY == "demo_key":
        return {
            "redirect": "http://localhost:3000/dashboard",
            "demo_mode": True,
            "message": "Demo mode - skipping OAuth for development"
        }
    
    try:
        oauth = OAuth1Session(
            settings.ETRADE_CONSUMER_KEY,
            client_secret=settings.ETRADE_CONSUMER_SECRET,
            callback_uri=settings.BROKER_CALLBACK
        )
        
        # Get request token
        resp = oauth.fetch_request_token(REQUEST_TOKEN)
        
        # Store token secret in Redis with 15-minute TTL
        if redis_client:
            redis_client.setex(
                resp["oauth_token"], 
                900,  # 15 minutes
                resp["oauth_token_secret"]
            )
        
        # Build authorization URL
        auth_url = f"{AUTH_URL}?key={settings.ETRADE_CONSUMER_KEY}&token={resp['oauth_token']}"
        
        return {"redirect": auth_url}
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OAuth initiation failed: {str(e)}")

@router.get("/callback")
async def callback(oauth_token: str, oauth_verifier: str):
    """Handle OAuth callback from E*TRADE"""
    # Check if we're in demo mode
    if settings.ETRADE_CONSUMER_KEY == "demo_key":
        return RedirectResponse(url="http://localhost:3000/dashboard")
    
    try:
        # Get stored token secret from Redis
        if not redis_client:
            raise HTTPException(status_code=500, detail="Redis not available")
            
        token_secret = redis_client.get(oauth_token)
        if not token_secret:
            raise HTTPException(status_code=400, detail="OAuth token expired or not found")
        
        # Create OAuth session with request token
        oauth = OAuth1Session(
            settings.ETRADE_CONSUMER_KEY,
            client_secret=settings.ETRADE_CONSUMER_SECRET,
            resource_owner_key=oauth_token,
            resource_owner_secret=token_secret.decode(),
            verifier=oauth_verifier
        )
        
        # Exchange for access token
        creds = oauth.fetch_access_token(ACCESS_TOKEN)
        
        # Encrypt and store credentials (in production, save to database)
        encrypted_creds = encrypt_json(creds)
        
        # For now, store in Redis (in production, save to user's database record)
        redis_client.setex(
            f"etrade_creds_{oauth_token}",
            86400,  # 24 hours
            encrypted_creds
        )
        
        # Clean up request token
        redis_client.delete(oauth_token)
        
        # Redirect to dashboard
        return RedirectResponse(url="http://localhost:3000/dashboard")
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"OAuth callback failed: {str(e)}")

@router.get("/portfolio")
async def get_portfolio():
    """Get portfolio holdings from E*TRADE"""
    # Check if we're in demo mode
    if settings.ETRADE_CONSUMER_KEY == "demo_key":
        return {
            "account_id": "DEMO_ACCOUNT",
            "portfolio": {
                "AccountPortfolio": {
                    "totalValue": "125,000.00",
                    "Position": [
                        {
                            "symbol": "AAPL",
                            "symbolDescription": "Apple Inc.",
                            "quantity": 100,
                            "marketValue": "17,500.00"
                        },
                        {
                            "symbol": "MSFT",
                            "symbolDescription": "Microsoft Corporation",
                            "quantity": 50,
                            "marketValue": "18,750.00"
                        },
                        {
                            "symbol": "GOOGL",
                            "symbolDescription": "Alphabet Inc.",
                            "quantity": 25,
                            "marketValue": "3,375.00"
                        },
                        {
                            "symbol": "TSLA",
                            "symbolDescription": "Tesla Inc.",
                            "quantity": 75,
                            "marketValue": "15,750.00"
                        },
                        {
                            "symbol": "SPY",
                            "symbolDescription": "SPDR S&P 500 ETF",
                            "quantity": 200,
                            "marketValue": "89,625.00"
                        }
                    ]
                }
            },
            "beta": 1.15,
            "demo_mode": True
        }
    
    try:
        # For demo purposes, get the first stored credentials
        # In production, this would be user-specific
        if not redis_client:
            raise HTTPException(status_code=500, detail="Redis not available")
            
        keys = redis_client.keys("etrade_creds_*")
        if not keys:
            raise HTTPException(status_code=401, detail="No E*TRADE credentials found")
        
        creds_key = keys[0]
        encrypted_creds = redis_client.get(creds_key)
        creds = decrypt_json(encrypted_creds.decode())
        
        # Create OAuth session with access token
        oauth = OAuth1Session(
            settings.ETRADE_CONSUMER_KEY,
            client_secret=settings.ETRADE_CONSUMER_SECRET,
            resource_owner_key=creds["oauth_token"],
            resource_owner_secret=creds["oauth_token_secret"]
        )
        
        # Get accounts
        accounts_resp = oauth.get(f"{BASE_URL}/accounts/list")
        accounts_resp.raise_for_status()
        accounts = accounts_resp.json()
        
        # Get first account ID
        account_id = accounts["Accounts"]["Account"][0]["accountIdKey"]
        
        # Get portfolio positions
        portfolio_resp = oauth.get(f"{BASE_URL}/accounts/{account_id}/portfolio.json")
        portfolio_resp.raise_for_status()
        portfolio = portfolio_resp.json()
        
        return {
            "account_id": account_id,
            "portfolio": portfolio,
            "beta": 1.0  # Placeholder - will be calculated in Milestone 2
        }
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Portfolio retrieval failed: {str(e)}")

@router.get("/accounts")
async def get_accounts():
    """Get E*TRADE accounts"""
    # Check if we're in demo mode
    if settings.ETRADE_CONSUMER_KEY == "demo_key":
        return {
            "Accounts": {
                "Account": [
                    {
                        "accountIdKey": "DEMO_ACCOUNT",
                        "accountName": "Demo Portfolio",
                        "accountType": "INDIVIDUAL"
                    }
                ]
            },
            "demo_mode": True
        }
    
    try:
        # Get stored credentials
        if not redis_client:
            raise HTTPException(status_code=500, detail="Redis not available")
            
        keys = redis_client.keys("etrade_creds_*")
        if not keys:
            raise HTTPException(status_code=401, detail="No E*TRADE credentials found")
        
        creds_key = keys[0]
        encrypted_creds = redis_client.get(creds_key)
        creds = decrypt_json(encrypted_creds.decode())
        
        # Create OAuth session
        oauth = OAuth1Session(
            settings.ETRADE_CONSUMER_KEY,
            client_secret=settings.ETRADE_CONSUMER_SECRET,
            resource_owner_key=creds["oauth_token"],
            resource_owner_secret=creds["oauth_token_secret"]
        )
        
        # Get accounts
        accounts_resp = oauth.get(f"{BASE_URL}/accounts/list")
        accounts_resp.raise_for_status()
        accounts = accounts_resp.json()
        
        return accounts
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Accounts retrieval failed: {str(e)}") 