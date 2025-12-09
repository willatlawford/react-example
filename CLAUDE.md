# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Full-stack todo list application with a FastAPI backend and React frontend.

## Commands

### Backend (from `backend/` directory)
```bash
uv run python main.py              # Start dev server with reload
uv run uvicorn src.main:app --reload  # Alternative start command
uv add <package>                   # Add dependency
uv remove <package>                # Remove dependency
```

### Frontend (from `frontend/` directory)
```bash
npm run dev      # Start Vite dev server (port 5173)
npm run build    # Production build
npm run lint     # Run ESLint
```

### VSCode
Use the Run panel to start "FastAPI Backend", "Vite Dev Server", or "Full Stack" (both).

## Architecture

### Backend (`backend/`)
- **Entry point**: `main.py` imports and runs the FastAPI app
- **App**: `src/main.py` - FastAPI app with CORS middleware
- **Config**: `src/config.py` - Pydantic Settings loading from `.env`
- **Routers**: `src/routers/` - RESTful endpoints at `/api/categories` and `/api/todos`
- **Schemas**: `src/schemas/` - Pydantic models (Category, Todo with Create/Update variants)
- **Storage**: `src/storage/memory.py` - In-memory storage (dict-based)

### Frontend (`frontend/`)
- **Entry**: `src/main.tsx` → `src/App.tsx`
- **Routing**: React Router with three pages
- **Pages**: `src/pages/` - AddTodoPage, ViewTodosPage, ManageCategoriesPage
- **Models**: `src/models/` - TypeScript interfaces matching backend schemas (snake_case)
- **API calls**: Inline fetch within page components (no separate API layer)

## TypeScript Notes

The frontend uses `verbatimModuleSyntax: true`, so type-only imports must use `import type`:
```typescript
import type { Todo } from "../models/todo";
```

## API Endpoints

- `GET/POST /api/categories` - List/create categories
- `GET/PUT/DELETE /api/categories/{id}` - Single category operations
- `GET/POST /api/todos` - List/create todos (GET supports `?category_id=X` filter)
- `GET/PUT/DELETE /api/todos/{id}` - Single todo operations
