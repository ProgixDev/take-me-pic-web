# TASK-001 - Establish Supabase Web Baseline and Health Check

Status: Done
Priority: P0
Project: Take Me Pic Web/Admin
Milestone: Web Phase 1 - Admin trust and safety foundation
Owner: Agent

## Purpose

Connect the Next.js web app to the existing Take Me Pic Supabase project using
frontend-safe environment variables and a minimal runtime health check.

## Scope

- Add `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` to
  local env.
- Keep real env values out of git and commit placeholder `.env.example`.
- Install Supabase browser/server client dependencies.
- Add server and browser Supabase client helpers.
- Add Next.js Proxy session refresh helper.
- Add a server health endpoint that checks Supabase reachability.
- Surface the Supabase connection state on the public status page.

## Acceptance Criteria

- [x] `.env.local` is ignored.
- [x] `.env.example` contains placeholders only.
- [x] Supabase browser client uses only publishable config.
- [x] Supabase server client is available for route/server usage.
- [x] `/api/health/supabase` validates backend reachability.
- [x] `/status` displays Supabase connection state.
- [x] `npx tsc --noEmit` passes.

## Technical Notes

- Files: `lib/supabase/*`, `proxy.ts`, `app/api/health/supabase/route.ts`.
- Do not add service-role keys to this repo.
- This task proves connectivity, not staff authorization.

## Verification

- TypeScript.
- Manual status-page check in dev or production build.
