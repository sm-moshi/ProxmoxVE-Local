# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Project overview

PVE Scripts Local — a full-stack Next.js 16 + Node.js application for managing Proxmox VE helper scripts. Users discover, download, and execute community-sourced Proxmox scripts via a web UI with real-time terminal output (xterm.js + WebSocket + node-pty). Data is persisted in SQLite via Prisma ORM. Scripts metadata comes from PocketBase and GitHub.

## Commands

| Task | Command |
|---|---|
| Build (generates Prisma client, caches logos, builds Next.js) | `npm run build` |
| Dev — Next.js only | `npm run dev` |
| Dev — custom server (WebSocket + Next.js) | `npm run dev:server` |
| Production | `npm start` |
| Lint | `npm run lint` |
| Lint + fix | `npm run lint:fix` |
| Format check | `npm run format:check` |
| Format write | `npm run format:write` |
| Type-check | `npm run typecheck` |
| Lint + type-check combined | `npm run check` |
| Run tests (watch mode) | `npm test` |
| Run tests once | `npm run test:run` |
| Run single test file | `npx vitest run path/to/file.test.ts` |
| Test with coverage | `npm run test:coverage` |
| Test UI | `npm run test:ui` |
| Generate Prisma client | `npm run generate` |
| Create Prisma migration | `npm run migrate` |

Requires **Node.js >= 24** and **npm 10.9.3**.

## Architecture

### Stack

- **Frontend**: Next.js 16 (app router) + React 19 + Tailwind CSS 4 + Radix UI
- **API layer**: tRPC (end-to-end type-safe RPCs) with `@tanstack/react-query`
- **Real-time**: WebSocket server (`ws`) for script execution, terminal emulation via xterm.js + node-pty
- **Database**: SQLite via Prisma ORM (`better-sqlite3` adapter)
- **External data**: PocketBase for script metadata, GitHub API for repository content
- **Auth**: JWT + bcryptjs password hashing
- **Testing**: Vitest + Testing Library (jsdom environment)

### Key directories

- `src/app/` — Next.js app router pages, layouts, and API routes
- `src/app/_components/` — React components (UI primitives in `ui/` subdirectory)
- `src/app/api/` — REST and tRPC API routes
- `src/server/api/routers/` — tRPC router definitions (scripts, servers, backups, repositories, etc.)
- `src/server/api/websocket/` — WebSocket handler for script execution
- `src/server/services/` — Business logic (script downloading, GitHub integration, PocketBase, auto-sync, backups)
- `src/server/lib/gitProvider/` — Abstraction for git repository providers
- `src/server/logging/` — Structured logging with redaction
- `prisma/` — Schema and migrations
- `server.js` — Main HTTP + WebSocket server entry point (runs both Next.js and WebSocket)

### Path aliases

- `~/` and `@/` both resolve to `./src/` (configured in `tsconfig.json`; Vitest only resolves `~`)

### Build notes

- Turbopack is disabled; Webpack is used (`next build --webpack`, `next dev --webpack`) for compatibility with server-side `child_process` usage.
- `postinstall` hook runs `prisma generate` automatically after `npm install`.
- Environment validation via `@t3-oss/env-nextjs` — skip with `SKIP_ENV_VALIDATION=1` for Docker builds.

## Code style

- TypeScript strict mode with `noUncheckedIndexedAccess`
- ESLint: typescript-eslint recommended + type-checked rules; `consistent-type-imports` enforced (inline type imports)
- Prettier with `prettier-plugin-tailwindcss` for class sorting
- ESM throughout (`"type": "module"` in package.json)
