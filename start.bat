@echo off
REM CodeLearner - Local Development Launcher (Windows)
REM This script starts both the frontend (Vite) and backend (Node.js) servers

echo.
echo 🚀 Starting CodeLearner...
echo.
echo 📦 Installing dependencies if needed...
call npm install

echo.
echo 🔥 Launching development servers...
echo    - Frontend: http://localhost:5173
echo    - Backend:  http://localhost:3000
echo.
echo Press Ctrl+C to stop all servers
echo.

call npm start
