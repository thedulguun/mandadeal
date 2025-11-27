#!/bin/bash
echo "Installing dependencies..."
pip install -r requirements.txt

echo ""
echo "Starting game server..."
echo "Game will be available at http://localhost:8000"
echo ""
uvicorn main:app --reload --host 0.0.0.0 --port 8000
