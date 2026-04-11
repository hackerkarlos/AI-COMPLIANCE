# EUComply — AI-Powered EU Compliance Tool

**Stack**: Next.js 16, React 19, TypeScript 5 (strict), Tailwind CSS, Supabase (PostgreSQL + Auth), pnpm

## Supabase Project

- **Project ID**: `pcjswfyfhawdgveleizc`
- **Region**: eu-north-1 (Stockholm)
- **URL**: `https://pcjswfyfhawdgveleizc.supabase.co`
- Use the Supabase MCP tools (apply_migration, execute_sql, etc.) for all database operations
- Credentials are in `.env.local`

## Mission Control Integration

This project is tracked in Mission Control as project "AI Compliance" (id: 2, prefix: CPLY).
- MC MCP server is configured in `.claude/settings.json`
- Use MC MCP tools to update task status when starting/completing work
- When starting a task: update status to `in_progress`
- When done: update status to `review` (Toby will quality-review)

## Dev server & ports

- **App runs on port 3100** in dev, not the default 3000. MC holds 3002; 3000 is reserved for other local apps.
- `pnpm dev` uses `--webpack` because Turbopack hits `Invalid distDirRoot` when running inside the MC process tree (see Env Quirks below). `pnpm dev:turbo` is kept for when the scaffold is promoted off the MC-inherited shell.
- `typedRoutes` is on (out of `experimental` in Next 16). Every `Link href` is validated against the actual route tree. `pnpm typecheck` runs `next typegen` first so route types stay fresh.
- File convention: **`src/proxy.ts` (not `middleware.ts`)** — Next 16 renamed the convention. The exported function is `proxy(request)`, not `middleware(request)`.

## Env Quirks (OpenClaw / Mission Control shell)

Claude Code sessions on this workstation inherit a parent shell that Mission Control has polluted with Next.js runtime vars. This silently breaks every `next` command unless they are scrubbed. The `dev`/`build`/`typegen` scripts wrap `next` with an `env -u …` prefix that unsets:

- `__NEXT_PRIVATE_STANDALONE_CONFIG` — a serialized MC `next.config` that *overrides every config file in sight*, including `outputFileTracingRoot` and `turbopack.root`, pointing them at `mission-control/`. Symptom: `Invalid distDirRoot: ".next". distDirRoot should not navigate out of the projectPath.`
- `__NEXT_PROCESSED_ENV` — internal flag that tells Next "env files already loaded, skip them." Leaves the banner `- Environments: .env.local` printed but `process.env.NEXT_PUBLIC_*` empty. Symptom: Supabase client throws "URL and Key are required" even though `.env.local` is sitting right there.
- `TURBOPACK=1`, `__NEXT_PRIVATE_ORIGIN`, `NEXT_DEPLOYMENT_ID`, `NODE_ENV` — miscellaneous bleed-through that causes bundler-flag conflicts and "non-standard NODE_ENV" warnings.

If you are scripting around `next` by hand (e.g. for codemods), use `env -u __NEXT_PRIVATE_STANDALONE_CONFIG -u __NEXT_PRIVATE_ORIGIN -u __NEXT_PROCESSED_ENV -u TURBOPACK -u NEXT_DEPLOYMENT_ID -u NODE_ENV next …` to stay consistent.

## Conventions

- **Package manager**: pnpm only
- **Icons**: No icon libraries — use text/emoji
- **Components**: `src/components/ui/` for primitives, feature dirs for feature-specific
- **AI prompts**: `src/lib/ai/prompts/` — one file per regulation area
- **Database**: Use Supabase MCP `apply_migration` for schema changes, never raw SQL files
- **Auth**: Supabase Auth with `@supabase/ssr` — magic links, no passwords
- **Server components by default** — only use `'use client'` when needed (interactivity, hooks)
- **No AI attribution**: No `Co-Authored-By` trailers on commits

## Directory Structure

```
src/
  app/
    (marketing)/        Public pages (landing, pricing)
    (auth)/             Login, signup, callback
    (dashboard)/        Protected routes (dashboard, regulations, assessments)
    api/                Route handlers
  lib/
    supabase/           Supabase clients (browser, server, admin)
    ai/                 Anthropic SDK, classifiers, assessors
    ai/prompts/         Prompt templates per regulation
    regulations/        Static regulation metadata + checklist definitions
  components/
    ui/                 Reusable primitives (Button, Card, Badge, etc.)
    onboarding/         Wizard components
    dashboard/          Score cards, alerts
    assessment/         Report views
```

## AI Integration

- **Haiku** (`claude-haiku-4-5-20251001`) for classification (fast, cheap)
- **Sonnet** (`claude-sonnet-4-6`) for detailed assessments
- Temperature = 0 for all assessments
- Use `tool_use` for structured output — never parse free-form text
- All AI calls server-side in Route Handlers — never expose API key to client

## Scripts

```bash
pnpm dev              # next dev --webpack on PORT=3100 (env-scrubbed)
pnpm dev:turbo        # next dev --turbopack (keep for future, blocked by MC env today)
pnpm build            # next build
pnpm typegen          # regenerate .next/dev/types for typedRoutes
pnpm typecheck        # typegen + tsc --noEmit
pnpm lint             # next lint
```

Tests (to be added in later tasks):

```bash
pnpm test             # vitest unit tests
pnpm test:e2e         # playwright E2E
```

## Key Regulation Areas

1. GDPR (data protection) — Datatilsynet
2. Bogforingsloven (digital bookkeeping) — Erhvervsstyrelsen
3. ePrivacy/Cookies — overlaps GDPR
4. NIS2 (cybersecurity) — personal liability for founders
5. EU AI Act — enforceable Aug 2026
