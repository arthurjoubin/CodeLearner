#!/bin/bash

# CodeLearner - Local Development Launcher
# This script starts both the frontend (Vite) and backend (Node.js) servers

echo "🚀 Starting CodeLearner..."
echo ""
echo "📦 Installing dependencies if needed..."
npm install

echo ""
echo "🔥 Launching development servers..."
echo "   - Frontend: http://localhost:5173"
echo "   - Backend:  http://localhost:3000"
echo ""
echo "Press Ctrl+C to stop all servers"
echo ""

npm start
