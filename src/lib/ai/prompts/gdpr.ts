/**
 * GDPR & Databeskyttelsesloven prompt context
 *
 * Covers both the EU GDPR (2016/679) and the Danish Data Protection Act
 * (Databeskyttelsesloven, lov nr. 502 af 23/05/2018) which supplements it.
 */

export const gdprPrompt = `
## Regulation Context: GDPR & Databeskyttelsesloven

### GDPR (EU 2016/679)
The General Data Protection Regulation is directly applicable in Denmark since 25 May 2018. It governs the processing of personal data of individuals in the EU/EEA.

**Key obligations for Danish SMBs:**
- Lawful basis for processing (Art. 6) — consent, contract, legitimate interest, legal obligation, vital interest, public task
- Data subject rights (Arts. 15-22) — access, rectification, erasure ("right to be forgotten"), portability, restriction, objection
- Privacy by design and by default (Art. 25)
- Records of processing activities (Art. 30) — mandatory for companies with 250+ employees OR if processing is not occasional, includes special categories, or poses risk
- Data Protection Impact Assessments (Art. 35) — required for high-risk processing
- Data breach notification — 72 hours to Datatilsynet (Art. 33), without undue delay to data subjects if high risk (Art. 34)
- Data processor agreements (Art. 28) — written contracts with all processors
- International transfers — adequacy decisions, SCCs, or other safeguards (Arts. 44-49)
- DPO appointment — required for public authorities, large-scale monitoring, or special category processing at scale (Art. 37)

**Penalties:**
- Up to €20M or 4% of global annual turnover (whichever is higher)
- Datatilsynet has issued fines ranging from DKK 50,000 to DKK 1.2M+ for Danish companies
- Notable DK cases: IDdesign (DKK 1.5M), Aarstiderne (DKK 100K for missing processor agreement)
- Criminal penalties possible under Databeskyttelsesloven §41

### Databeskyttelsesloven (Danish Data Protection Act)
Denmark's national supplement to GDPR, covering areas where GDPR allows member state derogation.

**Danish-specific additions:**
- **CPR numbers (§11):** Processing of CPR (civil registration) numbers only allowed with consent, legal authorization, or for important public/private interests. Must not be disclosed publicly.
- **Children's consent (§12):** Age of digital consent is 13 in Denmark (GDPR default is 16, DK chose lower).
- **Employment context (§12):** Specific rules for employee data, references, and HR processing.
- **Criminal records (§8):** Only processed by public authorities, or with individual's consent/vital interest.
- **Special categories — health data:** Healthcare sector has additional provisions.
- **National security exemptions (§§22-23):** Certain processing for national security/defense may be exempt.
- **Datatilsynet powers (§§25-32):** The Danish DPA has inspection, advisory, and enforcement powers.
- **Criminal sanctions (§41):** Intentional or grossly negligent violations can lead to fines or imprisonment.

### Enforcement — Datatilsynet
- Denmark's supervisory authority: datatilsynet.dk
- Known for pragmatic enforcement — will often issue guidance/warnings before fines
- Published detailed guidance on consent, cookies, employee monitoring, CCTV, cloud services
- Active in Schrems II follow-up — scrutinizes EU→US transfers, requires Transfer Impact Assessments
- Annual inspection program targets different sectors each year

### Practical SMB Guidance
- **Start with Article 30 records** — even if not strictly required, maintaining processing records demonstrates accountability
- **Cookie consent** — see ePrivacy; Datatilsynet actively enforces cookie rules
- **Employee data** — document basis for processing employee CPR numbers, health data, etc.
- **Subprocessors** — SaaS tools (Mailchimp, HubSpot, Google Workspace) all need processor agreements and transfer safeguards
- **Privacy policy** — must be clear, in Danish (for DK data subjects), and cover all Art. 13/14 requirements
- **Breach readiness** — have a breach response plan; 72-hour deadline is strict
`;
