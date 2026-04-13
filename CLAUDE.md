# EUComply — Coding Conventions & Development Guide

This document outlines the coding conventions, directory structure, and development practices for the EUComply project, following Mission Control patterns.

## 1. Coding Conventions (Mission Control Patterns)

### TypeScript & React

- **Strict TypeScript**: Enable `strict: true` in `tsconfig.json`. Use explicit types over inference when clarity is needed.
- **React 19**: Use latest React features (Server Components, Actions) where appropriate.
- **Server Components by Default**: Default to server components; only add `'use client'` when interactivity or hooks are required.
- **Component Patterns**:
  - Use function components with TypeScript interfaces for props
  - Destructure props at the beginning of the component
  - Keep components focused and small (max 150-200 lines)
  - Extract complex logic into custom hooks or utility functions

### Styling with Tailwind CSS

- **Tailwind CSS 4**: Use utility classes exclusively; avoid custom CSS unless absolutely necessary
- **Design Tokens**: Use `tailwind.config.js` for project-wide design tokens (colors, spacing, typography)
- **Component Variants**: Use `class-variance-authority` (CVA) for complex component variants
- **Dark Mode**: Support via `next-themes` or custom theme provider

### State Management

- **Local State**: `useState` for component-level state
- **Server State**: Use Supabase realtime subscriptions or SWR/React Query for server data (if needed)
- **Global State**: Avoid global state unless necessary; prefer URL params or server state
- **Form State**: Use React Hook Form with Zod validation

### Error Handling

- **Graceful Degradation**: Components should handle missing data gracefully
- **Error Boundaries**: Use React error boundaries for client-side errors
- **Server Errors**: Log server errors appropriately; return user-friendly messages
- **Validation**: Use Zod for runtime validation of API inputs and environment variables

### Naming Conventions

- **Components**: PascalCase (`Button`, `RiskIndicator`)
- **Files**: Match component name (`Button.tsx`, `RiskIndicator.tsx`)
- **Functions/Variables**: camelCase (`calculateScore`, `userData`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRIES`, `API_ENDPOINT`)
- **Types/Interfaces**: PascalCase with `T` prefix or suffix (`TUser`, `AssessmentResult`)
- **Database Tables**: snake_case (`user_profiles`, `compliance_assessments`)

### Import Order

Group imports in the following order:

1. React/Next.js imports
2. External library imports
3. Internal absolute imports (`@/` alias)
4. Relative imports (`../`, `./`)
5. Type imports (`import type { ... }`)
6. CSS/Tailwind imports

Example:
```typescript
import { useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { calculateScore } from '@/lib/assessment-utils';
import type { TAssessment } from '@/types/assessment';
import '@/styles/globals.css';
```

### File Structure

- **One component per file** (except tightly coupled subcomponents)
- **Index files** for clean exports (`index.ts` that re-exports from named files)
- **Type definitions** in separate `.ts` files within `src/types/` or colocated with components
- **Test files** colocated with source files (`Component.test.tsx`) or in `__tests__/` directories

## 2. Directory Structure

```
src/
├── app/                          # Next.js App Router
│   ├── (marketing)/              # Public pages
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── pricing/
│   │       └── page.tsx
│   ├── (auth)/                   # Authentication routes
│   │   ├── layout.tsx
│   │   ├── login/
│   │   │   └── page.tsx
│   │   ├── signup/
│   │   │   └── page.tsx
│   │   └── callback/
│   │       └── route.ts
│   ├── (dashboard)/              # Protected dashboard routes
│   │   ├── layout.tsx
│   │   ├── dashboard/
│   │   │   └── page.tsx
│   │   ├── regulations/
│   │   │   └── page.tsx
│   │   └── assessments/
│   │       └── page.tsx
│   ├── api/                      # API route handlers
│   │   └── onboarding/
│   │       └── route.ts
│   └── onboarding/               # Onboarding flow
│       └── page.tsx
├── components/                   # React components
│   ├── ui/                       # Reusable UI primitives
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Badge.tsx
│   ├── onboarding/               # Wizard components
│   ├── dashboard/                # Dashboard components
│   └── assessment/               # Assessment components
├── lib/                          # Utilities and shared logic
│   ├── supabase/                 # Supabase clients
│   │   ├── browser.ts
│   │   ├── server.ts
│   │   └── proxy.ts
│   ├── ai/                       # AI integration
│   │   ├── client.ts
│   │   ├── classifier.ts
│   │   ├── assessor.ts
│   │   └── prompts/              # Prompt templates
│   │       ├── index.ts
│   │       ├── gdpr.ts
│   │       ├── bogfoeringsloven.ts
│   │       └── nis2.ts
│   ├── regulations/              # Regulation metadata
│   │   └── matching.ts
│   └── utils.ts                  # General utilities
└── types/                        # TypeScript type definitions
    └── index.ts
```

## 3. Testing Approach

### Test Suite Structure

- **Unit Tests**: Test individual functions, components, and utilities
- **Integration Tests**: Test interactions between modules and API routes
- **E2E Tests**: Test critical user flows end-to-end

### Testing Tools

- **Vitest**: Unit and integration testing framework
- **React Testing Library**: Component testing
- **Playwright**: E2E testing
- **MSW**: Mock API requests

### Test File Organization

- Colocate test files with source files (`Component.test.tsx`)
- Use `__tests__` directories for test utilities and shared fixtures
- Separate test suites by type: `*.unit.test.ts`, `*.integration.test.ts`, `*.e2e.test.ts`

### Testing Guidelines

- **Test Behavior, Not Implementation**: Focus on what the component/function does, not how it does it
- **Mock External Dependencies**: Mock Supabase, AI APIs, and other external services
- **Use Realistic Data**: Use fixtures that resemble production data
- **Cover Edge Cases**: Test error states, empty data, and boundary conditions

### Running Tests

```bash
pnpm test              # Run unit and integration tests
pnpm test:coverage     # Run tests with coverage report
pnpm test:e2e          # Run E2E tests
pnpm test:watch        # Run tests in watch mode
```

## 4. Mission Control Integration

### Task Tracking

- This project is tracked in Mission Control as project "AI Compliance" (id: 2, prefix: CPLY)
- MC MCP server is configured in `.claude/settings.json`
- Use MC MCP tools to update task status when starting/completing work:
  - When starting a task: update status to `in_progress`
  - When done: update status to `review` (Toby will quality-review)

### Environment Quirks (OpenClaw / Mission Control shell)

Claude Code sessions on this workstation inherit a parent shell that Mission Control has polluted with Next.js runtime vars. This silently breaks every `next` command unless they are scrubbed. The `dev`/`build`/`typegen` scripts wrap `next` with an `env -u …` prefix that unsets:

- `__NEXT_PRIVATE_STANDALONE_CONFIG` — a serialized MC `next.config` that *overrides every config file in sight*, including `outputFileTracingRoot` and `turbopack.root`, pointing them at `mission-control/`. Symptom: `Invalid distDirRoot: \".next\". distDirRoot should not navigate out of the projectPath.`
- `__NEXT_PROCESSED_ENV` — internal flag that tells Next "env files already loaded, skip them." Leaves the banner `- Environments: .env.local` printed but `process.env.NEXT_PUBLIC_*` empty. Symptom: Supabase client throws "URL and Key are required" even though `.env.local` is sitting right there.
- `TURBOPACK=1`, `__NEXT_PRIVATE_ORIGIN`, `NEXT_DEPLOYMENT_ID`, `NODE_ENV` — miscellaneous bleed-through that causes bundler-flag conflicts and "non-standard NODE_ENV" warnings.

If you are scripting around `next` by hand (e.g. for codemods), use `env -u __NEXT_PRIVATE_STANDALONE_CONFIG -u __NEXT_PRIVATE_ORIGIN -u __NEXT_PROCESSED_ENV -u TURBOPACK -u NEXT_DEPLOYMENT_ID -u NODE_ENV next …` to stay consistent.

## 5. Development Workflow

### Package Manager

- **pnpm only** — do not use npm or yarn
- Lockfile is committed (`pnpm-lock.yaml`)

### Icons

- No icon libraries — use text/emoji for now
- Consider `lucide-react` if icon needs arise

### Database Operations

- Use Supabase MCP `apply_migration` for schema changes, never raw SQL files
- Always create migrations for schema changes
- Test migrations locally before applying to production

### Authentication

- Supabase Auth with `@supabase/ssr` — magic links, no passwords
- Server-side session validation for protected routes

### AI Integration

- **Haiku** (`claude-haiku-4-5-20251001`) for classification (fast, cheap)
- **Sonnet** (`claude-sonnet-4-6`) for detailed assessments
- Temperature = 0 for all assessments
- Use `tool_use` for structured output — never parse free-form text
- All AI calls server-side in Route Handlers — never expose API key to client

### Commit Conventions

- No AI attribution: No `Co-Authored-By` trailers on commits
- Use conventional commit messages:
  - `feat(scope): description` for new features
  - `fix(scope): description` for bug fixes
  - `docs(scope): description` for documentation
  - `chore(scope): description` for maintenance

## 6. Key Regulation Areas

1. GDPR (data protection) — Datatilsynet
2. Bogforingsloven (digital bookkeeping) — Erhvervsstyrelsen
3. ePrivacy/Cookies — overlaps GDPR
4. NIS2 (cybersecurity) — personal liability for founders
5. EU AI Act — enforceable Aug 2026

---

*Last updated: April 2026*