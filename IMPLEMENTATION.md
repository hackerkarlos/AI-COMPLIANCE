# EUComply Implementation

## Database Schema (Supabase — applied via MCP migrations)

### Tables

| Table | Purpose | RLS |
|-------|---------|-----|
| `companies` | Company profiles with applicability flags for regulation matching | Owner only (`auth.uid() = user_id`) |
| `regulations` | 10 EU/DK regulations with `applicability_criteria` JSONB | Public read |
| `checklist_items` | 135 actionable compliance items across all regulations | Public read |
| `company_regulations` | Junction: which regulations apply to a company + compliance status | Owner only (via company) |
| `company_checklist` | Junction: per-item progress tracking with notes and evidence | Owner only (via company) |
| `assessments` | Periodic assessment snapshots with AI analysis | Owner only (via company) |

### Seeded Regulations (10)

| # | Slug | Name | Type | Items |
|---|------|------|------|-------|
| 1 | `gdpr` | GDPR | EU Regulation | 20 |
| 2 | `databeskyttelsesloven` | Databeskyttelsesloven | DK Law | 15 |
| 3 | `eprivacy` | ePrivacy / Cookies | EU Directive | 15 |
| 4 | `nis2` | NIS2 | EU Directive | 15 |
| 5 | `ai_act` | EU AI Act | EU Regulation | 15 |
| 6 | `bogfoeringsloven` | Bogføringsloven | DK Law | 15 |
| 7 | `hvidvaskloven` | Hvidvaskloven (AML) | DK Law | 10 |
| 8 | `whistleblower` | Whistleblower Act | DK Law | 10 |
| 9 | `psd2` | PSD2 | EU Directive | 10 |
| 10 | `dora` | DORA | EU Regulation | 10 |

### Applicability Criteria (JSONB)

Each regulation has machine-readable criteria for auto-matching to companies:

```jsonc
{
  "default_applicable": true,      // applies to all unless excluded
  "sectors": [],                   // empty = all sectors
  "min_employees": 50,             // e.g. Whistleblower Act
  "requires_personal_data_processing": true,
  "requires_digital_services": false,
  "requires_payment_processing": false,
  "requires_financial_services": false,
  "requires_ai_systems": false,
  "requires_critical_infrastructure": false,
  "requires_employees": false,
  "description_en": "...",
  "description_da": "..."
}
```

Company flags (`processes_personal_data`, `uses_ai_systems`, `is_financial_entity`, etc.) are matched against these criteria during onboarding to auto-populate `company_regulations`.

### Key Design Decisions

1. **Multi-regulation architecture**: Junction tables (`company_regulations`, `company_checklist`) let companies track compliance per regulation independently.
2. **JSONB applicability criteria**: Machine-readable rules enable auto-detection of applicable regulations based on company profile flags.
3. **Reference vs. user data split**: `regulations` and `checklist_items` are public-read reference data; all company-scoped tables use RLS via `auth.uid()`.
4. **Checklist-first compliance**: Each regulation has concrete, actionable checklist items with priority, effort level, and guidance — not abstract requirements.

## Technical Architecture

### Stack
- **Next.js 16** with App Router, React 19, TypeScript 5 (strict)
- **Tailwind CSS 4**
- **Supabase** (PostgreSQL + Auth + RLS)
- **Claude API** (Haiku for classification, Sonnet for assessments)

### Directory Structure
```
src/
  app/
    (marketing)/        Public pages
    (auth)/             Login, signup, callback
    (dashboard)/        Protected routes
    api/                Route handlers
  lib/
    supabase/           Browser + server clients
    ai/                 Anthropic SDK, classifiers
    ai/prompts/         Prompt templates per regulation
  components/
    ui/                 Reusable primitives
    onboarding/         Wizard components
    dashboard/          Score cards, alerts
    assessment/         Report views
  types/
    assessment.ts       All DB + UI types
  hooks/
    useAssessment.ts    Assessment form state
```

### UI Component Library (`src/components/ui/`)

Built with Tailwind CSS 4 + class-variance-authority. All components use `cn()` from `@/lib/utils` for class merging.

| Component | Variants | Notes |
|-----------|----------|-------|
| `Button` | primary, secondary, ghost, destructive, outline, link × sm/md/lg/icon | CVA-based, forwardRef |
| `Card` | CardHeader, CardTitle, CardDescription, CardContent, CardFooter | Compound component |
| `Input` | — | Native `<input>` wrapper with design tokens |
| `Textarea` | — | Native `<textarea>` wrapper |
| `Select` | — | Native `<select>` wrapper |
| `Badge` | default, secondary, outline + risk levels (minimal/low/medium/high/critical) | Risk colors via `--color-risk-*` tokens |
| `Progress` | — | Accessible `progressbar` role, value/max props |
| `Sidebar` | SidebarHeader, SidebarContent, SidebarFooter, SidebarNavItem | Collapsible (w-64 → w-16) |
| `Wizard` | — | Multi-step shell with step indicator + back/next/complete navigation |

Barrel export: `import { Button, Card, Badge, ... } from '@/components/ui'`
