# ReactQuest - Learn React & TypeScript

An interactive learning platform to master React and TypeScript, featuring gamification elements inspired by Duolingo.

## Features

- **6 Learning Modules**: JSX Basics, Components & Props, State with useState, Event Handling, useEffect Hook, TypeScript with React
- **Interactive Lessons**: Theory with live code examples
- **Hands-on Exercises**: Write code and see it render in real-time
- **AI-Powered Validation**: Code is validated by DeepSeek AI with helpful feedback
- **AI Tutor**: Ask questions about concepts during lessons
- **Gamification**: XP, levels, hearts, streaks to keep you motivated

## Getting Started

### Prerequisites

- Node.js 18+ installed
- npm or another package manager

### Installation

```bash
# Install dependencies
npm install
```

### Quick Start

**Linux/Mac:**
```bash
./start.sh
```

**Windows:**
```cmd
start.bat
```

**Or using npm:**
```bash
npm start
```

This will start:
- Frontend at http://localhost:5173
- Backend API at http://localhost:3000

### Alternative: Run separately

```bash
# Terminal 1: Start frontend
npm run dev

# Terminal 2: Start backend
npm run server
```

## Project Structure

```
CodeLearner/
├── src/
│   ├── components/      # Reusable UI components
│   ├── context/         # React context (user state)
│   ├── data/           # Learning modules and exercises
│   ├── pages/          # Page components
│   ├── services/       # API client
│   ├── types/          # TypeScript types
│   └── App.tsx         # Main app component
├── backend/
│   ├── server.js       # Express API server
│   └── data.json       # User progress storage
└── public/             # Static assets
```

## Learning Path

1. **JSX Basics** - Learn the syntax that powers React
2. **Components & Props** - Build reusable UI pieces
3. **State with useState** - Make components interactive
4. **Event Handling** - Respond to user interactions
5. **useEffect Hook** - Handle side effects
6. **TypeScript with React** - Add type safety

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite, TailwindCSS
- **Backend**: Node.js (vanilla HTTP server)
- **Code Editor**: Monaco Editor
- **AI**: DeepSeek API for code validation and tutoring

## Configuration

The DeepSeek API key is configured in `backend/server.js`. For production, move it to environment variables.
