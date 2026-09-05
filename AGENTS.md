# AGENTS.md

Monorepo for "roomies" (student housing), currently early-stage scaffolding. Two independent packages, no root `package.json` — run commands inside each package dir.

## Layout

- `backend/` — Express 5 API, CommonJS. Layered: `src/routes` → `src/controller` → `src/service` → `src/repository` → `src/model`, wired via `src/config`. Entrypoint is `src/app.js` (binds to `PORT` or 3000). `src/server.js` is an empty unused file.
- `frontend/` — React Router v8 (framework mode, SSR), Vite, Tailwind v4, TypeScript (ESM). Routes declared in `app/routes.ts`; route modules in `app/routes/`. Path alias `~/*` → `app/*`.

## Commands

- Backend: run with `node src/app.js` (no npm start script). No tests or lint; `npm test` is a placeholder that exits 1.
- Frontend: `npm run dev` (HMR, port 5173), `npm run build`, `npm run start` (serves `build/server/index.js`), `npm run typecheck`.

## Gotchas

- All backend naming is Spanish (routes like `/api/user/iniciar-sesion`, file/comment names) — keep new code consistent.
- Backend data layer is stubbed: `UserRepository` returns hardcoded values, no DB. Domain models contain scaffold bugs (e.g., `User.js` assigns an undefined `perfil` var; `Alojamiento.js` has a duplicate constructor param). Don't treat scaffold code as verified logic.
- `typecheck` must be run via `npm run typecheck` (not bare `tsc`): it runs `react-router typegen` first to generate the gitignored `.react-router/types/` dir that `tsconfig.json` depends on.
- React Router conventions live in `frontend/.agents/skills/react-router/SKILL.md` (+ `references/`) — consult it for routing, loaders, and forms work.
- Root `.gitignore` has a stale Java/Maven/Gradle section for the backend; the backend is Node, so don't infer tooling from it.