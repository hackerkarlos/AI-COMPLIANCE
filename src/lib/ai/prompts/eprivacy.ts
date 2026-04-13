/**
 * ePrivacy Directive / Cookie Order prompt context
 *
 * EU ePrivacy Directive 2002/58/EC (amended by 2009/136/EC — "Cookie Directive")
 * Danish Cookie Order: Bekendtgørelse nr. 1148 af 09/12/2011 om krav til
 * information og samtykke ved lagring af eller adgang til oplysninger i
 * slutbrugeres terminaludstyr (supplemented by Datatilsynet guidance).
 */

export const eprivacyPrompt = `
## Regulation Context: ePrivacy Directive & Danish Cookie Rules

### Overview
The ePrivacy Directive 2002/58/EC governs electronic communications privacy, including cookies, email marketing, and direct marketing. In Denmark, it is implemented via the Cookie Order (Cookiebekendtgørelsen) enforced by Datatilsynet. The long-awaited ePrivacy Regulation at EU level remains in progress; until enacted, the 2002 Directive applies.

### Cookie Consent (Article 5(3) of Directive)

**The rule:** Storing or accessing information on a user's device (cookies, local storage, device fingerprinting) requires:
1. **Clear and comprehensive information** about the purpose
2. **Freely given, specific, informed, and unambiguous consent** — prior to storing

**Exceptions — no consent required for:**
- Strictly necessary cookies (session management, shopping cart, authentication, load balancing)
- Technical communication transmission over networks
- First-party analytics may qualify as strictly necessary in limited circumstances per Datatilsynet guidance, but this is contested

**Consent requirements (aligned with GDPR):**
- Must be as easy to withdraw as to give
- Pre-ticked boxes are invalid
- Scrolling or continuing to browse does NOT constitute consent
- Cookie wall (conditional access) is not permitted by Datatilsynet
- Granular consent required per category (functional, analytics, marketing)
- Consent records must be maintained (controller burden)

**Consent Management Platform (CMP):**
- Must clearly distinguish categories: necessary / functional / analytics / marketing
- "Accept all" and "Reject all" buttons must be equally prominent
- Must not use dark patterns (pre-selections, confusing language, asymmetric buttons)
- Datatilsynet has published a cookie checklist (cookie-erklæringen.dk)

### Email Marketing (Article 13)

**Opt-in required (B2C):** Prior explicit consent before sending marketing emails to individuals. Cannot use pre-ticked boxes.

**Soft opt-in (B2B exception):**
- Allowed if: (1) customer relationship exists, (2) email collected in context of a sale, (3) marketing is for own similar products/services, (4) clear opt-out offered in every message
- Still requires easy opt-out mechanism

**B2B (business emails):** Targeting business roles at a company is generally allowed with a legitimate interest basis, but the individual at that address still has opt-out rights.

**SMS / text marketing:** Same rules as email — opt-in required for B2C.

### Telephone Marketing (Article 13)

- Cold calls to individuals: DK maintains a "Robinson Register" (www.cpr.dk) — must not call individuals registered there
- Cold calls to businesses: Generally permitted with legitimate interest, but must stop if requested
- Automated calling systems: Consent required

### Tracking and Profiling

- Cross-site tracking requires consent
- Device fingerprinting requires consent even if no cookie is set
- Third-party marketing pixels (Meta Pixel, Google Analytics with full IP) require consent before loading
- Retargeting ads require cookie consent AND may require GDPR lawful basis for profiling

### Penalties (Danish enforcement)

- Datatilsynet issues guidance, orders, and fines
- Notable DK cookie enforcement: Datatilsynet conducted cookie sweeps in 2021-2023 targeting Danish websites
- Ordered companies to remove cookie walls, fix consent mechanisms
- Fines: up to DKK 1,500,000 per violation under Danish law
- Datatilsynet refers serious cases to police for prosecution

### Danish Enforcement Practice

- **Datatilsynet cookie team** actively sweeps Danish websites annually
- **Cookie-erklæringen.dk** is the official guidance tool — using it demonstrates compliance effort
- **Implicit consent** (e.g. banner that says "By continuing you accept cookies") is invalid per DK enforcement
- **Google Analytics:** Datatilsynet has issued guidance that standard GA requires consent and that data transfers to US require adequate safeguards (SCCs + TIA)
- **Common violations found:** pre-ticked boxes, asymmetric accept/reject buttons, cookies loading before consent, no cookie declaration

### Practical SMB Guidance

- **Audit all cookies** before building the banner — document every cookie's name, purpose, duration, provider
- **Implement proper CMP** — simple JavaScript popups are not enough; use a documented consent management platform
- **Test before deploying** — verify no tracking cookies fire before consent
- **Update cookie declaration** at least annually or when adding new tools
- **Email lists:** audit existing lists for consent proof; unsegmented lists may need re-consent
- **Newsletter sign-up:** double opt-in is recommended for GDPR + ePrivacy compliance
- **Marketing attribution:** server-side tagging can reduce cookie dependency but does not remove consent requirement
`;
