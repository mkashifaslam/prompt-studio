# Prompt Studio – Full‑Stack Starter

A production‑ready starter to CRUD AI prompts, manage prompt versions/tags, and build/export MCP (Model Context Protocol) server/client JSON.

## Stack

- Frontend: React 18 + TypeScript, Vite, Material UI, React Router
- Backend: NestJS + TypeScript, TypeORM, PostgreSQL, Zod validation, Helmet, CORS
- Infra: Docker Compose (api, web, db, pgadmin), pnpm workspaces

## Quick Start

### Prerequisites

- Node.js 18+
- pnpm 8+
- PostgreSQL (or use Docker Compose)

### Installation

```bash
# Install all dependencies
pnpm install

# Set up environment variables
cp apps/api/.env.example apps/api/.env
# Edit apps/api/.env with your database connection
```

### Development

```bash
# Run both API and Web in development mode
pnpm dev

# Or run individually:
pnpm dev:api   # NestJS API on http://localhost:3000
pnpm dev:web   # React app on http://localhost:5173
```

### Production Build

```bash
# Build both projects
pnpm build

# Run production builds
pnpm start
```

### Available Scripts

- `pnpm dev` - Run both API and web in development mode
- `pnpm dev:api` - Run only the NestJS API in development
- `pnpm dev:web` - Run only the React web app in development
- `pnpm build` - Build both projects for production
- `pnpm build:api` - Build only the API
- `pnpm build:web` - Build only the web app
- `pnpm start` - Run both projects in production mode
- `pnpm test` - Run API tests
- `pnpm lint` - Lint the API code

## Project Structure

```
prompt-studio/
├── apps/
│   ├── api/          # NestJS backend
│   └── web/          # React frontend
├── packages/
│   └── ui/           # Shared UI components (future)
├── docker-compose.yml
└── pnpm-workspace.yaml
```

## Features

- ✅ CRUD operations for prompts
- ✅ TypeScript throughout
- ✅ Environment configuration with Zod validation
- ✅ Material UI components
- ✅ Responsive design
- ✅ Monorepo structure with pnpm workspaces
