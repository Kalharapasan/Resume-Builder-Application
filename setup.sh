#!/bin/bash

echo "================================"
echo "AI Resume Generator Setup"
echo "================================"

# Backend setup
echo "Setting up backend..."
cd backend

# Create virtual environment
python3 -m venv venv
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Download spaCy model
python -m spacy download en_core_web_sm

echo "✓ Backend setup complete!"

# Frontend setup
echo "Setting up frontend..."
cd ../frontend

# Install dependencies
npm install

echo "✓ Frontend setup complete!"

echo ""
echo "================================"
echo "Setup Complete!"
echo "================================"
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
echo "================================"