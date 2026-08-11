# Todo App — React / Next.js / Zustand frontend

A second frontend for the TodoApp, feature-matched to the Angular app in
[`../frontend`](../frontend). Built with **Next.js (App Router)**,
**TypeScript**, **Tailwind CSS**, and **Zustand**, talking to the same .NET API.

## Features

- Sign in (demo credentials `demo@todo.local` / `Demo123!`)
- List, create, and delete todos (two-step delete confirmation)
- Client-side validation, loading/empty/error states, auto-dismissing success banner
- Session persisted in `sessionStorage`; automatic sign-out and redirect on `401`

## Prerequisites

- Node.js 18.18+ (developed on Node 24)
- The .NET API running on `http://localhost:5080`
  (`dotnet run --project ../src/TodoApp.Api`)

## Getting started

```bash
npm install
npm run dev
```

Open http://localhost:3000. Requests to `/api/*` are proxied to the .NET API
via a rewrite in `next.config.ts`, so no CORS changes are needed. Override the
target with the `API_BASE_URL` environment variable (see `.env.example`).

## Scripts

- `npm run dev` — start the dev server
- `npm run build` — production build
- `npm start` — serve the production build
- `npm run lint` — run ESLint

## Architecture

- `src/lib/api-client.ts` — fetch wrapper: bearer injection, ProblemDetails
  parsing into `ApiError`, and `401` handling (replaces the Angular interceptor).
- `src/store/auth-store.ts` — Zustand store persisted to `sessionStorage`
  (key `todoapp.session`).
- `src/store/todos-store.ts` — todo list state and actions.
- `src/components/AuthGuard.tsx` — client-side route guard used by
  `src/app/todos/layout.tsx`.
