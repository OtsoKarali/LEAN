#!/bin/bash

echo "🚀 Setting up Adaptive Beta Portfolio Management System"

# Create .env file if it doesn't exist
if [ ! -f .env ]; then
    echo "📝 Creating .env file from template..."
    cp env.example .env
    echo "⚠️  Please edit .env file with your E*TRADE API credentials"
fi

# Generate Fernet key if not set
if ! grep -q "FERNET_KEY=" .env || grep -q "your_fernet_key_here" .env; then
    echo "🔑 Generating Fernet key..."
    FERNET_KEY=$(python3 -c "from cryptography.fernet import Fernet; print(Fernet.generate_key().decode())")
    sed -i.bak "s/FERNET_KEY=.*/FERNET_KEY=$FERNET_KEY/" .env
    echo "✅ Fernet key generated and added to .env"
fi

# Start Docker services
echo "🐳 Starting Docker services..."
docker-compose up -d

# Wait for services to be ready
echo "⏳ Waiting for services to be ready..."
sleep 10

# Install backend dependencies
echo "🐍 Installing Python dependencies..."
cd backend
pip install -r requirements.txt
cd ..

# Install frontend dependencies
echo "📦 Installing Node.js dependencies..."
cd frontend
npm install
cd ..

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Edit .env file with your E*TRADE API credentials"
echo "2. Start the backend: cd backend && uvicorn app.main:app --reload"
echo "3. Start the frontend: cd frontend && npm run dev"
echo "4. Visit http://localhost:3000 to connect your E*TRADE account" 