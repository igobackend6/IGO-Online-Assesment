-- Online Assessment System — Supabase schema
-- Run this in the Supabase SQL Editor (Project -> SQL Editor -> New query).

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- students
-- ---------------------------------------------------------------------------
create table if not exists public.students (
  id          uuid primary key default gen_random_uuid(),
  name        text not null,
  email       text not null,
  phone       text not null,
  department  text not null,
  login_email text not null,
  created_at  timestamptz not null default now()
);

create index if not exists students_login_email_idx on public.students (login_email);

-- ---------------------------------------------------------------------------
-- submissions
-- ---------------------------------------------------------------------------
create table if not exists public.submissions (
  id            uuid primary key default gen_random_uuid(),
  student_id    uuid not null references public.students (id) on delete cascade,
  answers_json  jsonb not null default '{}'::jsonb,
  submitted_at  timestamptz not null default now(),
  time_taken    integer not null
);

create index if not exists submissions_student_id_idx on public.submissions (student_id);

-- Score is computed once at submission time (from the question bank at that
-- moment) and stored here, rather than recomputed from answers_json on every
-- admin read. This lets the "Qualified Students" query filter/index on
-- percentage directly instead of pulling every row to recompute in the client.
alter table public.submissions
  add column if not exists score integer not null default 0,
  add column if not exists total_questions integer not null default 0,
  add column if not exists percentage numeric(5, 2) not null default 0;

create index if not exists submissions_percentage_idx on public.submissions (percentage);

-- ---------------------------------------------------------------------------
-- Row Level Security
--
-- This app authenticates candidates against a fixed allowlist held in the
-- frontend's environment variables rather than Supabase Auth, so requests to
-- Postgres arrive using the public anon key with no Supabase auth session.
-- The policies below allow the anon role to insert/read the two tables the
-- app needs, which is appropriate for this single-purpose assessment tool.
-- If this project starts holding other, more sensitive data, switch to
-- Supabase Auth + user-scoped policies instead of anon-wide access.
-- ---------------------------------------------------------------------------
alter table public.students enable row level security;
alter table public.submissions enable row level security;

drop policy if exists "anon can insert students" on public.students;
create policy "anon can insert students"
  on public.students for insert
  to anon
  with check (true);

drop policy if exists "anon can read students" on public.students;
create policy "anon can read students"
  on public.students for select
  to anon
  using (true);

drop policy if exists "anon can insert submissions" on public.submissions;
create policy "anon can insert submissions"
  on public.submissions for insert
  to anon
  with check (true);

drop policy if exists "anon can read submissions" on public.submissions;
create policy "anon can read submissions"
  on public.submissions for select
  to anon
  using (true);

-- ---------------------------------------------------------------------------
-- Round 2: Live Coding Assessment
-- Additive extension — does not modify students/submissions above.
-- ---------------------------------------------------------------------------

-- ---------------------------------------------------------------------------
-- coding_students
-- ---------------------------------------------------------------------------
create table if not exists public.coding_students (
  id           uuid primary key default gen_random_uuid(),
  name         text not null,
  email        text not null,
  phone        text not null,
  department   text not null,
  login_email  text not null,
  registered_at timestamptz not null default now()
);

create index if not exists coding_students_email_idx on public.coding_students (email);

-- ---------------------------------------------------------------------------
-- coding_submissions
--
-- One row per Submit action (not per candidate) — a candidate may submit the
-- same question multiple times, and each attempt is kept so the "Submissions"
-- tab in the coding test UI can show a history, matching the LeetCode-style
-- reference layout this round is modeled on.
-- ---------------------------------------------------------------------------
create table if not exists public.coding_submissions (
  id                 uuid primary key default gen_random_uuid(),
  coding_student_id  uuid not null references public.coding_students (id) on delete cascade,
  question_id        integer not null,
  language           text not null,
  code               text not null,
  passed_test_cases  integer not null default 0,
  total_test_cases   integer not null default 10,
  percentage         numeric(5, 2) not null default 0,
  time_taken         integer not null default 0,
  violation_count    integer not null default 0,
  submitted_at       timestamptz not null default now()
);

create index if not exists coding_submissions_student_id_idx on public.coding_submissions (coding_student_id);
create index if not exists coding_submissions_passed_idx on public.coding_submissions (passed_test_cases);

alter table public.coding_students enable row level security;
alter table public.coding_submissions enable row level security;

drop policy if exists "anon can insert coding_students" on public.coding_students;
create policy "anon can insert coding_students"
  on public.coding_students for insert
  to anon
  with check (true);

drop policy if exists "anon can read coding_students" on public.coding_students;
create policy "anon can read coding_students"
  on public.coding_students for select
  to anon
  using (true);

drop policy if exists "anon can insert coding_submissions" on public.coding_submissions;
create policy "anon can insert coding_submissions"
  on public.coding_submissions for insert
  to anon
  with check (true);

drop policy if exists "anon can read coding_submissions" on public.coding_submissions;
create policy "anon can read coding_submissions"
  on public.coding_submissions for select
  to anon
  using (true);
