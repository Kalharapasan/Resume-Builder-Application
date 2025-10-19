#!/bin/bash

echo "=========================================="
echo "AI Resume Generator v2.0 - Setup"
echo "=========================================="

# Check Python
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is not installed. Please install Python 3.8+"
    exit 1
fi

# Check Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 16+"
    exit 1
fi

echo "✓ Python and Node.js found"
echo ""

# Backend setup
echo "📦 Setting up backend..."
cd backend || exit

python3 -m venv venv
source venv/bin/activate

pip install --upgrade pip
pip install -r requirements.txt

echo "📥 Downloading spaCy model..."
python -m spacy download en_core_web_sm

echo "✓ Backend setup complete!"
echo ""

# Frontend setup
echo "📦 Setting up frontend..."
cd ../frontend || exit

npm install

echo "✓ Frontend setup complete!"
echo ""

echo "=========================================="
echo "✅ Setup Complete!"
echo "=========================================="
echo ""
echo "To start the application:"
echo ""
echo "Terminal 1 (Backend):"
echo "  cd backend"
echo "  source venv/bin/activate"
echo "  python app.py"
echo ""
echo "Terminal 2 (Frontend):"
echo "  cd frontend"
echo "  npm start"
echo ""
echo "Then open: http://localhost:3000"
echo "=========================================="