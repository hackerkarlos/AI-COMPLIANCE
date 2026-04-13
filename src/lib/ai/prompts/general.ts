/**
 * General fallback prompt context
 *
 * Used for regulations without a dedicated prompt file:
 * Hvidvaskloven (AML), Whistleblower Act, PSD2, DORA
 *
 * Provides role-specific context for each regulation based on slug matching
 * at runtime (via the assessor system prompt).
 */

export const generalPrompt = `
## Regulation Context: Danish/EU Financial & Compliance Regulations

This assessment covers one of the following Danish or EU regulations. Apply the context below that is relevant to the regulation being assessed.

---

### Hvidvaskloven — Anti-Money Laundering Act (AML)

**Legal basis:** Lov om forebyggende foranstaltninger mod hvidvask og finansiering af terrorisme (Hvidvaskloven). Implements EU AMLD5 (2018/843).

**Who is affected (obliged entities):**
- Banks and credit institutions
- Payment institutions and e-money issuers
- Investment firms and fund managers
- Insurance companies
- Accountants (including freelance/SMB auditors)
- Lawyers and notaries (for specific transactions)
- Estate agents
- Dealers in high-value goods (transactions ≥ DKK 50,000 in cash)
- Crypto asset service providers
- Tax advisors and bookkeepers

**Key obligations:**
- **Customer Due Diligence (CDD):** Know Your Customer (KYC) procedures for all customers; Enhanced Due Diligence for high-risk customers (PEPs, high-risk countries)
- **Risk assessment:** Written risk assessment of business, products, customers, and geographies
- **Policies and procedures:** Internal AML/CFT policies, procedures, and controls
- **Transaction monitoring:** Identify suspicious patterns; file Suspicious Activity Reports (SARs) to Hvidvasksekretariatet (SØIK/National Special Crime Unit)
- **Record-keeping:** Retain customer and transaction records for 5 years after relationship ends
- **Training:** Annual AML training for all relevant staff
- **Responsible AML officer:** Appoint a compliance officer

**Enforcement — Finanstilsynet:**
- Conducts supervisory inspections of obliged entities
- Can issue orders, public warnings, and revoke licences
- Criminal sanctions: fines up to DKK 20M or 4× the gain; personal liability for directors

**Penalties:**
- Fines up to DKK 20,000,000 for legal entities
- Personal criminal liability for directors who fail to prevent violations
- Loss of business licence

---

### Whistleblower Act (DK implementation of EU 2019/1937)

**Legal basis:** Lov om beskyttelse af whistleblowere (lov nr. 1436 af 29/06/2021).

**Who is required to have an internal whistleblower scheme:**
- Private employers with **50 or more employees** (threshold based on average over 12 months)
- Public bodies (all, regardless of size)
- Note: companies with 50-249 employees may share a scheme with other companies

**Key obligations:**
- **Internal reporting channel:** Secure, confidential channel for reporting violations of EU or Danish law (employment conditions, financial crime, environmental breaches, etc.)
- **Confidentiality:** Identity of reporter and third parties must be protected; scheme must be independent from management
- **Acknowledgement:** Confirm receipt within 7 days
- **Feedback:** Inform reporter of actions taken within 3 months
- **Anti-retaliation:** Prohibited to dismiss, demote, or retaliate against whistleblowers
- **Designated responsible person/function:** Must have a named person or function managing reports
- **Written procedures:** Document how the scheme works

**Scope of reportable matters:**
- Violations of EU law (extensive list in the Directive annex — financial services, food safety, transport safety, environment, public health, privacy, anti-money laundering)
- Violations of Danish law in serious matters
- Does NOT cover purely personal grievances (salary disputes, interpersonal conflicts) — though many companies extend scope voluntarily

**Enforcement — Datatilsynet and Employment courts:**
- Datatilsynet oversees GDPR aspects of the scheme (personal data in reports)
- Employment tribunals handle retaliation claims
- Non-establishment of required scheme: fines

**Penalties:**
- Failure to establish scheme: fines up to DKK 300,000 per violation
- Retaliation against whistleblower: compensation claims by the individual (no cap)

---

### PSD2 — Payment Services Directive 2 (EU 2015/2366)

**Legal basis:** EU Directive 2015/2366, transposed in Denmark via Lov om betalinger (Betalingsloven, lov nr. 652 af 08/06/2017) and Finanstilsynet regulations.

**Who is affected:**
- Banks providing payment accounts
- Payment institutions (PI) — licensed payment processing
- Electronic money institutions (EMI)
- Account information service providers (AISP)
- Payment initiation service providers (PISP)
- Companies acting as "payment service agents"
- NOTE: merchants accepting card payments are NOT directly regulated by PSD2; card acquirers and processors are

**Key obligations for payment service providers:**
- **Licensing:** Must be licensed by Finanstilsynet as PI or EMI (or be exempt)
- **Strong Customer Authentication (SCA):** Required for electronic payments (3DS2, hardware tokens); exceptions for low-value, trusted payees, corporate transactions
- **Open Banking:** Must provide API access to licensed AISPs/PISPs on consent of account holders
- **Incident reporting:** Major security or operational incidents to Finanstilsynet within 4 hours of awareness
- **Fraud reporting:** Quarterly statistical reporting on fraud
- **Transparency:** Clear fee disclosure; execution time commitments; receipt requirements
- **Safeguarding:** Client funds held separately from own funds; protected from insolvency

**Enforcement — Finanstilsynet:**
- Licensing authority — operating without licence is criminal
- Ongoing supervision of licensed entities
- SCA enforcement — non-compliant checkout flows must be remediated

**Penalties:**
- Operating without licence: criminal prosecution
- Regulatory breaches: orders, fines, licence revocation
- SCA non-compliance: liability shifts to merchant/acquirer for fraudulent transactions

---

### DORA — Digital Operational Resilience Act (EU 2022/2554)

**Legal basis:** Regulation (EU) 2022/2554. Directly applicable. In force from 17 January 2025.

**Who is affected (financial entities):**
- Credit institutions (banks)
- Payment institutions and e-money institutions
- Investment firms
- Insurance/reinsurance undertakings
- Insurance intermediaries
- Asset managers (UCITS, AIFs)
- Central counterparties, trading venues
- Credit rating agencies
- ICT third-party service providers (critical ICT providers — cloud, software, data analytics used by financial entities)

**Key obligations:**
- **ICT risk management:** Comprehensive framework for managing ICT risks; board-level accountability; annual review
- **Incident reporting:** Classify, document, and report major ICT-related incidents:
  - Initial report: within 4 hours of classification (and within 24h of awareness)
  - Intermediate report: within 72 hours
  - Final report: within 1 month
- **Digital operational resilience testing:**
  - Basic testing annually (vulnerability assessment, penetration testing)
  - Threat-Led Penetration Testing (TLPT) every 3 years for significant entities
- **Third-party risk management (ICT TPRM):**
  - Due diligence on all ICT providers
  - Contractual requirements (SLA, audit rights, incident cooperation, exit strategy)
  - Concentration risk monitoring — avoid single vendor dependency
  - Register of ICT third-party arrangements
- **Information sharing:** Participate in threat intelligence sharing arrangements

**Enforcement — Finanstilsynet:**
- Finanstilsynet is the primary competent authority for Danish financial entities
- DORA replaces some NIS2 obligations for in-scope financial entities
- Cross-sector authority coordination with CFCS

**Penalties:**
- Financial entities: up to 2% of average daily worldwide turnover in preceding year
- Critical third-party ICT providers: up to €5M or 1% of average daily worldwide turnover
- Individual accountability: temporary bans on management functions

**Practical Danish SMB note:**
- Smaller financial entities (e.g. small payment institutions, insurance intermediaries) have proportionate requirements
- Finanstilsynet has published sector-specific guidance for proportionate implementation
- Cloud contracts with AWS, Azure, Google must now include DORA-mandated provisions

---

### General Compliance Principles for All Regulations Above

When assessing, apply these cross-cutting principles:

1. **Proportionality:** Requirements scale with entity size, complexity, and risk profile
2. **Documentation first:** Written policies and records are the foundation of demonstrable compliance
3. **Governance:** Board/management accountability is a recurring theme — boards must approve and oversee compliance
4. **Third-party management:** Vendor due diligence and contracts are required across all these regulations
5. **Training:** Staff awareness and training is required for AML, Whistleblower, PSD2, and DORA
6. **Incident response:** All regulations require timely detection and reporting of incidents/breaches
`;
