# Assess — Online Assessment System

A production-ready online assessment platform: candidates register, take a
40-minute, 40-question timed test, and admins review results.

## Stack

React 19 + Vite + TypeScript, Tailwind CSS v4, React Router, Supabase,
React Hook Form, Zustand, TanStack Query.

## Getting started

```bash
npm install
```

Copy `.env.example` to `.env` and fill in your Supabase project's URL and
anon key (Project Settings -> API in the Supabase dashboard). The four
authorized login accounts are also configured via `.env` — see
`.env.example` for the format. Change the values there to rotate
credentials without touching source code.

### Database setup

Run [`supabase/schema.sql`](supabase/schema.sql) once in your Supabase
project's SQL Editor (Project -> SQL Editor -> New query). It creates the
`students` and `submissions` tables with row-level security policies.

```bash
npm run dev
```

## Login accounts

Only these four accounts can sign in (no self-signup):

| Email | Role |
|---|---|
| `admin@gmail.com` | admin — views students, submissions, scores, CSV export |
| `b2b@gmail.com` | candidate |
| `chatcli@gmail.com` | candidate |
| `Deployment@gmail.com` | candidate |

Credentials live in `.env` (see `VITE_AUTH_USER_*` variables), not in
source code.

## Flow

1. **Login** — the only entry point; no signup.
2. **Instructions** — candidates read the rules and submit their details
   (name, email, phone, department), which are saved to the `students`
   table.
3. **Test** — 40 questions (20 Aptitude + 20 Coding, from
   `src/data/questions.json`), one at a time, with a question palette,
   Previous/Next navigation, mark-for-review, and a sticky 40-minute
   countdown timer that turns red in the last 5 minutes and auto-submits
   at zero. Answers auto-save to session storage as you go.
4. **Submit** — a confirmation dialog, then the answers are written to the
   `submissions` table along with time taken.
5. **Admin dashboard** (`admin@gmail.com` only) — lists students and
   submissions (with computed score and time taken), each exportable as
   CSV.

## Project structure

```
src/
  components/   Reusable UI (Button, Card, Input, Modal, ...) and test-taking UI (Timer, Palette, QuestionCard)
  pages/        Route-level pages (Login, Instructions, Test, Admin, ...)
  hooks/        useTimer
  lib/          supabaseClient, scoring, csv export, time formatting
  store/        Zustand stores (auth, test progress)
  services/     Supabase read/write wrappers (students, submissions) + credential validation
  types/        Shared TypeScript types
  data/         questions.json (the 40-question bank)
  layouts/      ProtectedRoute, AdminRoute, AppLayout

supabase/
  schema.sql    Table definitions + RLS policies
```

## Security notes

- No Supabase keys are hardcoded — both `VITE_SUPABASE_URL` and
  `VITE_SUPABASE_ANON_KEY` are read from environment variables, and `.env`
  is gitignored.
- Authentication is a fixed allowlist (this app has exactly four known
  accounts, no signup, no password reset), also sourced from environment
  variables rather than hardcoded in source.
- The Supabase service role key should never be placed in this project's
  `.env` or any `VITE_`-prefixed variable — it would be bundled into the
  client-side JavaScript and exposed to anyone who opens the app.
