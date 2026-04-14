# EUComply — Product Roadmap (Reprioritized)

> **Based on:** Market research synthesis, April 2026  
> **PMF Score:** 6.5/10 — viable, not a slam dunk. Winning requires multi-regulation coverage + Danish context. Speed matters.

---

## Market Reality Check

| Signal | Implication |
|---|---|
| ~500K Danish SMBs total, but only **5,000–15,000** face multi-regulation simultaneously | TAM is narrow; must price for value, not volume |
| Compliance is **fear-driven**, not growth-driven | UI must lead with risk exposure and fine amounts, not "improve your score" |
| **Cookiebot** (Danish) dominates cookie/GDPR consent alone | Don't compete on single-regulation; compete on *multi-regulation orchestration* |
| GDPR fines: **15–20 issued 2018–2024** in Denmark | Fear works even at low enforcement rates; emphasize the *unpredictability*, not frequency |
| NIS2 transposed Oct 2024; **enforcement 2025–2026** | NIS2 is the next buying trigger — critical sectors now, SMB suppliers next |
| AI Act phased **2025–2030**; most SMBs not yet affected | Introduce AI Act awareness now, full assessment later |
| Bogføringsloven: market **saturated** (e-conomic, Dinero) | Deprioritize — not a differentiated wedge |
| Price ceiling: **499–999 DKK/month** | Must be cheaper than a consultant's hourly rate (800–1,500 DKK/hr) |

---

## Strategic Positioning

**The moat:** Multi-regulation coverage + AI automation + Danish legal context, in one product.  
**The entry point:** GDPR (broadest fear, most enforcement history).  
**The expansion:** NIS2 → AI Act (fear timeline follows regulatory enforcement curve).  
**The wedge:** A public compliance risk calculator that converts website visitors before they even sign up.

---

## Priority Tiers

### TIER 1 — HIGHEST VALUE (Build now)

#### 1.1 Multi-Regulation Coverage — NIS2 Assessment
The competitive moat. No competitor does multi-regulation at SMB price points.

**Why NIS2 next:** October 2024 transposition is done. Enforcement starts 2025–2026 for critical sectors (energy, water, health, digital infrastructure). Their suppliers — many of them Danish SMBs — will face contractual compliance requirements within 12 months.

**What to build:**
- NIS2 checklist items in the DB (`NIS2-01` through `NIS2-10` codes, seeded via migration)
- `regulations` row for NIS2 (`slug: 'nis2'`, `risk_level: 'high'`, `enforcement_date: 2026-01-01`)
- Wire NIS2 into `ASSESSMENT_TYPE_MAP` in `assessments/new/page.tsx`:
  ```ts
  nis2_risk: { slug: 'nis2', label: 'NIS2 Risk Assessment' }
  ```
- NIS2-specific AI assessor prompt in `src/lib/ai/assessor.ts` (sector-aware: essential vs. important entities)
- `regulations/nis2/page.tsx` checklist page (same structure as GDPR checklist)
- Onboarding classifier: detect if company is in a critical sector → auto-enable NIS2

**Acceptance criteria:** A user in a critical sector completes onboarding, gets NIS2 assessment, sees a risk score and gap list.

---

#### 1.2 Onboarding Quiz — "Which regulations apply to you?"
The highest-conversion feature we don't have. Users arrive not knowing which regulations they face.

**What to build:**
- Multi-step onboarding quiz (replace or extend current onboarding):
  - Step 1: Industry sector (dropdown: healthcare, finance, manufacturing, retail, tech, other)
  - Step 2: Employee count (1–10, 11–50, 51–250)
  - Step 3: Do you process personal data of EU residents? (yes/no)
  - Step 4: Do you rely on IT/network systems for your core service? (yes/no)
  - Step 5: Do you use AI tools in customer-facing decisions? (yes/no)
- Result screen: "Based on your answers, you face these regulations:"
  - Each regulation shown with **estimated fine exposure** (e.g., "GDPR: up to 20M EUR or 4% of turnover")
  - CTA: "Start your free assessment" → routes to `assessments/new?type=gdpr_risk`
- DB: write quiz answers to `companies.onboarding_metadata` (JSONB)
- Use quiz answers to pre-populate `company_regulations` with applicable regulations on completion

**Acceptance criteria:** A new user completing the quiz sees their specific regulation list and fine exposure figures. The dashboard immediately shows the right checklist items.

---

#### 1.3 Public Compliance Risk Calculator (Lead Magnet)
Converts anonymous website visitors before sign-up. Drives qualified inbound from fear.

**What to build:**
- `/calculator` marketing page (in `src/app/(marketing)/`)
- Same 5-question quiz as onboarding (no auth required)
- Output: "Your estimated compliance risk" — shows:
  - Which regulations apply
  - Fine exposure range in DKK (not EUR — convert at current rate, display both)
  - 3 most common gaps for companies like theirs
- CTA: "Get your full assessment — free for 14 days" → sign-up flow
- No data saved (anonymous); purely client-side logic

**Acceptance criteria:** Anonymous user completes calculator on marketing site, sees personalized risk output, and can click through to sign up.

---

### TIER 2 — HIGH VALUE (Build after Tier 1)

#### 2.1 AI Act Assessment (Awareness Tier)
AI Act is phased 2025–2030. Most SMBs aren't affected yet, but they're anxious about it.

**What to build:**
- A lightweight "AI Act readiness check" (10–15 questions, not a full assessment)
- Output: risk classification (minimal risk / limited risk / high risk) with explanation
- High-risk systems (biometric, credit scoring, hiring) get a detailed gap list
- `regulations` row: `slug: 'ai-act'`, `enforcement_date: 2027-08-02` (high-risk system deadline)
- Wire into `ASSESSMENT_TYPE_MAP`: `aiact_risk: { slug: 'ai-act', label: 'EU AI Act Readiness Check' }`
- Don't build full checklist yet — most SMBs won't need it. A readiness score and 3 actionable steps is enough.

**Acceptance criteria:** User completes AI Act readiness check, gets a risk tier classification and 3 priority actions.

---

#### 2.2 Compliance Deadline Tracking & Alerts
Fear-based engagement: users re-engage when reminded of approaching enforcement dates.

**What to build:**
- Extend the existing deadline banner (already on dashboard) with:
  - Per-regulation countdown to enforcement date
  - Email digest: weekly summary of compliance score + days to deadline
  - In-app notifications for `days_remaining < 90` and `< 30`
- `compliance_deadlines` table or extend `regulations.enforcement_date`
- Email: use Resend or similar; triggered by a cron job checking deadlines weekly
- Settings: user can opt out of email notifications

**Acceptance criteria:** User with NIS2 applicable gets an email 90 days before enforcement date with their current NIS2 score and a link back to the dashboard.

---

#### 2.3 Make GDPR the Extensible Foundation
GDPR is the entry point but the architecture must support all regulations cleanly.

**Technical debt to address:**
- Assessment report page (`assessments/[id]/page.tsx`): currently has "Data Processing Inventory" section title and table headers that are GDPR-specific — generalize to "Compliance Inventory"
- `inferCategory()` is now generalized (done in this commit) — but the table description still says "Article 30 record categories" (GDPR-specific). Parameterize from regulation metadata.
- `page/@top-right` print header: now says "Compliance Risk Report" (fixed in this commit) — ✓
- Add `regulation_display_name` and `regulation_category_description` fields to `regulations` table so the UI can pull these dynamically rather than hardcoding them

**Acceptance criteria:** An NIS2 assessment report renders with correct section labels, no GDPR-specific text visible.

---

### TIER 3 — MEDIUM VALUE (Next quarter)

#### 3.1 Regulation-Agnostic Checklist Progress
The checklist UX (`/regulations/[slug]`) is currently tuned for GDPR. Make it work for any regulation.

- Dynamic page title from `regulations.name`
- Progress bar per-regulation
- "Start assessment" CTA that routes to the correct assessment type

#### 3.2 Assessment History & Comparison
Show users their compliance trend over time (periodic vs initial assessments).

- `assessments` list page: show all past assessments per regulation, sorted by date
- Score delta: "+12 points since last assessment"
- Use `is_latest` flag (now correctly set — fixed in this commit) to highlight the current state

#### 3.3 Simple Document Generation
Top user request for compliance software: generate a PDF that can be shown to auditors/partners.

- "Export compliance report" — already partially built via the print CSS in assessment report
- Add a "Compliance Certificate" one-pager (not legally binding, but useful for supplier questionnaires)

---

### TIER 4 — LOW / DEFER

#### 4.1 Bogføringsloven — DEPRIORITIZE
**Why:** e-conomic and Dinero have this market locked. They're integrated into accounting workflows we can't match. Danish SMBs already pay for one of these tools.

**Decision:** Keep the existing Bogføringsloven readiness checker as-is (it's already built). Don't invest further. Remove from primary navigation — move to a secondary "Other Regulations" section.

---

#### 4.2 Stripe / Billing — DEFER
**Why:** No point until the product covers multiple regulations credibly. A single-regulation product at 499 DKK/mo is a hard sell. At 3 regulations + risk calculator, the value is clear.

**When to build:** After NIS2 assessment is live and at least 20 paying users have completed multi-regulation assessments.

**What to build when ready:**
- Stripe Checkout for `499 DKK/mo` (Starter: GDPR only) and `999 DKK/mo` (Pro: all regulations)
- Trial: 14-day free, no credit card required
- Paywall: lock assessment runs behind subscription; checklist browsing remains free

---

#### 4.3 ePRivacy / Cookie Compliance — DEFER
Cookiebot owns this space. Don't build a cookie banner tool. If we ever add ePrivacy, it should be a thin integration with Cookiebot's API, not a replacement.

---

## Immediate Technical Fixes (Completed in this commit)

| # | File | Fix |
|---|---|---|
| 1 | `src/lib/ai/assess.ts` | UPDATE `is_latest=false` before INSERT — prevents stale "latest" rows when re-assessing |
| 2 | `src/app/(dashboard)/dashboard/page.tsx:328` | Fixed dead link `href="/regulations"` → `href="/regulations/${reg.slug}"` |
| 3 | `src/app/error.tsx` (new) | Global error boundary with retry button |
| 4 | `src/app/not-found.tsx` (new) | Global 404 page |
| 5 | `src/app/(dashboard)/assessments/[id]/page.tsx` | Generalized `inferCategory()` — now supports GDPR, NIS2, AI Act; hardcoded GDPR links replaced with dynamic regulation slug |
| 6 | `src/app/(dashboard)/assessments/new/page.tsx` | Removed "GDPR" from loading step copy |

---

## Success Metrics

| Metric | Target (3 months) |
|---|---|
| Regulations covered | 3 (GDPR, NIS2, AI Act readiness) |
| Paying customers | 25+ |
| Calculator → sign-up conversion | >15% |
| Assessment completion rate | >70% of started assessments |
| MRR | 15,000–25,000 DKK |

---

## What We Are NOT Building

- A cookie consent manager (Cookiebot wins)
- A bookkeeping compliance tool (e-conomic/Dinero win)
- A legal document drafting tool (consultants win — not our market)
- A real-time compliance monitoring agent (too complex, too expensive at SMB price point)
- Anything requiring a certified DPO to be behind the product (adds liability we don't want)
