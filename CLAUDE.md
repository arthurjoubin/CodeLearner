# CLAUDE.md - AI Assistant Guide for HACKUP (CodeLearner)

## Project Overview

HACKUP is an interactive learn-to-code platform where users master web development through hands-on exercises with AI-powered code validation and tutoring. It features gamification (XP, levels, streaks, leaderboard) and covers React, Web Stack, and Git courses.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend SSG | Astro 5.x with SSR (`output: 'server'`) |
| UI Framework | React 18 (via `@astrojs/react`) |
| Styling | TailwindCSS 3.4 + `@tailwindcss/typography` |
| Code Editor | Monaco Editor (`@monaco-editor/react`) |
| Icons | Lucide React |
| Language | TypeScript 5.4 (strict mode) |
| Production Backend | Cloudflare Workers |
| Database | Cloudflare D1 (SQLite) |
| Local Dev Backend | Node.js Express (`backend/server.js`) |
| AI Integration | DeepSeek API (validation, chat, hints) |
| Build Tool | Vite 5.1 (via Astro) |
| Deployment | Cloudflare Pages (frontend) + Cloudflare Workers (API) |

## Commands

```bash
# Install dependencies
npm install

# Start both frontend + local backend concurrently
npm start

# Frontend dev server only (port 5173)
npm run dev

# Local backend server only (port 3001)
npm run server

# Production build
npm run build

# Preview production build locally
npm run preview
```

There are no test or lint commands configured. TypeScript checking is done through the build process.

## Project Structure

```
CodeLearner/
├── src/                          # Frontend source (Astro + React)
│   ├── pages/                    # Astro page routes
│   │   ├── learning-path/        # Course navigation pages
│   │   ├── module/               # Module detail pages
│   │   ├── lesson/               # Lesson content pages
│   │   ├── exercise/             # Coding exercise pages
│   │   └── labs/                 # Advanced lab challenges
│   ├── components/               # React components
│   │   ├── completion-modals/    # XP/completion notification modals
│   │   ├── Layout.tsx            # Main app layout (menu, header, footer)
│   │   ├── LivePreview.tsx       # Real-time code preview renderer
│   │   └── GitSimulator.tsx      # Interactive git terminal simulator
│   ├── context/
│   │   └── UserContext.tsx       # Global user state (auth, XP, progress)
│   ├── services/
│   │   └── api.ts                # API client for Cloudflare Worker backend
│   ├── data/
│   │   └── modules/              # 50+ JSON files defining course content
│   │       └── index.ts          # Data loader that exports query functions
│   ├── types/
│   │   └── index.ts              # All TypeScript interfaces + type guards
│   ├── content/                  # Astro content collections (news, tools, etc.)
│   ├── hooks/                    # Custom React hooks
│   ├── utils/                    # Utility functions
│   └── layouts/                  # Astro layout components
├── worker/                       # Cloudflare Worker (production API)
│   ├── index.ts                  # Worker entry point + router
│   ├── routes/
│   │   ├── auth.ts               # Authentication endpoints
│   │   ├── ai.ts                 # AI validation/chat/hint endpoints
│   │   ├── api.ts                # User progress + leaderboard
│   │   └── admin.ts              # Admin operations
│   ├── rate-limit.ts             # Rate limiter (20 req/min per user)
│   ├── utils.ts                  # CORS, error helpers
│   └── types.ts                  # Worker-specific types (Env binding)
├── backend/
│   └── server.js                 # Local dev Express server (mirrors worker API)
├── migrations/                   # D1 database migrations (SQL)
│   ├── 001_init.sql              # users, user_progress, sessions tables
│   └── 002_add_admin_flag.sql    # Admin user feature
├── scripts/                      # Build/migration utilities
├── astro.config.mjs              # Astro config (React + Tailwind + Cloudflare)
├── wrangler.toml                 # Cloudflare Workers config + D1 binding
├── tailwind.config.js            # Custom theme (green primary, magenta accent)
└── tsconfig.json                 # Strict TS with noUnusedLocals/Parameters
```

## Architecture

### Frontend (Astro + React Hybrid)

- **Astro** handles page routing and static rendering. Pages are in `src/pages/` as `.astro` files.
- **React** powers interactive components (code editor, live preview, modals). React components use `client:load` or `client:only="react"` directives in Astro pages.
- **UserContext** (`src/context/UserContext.tsx`) manages all user state globally: authentication, XP, progress, streaks. It debounce-saves to the backend every 1 second.
- **API client** (`src/services/api.ts`) talks to the Cloudflare Worker at a hardcoded URL. All requests use `credentials: 'include'` for session cookies.

### Backend (Cloudflare Workers)

- The worker entry point (`worker/index.ts`) routes requests through handler functions that return `Response | null`. First non-null response wins.
- Route handler chain: `auth -> admin -> ai -> api`
- Authentication uses session-based cookies (30-day expiry) with SHA-256 + salt password hashing.
- AI endpoints proxy to the DeepSeek API and are rate-limited to 20 requests/minute per user.
- The local dev server (`backend/server.js`) mirrors the same API for development without Cloudflare.

### Data Model

Course content is stored as JSON files in `src/data/modules/`. Each file contains:
```json
{
  "module": { "id": "...", "courseId": "react|web-stack|git", ... },
  "lessons": [...],
  "exercises": [...]
}
```

The data loader at `src/data/modules/index.ts` imports all JSON files and exports query functions (`getModule`, `getLesson`, `getExercise`, `getLessonsForModule`, etc.).

### Database Schema (D1/SQLite)

Three tables: `users`, `user_progress`, `sessions`. Progress fields (`completed_lessons`, `completed_exercises`, `module_progress`, `lab_progress`) are stored as JSON strings.

## Key Types

Defined in `src/types/index.ts`:

- `User` - Core user model with XP, level, streak, progress arrays
- `Module`, `Lesson` - Course structure
- `Exercise` - Union type: `CodeExercise | QuizExercise | GitScenarioExercise`
- Type guards: `isCodeExercise()`, `isQuizExercise()`, `isGitScenarioExercise()`
- `LEVELS` array defines 20 levels from "Novice" (0 XP) to "Godlike" (692,600+ XP)

## Exercise Types

1. **CodeExercise** - Write JSX/React code validated by DeepSeek AI. Has `starterCode`, `solution`, `hints`, `validationPrompt`.
2. **QuizExercise** (`type: 'quiz'`) - Multiple-choice questions with `correctAnswer` index and `explanation`.
3. **GitScenarioExercise** (`type: 'git-scenario'`) - Interactive git terminal with `initialState`, `objectives`, and objective checks (branch exists, commits count, file status, etc.).

## Coding Conventions

### TypeScript
- Strict mode enabled with `noUnusedLocals` and `noUnusedParameters`
- Target ES2020, module resolution: `bundler`
- All interfaces defined in `src/types/index.ts` (frontend) or `worker/types.ts` (backend)
- Use type guards for discriminated union types (Exercise)

### React
- Functional components only, using hooks
- State management via React Context (no Redux/Zustand)
- `useCallback` for memoized handlers in context providers
- Components use TailwindCSS classes directly (no CSS modules/styled-components)

### Styling
- TailwindCSS with a "brutalist" design system: thick borders, box shadows (`shadow-brutal`), monospace fonts (JetBrains Mono)
- Custom color palette: `primary` (green), `accent` (magenta/purple), `brutal` (bold colors)
- Custom breakpoint `xs: 400px` added
- Typography plugin for rendered markdown content

### API Pattern
- Worker routes return `Response | null` (null means "not my route, try next")
- All API responses are JSON with CORS headers
- Errors follow `{ error: string }` format
- Session auth via HTTP-only cookies with `SameSite=None; Secure`

### Content Files
- Module JSON files use camelCase for field names
- Lesson content is Markdown with fenced code blocks
- Each lesson starts with `# Essential to know` summary followed by `---` separator
- Exercise `validationPrompt` is the instruction given to DeepSeek to validate student code

## Adding New Content

### New Module to Existing Course
1. Create `src/data/modules/{module-id}.json` following the schema
2. Set `courseId` to `"react"`, `"web-stack"`, or `"git"`
3. Edit `src/data/modules/index.ts`: add import and include in the data array

### New Course
1. Pick a `courseId` (lowercase, no spaces)
2. Create module JSON files with that `courseId`
3. Register in `src/data/modules/index.ts`
4. Create a learning path page if needed

See `src/data/README - how to update courses.md` for the full JSON schema and guidelines.

## API Endpoints

| Method | Path | Auth | Description |
|--------|------|------|-------------|
| POST | `/auth/register` | No | Create account |
| POST | `/auth/login` | No | Login |
| POST | `/auth/logout` | Yes | Logout |
| GET | `/auth/me` | Yes | Current user |
| POST | `/auth/reset-password` | Yes | Change password |
| POST | `/api/validate` | Yes | Validate exercise code (AI) |
| POST | `/api/chat` | Yes | Chat with AI tutor |
| POST | `/api/hint` | Yes | Get exercise hint (AI) |
| POST | `/api/user` | Yes | Save user progress |
| GET | `/api/user/:id` | Yes | Get user profile |
| GET | `/api/leaderboard` | Yes | Leaderboard rankings |
| POST | `/api/admin/*` | Admin | Admin operations |

## Deployment

- **Frontend**: Cloudflare Pages with Astro SSR adapter (`@astrojs/cloudflare`)
- **API**: Cloudflare Workers (configured in `wrangler.toml`)
- **Database**: Cloudflare D1 bound as `DB` in the worker
- **Production URL**: `https://codelearner.pages.dev` (frontend), `https://codelearner-api.arthurjoubin.workers.dev` (API)

## Known Gaps

- No test framework configured (no unit tests, no E2E tests)
- No ESLint/Prettier configuration
- The local dev backend (`backend/server.js`) has a hardcoded API key
- Rate limiting is per-isolate (not globally distributed across Cloudflare edge)
- `api.ts` has a hardcoded worker URL rather than using environment variables
