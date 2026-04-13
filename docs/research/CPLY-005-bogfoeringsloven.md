# CPLY-005: Danish Bogføringsloven (Bookkeeping Act) — Digital Requirements 2024-2026

**Research ID:** CPLY-005
**Status:** Complete
**Last Updated:** 2025-04-13
**Scope:** Digital bookkeeping obligations for Danish startups (1-50 employees), focusing on ApS/IVS entities
**Regulation:** Bogføringsloven (Lov nr. 700 af 24/05/2022) + Bekendtgørelse om digitale bogføringssystemer

---

## Executive Summary

Denmark's new Bookkeeping Act (Bogføringsloven), passed 19 May 2022 (effective 1 July 2022 with phased implementation), fundamentally changes how Danish companies handle bookkeeping. The law mandates that businesses use **approved digital bookkeeping systems** that can store records digitally and report data in the **SAF-T DK** standard format. Small startups (ApS/IVS) are directly impacted — the requirements apply based on company type and revenue thresholds, with enforcement rolling out in phases through 2026.

**Key takeaway for startups:** You must transition to an Erhvervsstyrelsen-approved digital bookkeeping system, store all records digitally, and be prepared for SAF-T DK reporting. The clock is ticking — deadlines are already in effect for some obligations.

---

## 1. SAF-T Format Requirements (SAF-T DK)

### What is SAF-T?
Standard Audit File for Tax — an OECD-developed XML-based data standard for exchanging accounting data between organizations and tax authorities. Denmark has adopted its own profile: **SAF-T DK**.

### Key Requirements
- **SAF-T DK** is the Danish adaptation of the OECD SAF-T standard (based on SAF-T 2.0)
- All approved digital bookkeeping systems must be capable of **exporting data in SAF-T DK format**
- The standard covers: General Ledger, Accounts Receivable, Accounts Payable, and (optionally) Inventory
- The Danish Business Authority (Erhvervsstyrelsen) defines the specific XML schema and field mappings
- SAF-T DK is intended primarily for **audit and tax authority data requests**, not continuous reporting (unlike e.g. Spain's SII)

### What Startups Must Know
- Your bookkeeping system **must** support SAF-T DK export — this is a requirement for system approval
- You do NOT need to submit SAF-T files regularly; the requirement is to be **able to produce them on demand** (e.g., during a tax audit by Skattestyrelsen)
- The SAF-T DK schema includes mandatory fields for: chart of accounts, journal entries, customer/supplier master data, tax codes
- Free mapping guidance is published by Erhvervsstyrelsen

### Sources
- Erhvervsstyrelsen SAF-T DK documentation: https://erhvervsstyrelsen.dk/bogfoering
- OECD SAF-T standard: https://www.oecd.org/tax/forum-on-tax-administration/publications-and-products/technologies/saf-t-implementation-guidance.htm
- BEK nr. 97 af 26/01/2024 (Bekendtgørelse om digitale bogføringssystemer)

---

## 2. Approved Digital Bookkeeping Systems (Erhvervsstyrelsen)

### Registration Requirement
Under the new law, providers of digital bookkeeping systems sold or offered to businesses in Denmark must **register their systems** with Erhvervsstyrelsen. The system must meet specific technical requirements to be approved.

### Approval Criteria for Systems
An approved system must:
1. **Support digital recording** of all transactions (no paper-only workflows)
2. **Store accounting records digitally** (bilag/vouchers) for the statutory retention period
3. **Export data in SAF-T DK format**
4. **Ensure data integrity** — prevent unauthorized alteration or deletion of records
5. **Support automated backup/storage** — either via cloud or compliant local storage
6. **Maintain an audit trail** — log changes to bookkeeping entries
7. **Meet IT security standards** as specified in the executive order (bekendtgørelse)

### Known Approved/Compliant Systems (as of early 2025)
Erhvervsstyrelsen maintains and publishes the official register. Major systems expected/confirmed to comply:
- **e-conomic (Visma)** — widely used by Danish SMEs
- **Dinero** — popular free/low-cost option for small companies
- **Billy** — Danish-focused SME accounting
- **Uniconta** — Danish ERP/accounting
- **SAP Business One** — for larger SMEs
- **Microsoft Dynamics 365 Business Central (Navision)** — enterprise/mid-market
- **Xena** — Danish cloud accounting
- **Zenegy** — payroll + bookkeeping

**Note:** The official register is published at: https://erhvervsstyrelsen.dk/registrerede-digitale-bogfoeringssystemer

### What Startups Must Do
- Verify your current system is on the Erhvervsstyrelsen register (or will be)
- If using spreadsheets (Excel) alone — this will **NOT** be compliant
- If using a foreign system (e.g., QuickBooks US, Wave), check if the provider has registered for Denmark
- System providers must self-register and declare compliance; Erhvervsstyrelsen can audit

### Sources
- Official register: https://erhvervsstyrelsen.dk/registrerede-digitale-bogfoeringssystemer
- System requirements: BEK nr. 97 af 26/01/2024

---

## 3. E-Invoice Standards (Peppol BIS / OIOUBL)

### Denmark's E-Invoicing Landscape
Denmark was an early adopter of e-invoicing. The existing standards and Peppol framework remain central:

- **OIOUBL** (Offentlig Information Online - Universal Business Language) — Denmark's national e-invoice standard, mandatory for B2G (business-to-government) invoicing since 2005
- **Peppol BIS Billing 3.0** — the EU/EEA-wide standard increasingly used for cross-border and B2B invoicing
- **NemHandel** — Denmark's national e-document exchange infrastructure (now integrated with Peppol)
- Denmark's NemHandel network is a **Peppol Access Point**, meaning Peppol-format invoices can be sent/received through existing Danish infrastructure

### Requirements for Startups
- **B2G invoicing**: If you invoice any public-sector client (kommune, region, state), you **must** use e-invoicing via NemHandel/OIOUBL or Peppol BIS
- **B2B invoicing**: Not yet mandatory by law, but Bogføringsloven's digital bookkeeping requirements strongly push digital invoicing. Many large Danish companies already require Peppol invoices from suppliers
- **EU ViDA (VAT in the Digital Age)**: Expected to mandate structured e-invoicing for intra-EU B2B transactions from 2028-2030, making early Peppol adoption strategic
- Your approved bookkeeping system should support sending/receiving e-invoices (most Danish systems support OIOUBL/Peppol natively)

### Practical Steps
- Register in **NemHandel** (via virk.dk) to receive/send e-invoices
- Ensure your bookkeeping system supports OIOUBL and/or Peppol BIS 3.0
- Use your **CVR number** (and EAN/GLN for public sector) as your e-invoicing identifier
- Consider a Peppol Access Point provider if your system doesn't have native Peppol support

### Sources
- NemHandel: https://nemhandel.dk/
- Peppol BIS 3.0: https://docs.peppol.eu/poacc/billing/3.0/
- Digitaliseringsstyrelsen e-invoicing: https://digst.dk/it-loesninger/nemhandel/
- EU ViDA proposal: https://ec.europa.eu/taxation_customs/vida_en

---

## 4. Record Retention Periods

### Statutory Retention Requirements (Bogføringsloven §12-13)

| Record Type | Retention Period | Format |
|---|---|---|
| Bookkeeping records (registreringer) | **5 years** from end of fiscal year | Digital (in approved system) |
| Vouchers/receipts (bilag) | **5 years** from end of fiscal year | Digital storage required |
| Annual accounts | **5 years** from end of fiscal year | Digital |
| Chart of accounts (kontoplan) | **5 years** from end of fiscal year | Digital |
| Description of bookkeeping procedures | **5 years** from end of fiscal year | Digital |
| Supporting documentation for balance sheet items | **5 years** from end of fiscal year | Digital |

### Key Changes Under New Law
- **Digital storage is now mandatory** — physical-only storage is no longer sufficient as primary record
- Physical vouchers (paper receipts) must be **digitized** (scanned/photographed) and stored in the digital system
- The digital bookkeeping system must ensure records are **accessible and readable** for the entire 5-year period
- If you change bookkeeping systems, you must ensure continued access to historical data (SAF-T export helps here)
- **Cloud storage** is acceptable if it meets the security and availability requirements
- Data must be stored within **EU/EEA** or in a country with adequate data protection (GDPR alignment)

### Special Considerations
- **Tax records**: Skattestyrelsen can require records going back further under specific tax rules (typically also 5 years, but up to 10 years in fraud cases)
- **VAT records**: 5 years per the VAT Act (Momsloven)
- **Employment records**: Certain payroll records must be kept for 5 years after employment ends
- **Transfer pricing documentation**: 5 years (for companies meeting the thresholds)

### Sources
- Bogføringsloven §12-13 (Lov nr. 700 af 24/05/2022)
- Skattekontrolloven (tax reporting)
- Retsinformation: https://www.retsinformation.dk/eli/lta/2022/700

---

## 5. Specific Obligations for ApS and IVS Entities

### ApS (Anpartsselskab — Private Limited Company)
- **Full scope**: ApS entities are covered by all Bogføringsloven requirements without exception
- Must use an approved digital bookkeeping system
- Must file annual reports with Erhvervsstyrelsen (årsrapport) — these must be sourced from the digital bookkeeping
- Must maintain proper bookkeeping from day one of registration
- **Regnskabsklasse B** (most small ApS): Simplified annual reporting, but full bookkeeping requirements still apply
- ApS with revenue > DKK 0 are in scope (there is no minimum revenue exemption for registered companies)

### IVS (Iværksætterselskab — Entrepreneurial Company)
- **Important**: IVS company form was **abolished** as of 15 April 2019. No new IVS companies can be formed
- Existing IVS companies were required to convert to ApS (by increasing capital to DKK 40,000) by a set deadline
- Any remaining IVS that did not convert may face forced dissolution
- If your company is still registered as IVS: **convert to ApS immediately** and comply with ApS bookkeeping rules

### Small Company Specifics (Regnskabsklasse B)
Criteria for Regnskabsklasse B (two of three thresholds must NOT be exceeded for two consecutive years):
- Balance sheet total: DKK 44 million
- Revenue: DKK 89 million
- Average employees: 50

Most startups (1-50 employees) will be in Klasse B, meaning:
- Simplified annual report format
- No requirement for auditor review if below certain thresholds (revenue < DKK 8 million, balance < DKK 4 million, < 12 employees — can opt out of audit)
- **But full digital bookkeeping requirements still apply regardless of audit exemption**

### Sole Proprietors / Enkeltmandsvirksomheder
- Companies with annual revenue **> DKK 300,000** (net) must comply with digital bookkeeping requirements
- Below DKK 300,000: simplified requirements but digital bookkeeping system use is still encouraged/required depending on timeline

### Sources
- Bogføringsloven §§1-3 (scope provisions)
- Årsregnskabsloven (Annual Accounts Act) — Regnskabsklasse definitions
- Selskabsloven §357a (IVS abolition)

---

## 6. Timeline and Enforcement Dates

### Phased Implementation Schedule

| Date | Milestone |
|---|---|
| **19 May 2022** | New Bogføringsloven passed by Folketinget |
| **1 July 2022** | Law enters into force (general provisions) |
| **26 January 2024** | Executive order on digital bookkeeping systems published (BEK nr. 97) |
| **2024** | Digital bookkeeping system providers can begin registering with Erhvervsstyrelsen |
| **1 January 2025** | **System registration requirement** becomes active — providers must register their systems |
| **1 July 2025** | **Obligation to use digital bookkeeping system** begins for businesses in the **first wave** (expected: larger companies / Regnskabsklasse C+D) |
| **1 January 2026** | **Obligation to use digital bookkeeping system** extends to **all remaining covered businesses** including small ApS (Regnskabsklasse B) |
| **2026-2027** | Enforcement ramp-up — Erhvervsstyrelsen begins systematic compliance checks |

### Important Notes on Timeline
- The exact rollout dates have been subject to adjustment by Erhvervsstyrelsen. Always check the latest updates at erhvervsstyrelsen.dk
- The phased approach was designed to give system providers time to register and businesses time to transition
- **Grace periods** may apply in the initial phase, but no formal "soft enforcement" period has been guaranteed
- Companies formed **after** the relevant enforcement date must comply from day one

### Sources
- Erhvervsstyrelsen implementation timeline: https://erhvervsstyrelsen.dk/bogfoering
- BEK nr. 97 af 26/01/2024
- Folketinget L 102 (2021-22): https://www.ft.dk/samling/20211/lovforslag/l102/index.htm

---

## 7. Penalties for Non-Compliance

### Enforcement Mechanisms
The Danish Business Authority (Erhvervsstyrelsen) and Skattestyrelsen (tax authority) are the primary enforcement bodies.

### Penalty Framework
- **Administrative fines (bøder)**: Bogføringsloven §§36-39 provide for fines for violations
- **Fines for failure to maintain proper bookkeeping**: Up to **DKK 1,500,000** for companies (in serious cases)
- **Personal liability**: Directors/management can be held personally liable and fined
- **Standard fine levels** (based on precedent and guidelines):
  - Minor/first-time violations: DKK 5,000-25,000
  - Repeated/systemic failures: DKK 25,000-100,000
  - Serious/deliberate non-compliance: DKK 100,000+
- **Forced dissolution**: In extreme cases, Erhvervsstyrelsen can initiate compulsory dissolution of a company (tvangsopløsning) for persistent failure to comply with bookkeeping and reporting obligations
- **Tax implications**: Skattestyrelsen may estimate/assess taxable income if proper books are not available (skønsmæssig ansættelse) — this often results in **higher tax** than actual income would warrant

### Aggravating Factors
- Intentional concealment or destruction of records
- Repeated non-compliance after warnings
- Combination with tax fraud or other financial crimes
- Large revenue with no proper books

### Practical Risk for Startups
- The biggest immediate risk is **tvangsopløsning** (forced dissolution) — Erhvervsstyrelsen regularly dissolves companies that fail to file annual reports or maintain proper bookkeeping
- In 2023-2024, thousands of companies were sent to tvangsopløsning for non-compliance with filing requirements
- Even without fines, lack of proper bookkeeping makes it very difficult to obtain **funding, bank accounts, and investor confidence**

### Sources
- Bogføringsloven §§36-39 (penalty provisions)
- Erhvervsstyrelsen enforcement practice
- Selskabsloven §225 (tvangsopløsning)

---

## 8. Actionable Compliance Checklist for Danish Startups

### System & Infrastructure (Items 1-6)

- [ ] **1. Verify your bookkeeping system is registered** — Check the Erhvervsstyrelsen register at https://erhvervsstyrelsen.dk/registrerede-digitale-bogfoeringssystemer. If your current system is not listed, plan migration immediately.

- [ ] **2. Confirm SAF-T DK export capability** — Test that your system can produce a valid SAF-T DK XML export. Run a test export and validate the file structure.

- [ ] **3. Set up digital voucher/receipt storage** — Configure your system to store digital copies of all bilag (invoices, receipts, bank statements). Stop relying on paper-only storage.

- [ ] **4. Digitize all existing paper records** — Scan/photograph all historical paper vouchers and upload to your digital system. Ensure they are linked to the correct bookkeeping entries.

- [ ] **5. Enable audit trail logging** — Verify that your system logs all changes to bookkeeping entries (who changed what, when). This is a system approval requirement.

- [ ] **6. Set up automated backup** — Ensure your bookkeeping data is backed up (cloud systems typically handle this; verify with your provider). Data must be recoverable for the full 5-year retention period.

### E-Invoicing (Items 7-9)

- [ ] **7. Register on NemHandel** — Go to https://virk.dk and register your company for NemHandel e-invoicing. This is essential for B2G invoicing and increasingly important for B2B.

- [ ] **8. Verify OIOUBL/Peppol BIS support** — Confirm your bookkeeping/invoicing system can send and receive invoices in OIOUBL and/or Peppol BIS 3.0 format.

- [ ] **9. Set up your Peppol identifier** — Register your CVR number as a Peppol participant ID (via your system provider or a Peppol Access Point).

### Record Keeping (Items 10-12)

- [ ] **10. Implement 5-year retention policy** — Configure your system to retain all records for minimum 5 years from end of fiscal year. Set calendar reminders for when old records can be purged.

- [ ] **11. Document your bookkeeping procedures** — Write a brief description of your bookkeeping setup, chart of accounts, and processes. This documentation itself must be retained for 5 years (Bogføringsloven §6).

- [ ] **12. Plan for system migration continuity** — If you ever switch bookkeeping systems, ensure you export all data in SAF-T DK format and maintain access to historical records for the full retention period.

### Legal & Organizational (Items 13-16)

- [ ] **13. Verify your company type compliance** — If you're still registered as IVS, convert to ApS immediately (minimum capital DKK 40,000). IVS form is abolished.

- [ ] **14. Determine your Regnskabsklasse** — Confirm you're in Regnskabsklasse B and understand the annual reporting requirements. Check if you qualify for audit exemption.

- [ ] **15. Assign bookkeeping responsibility** — Designate a person (founder, employee, or external bogholder) responsible for maintaining the digital bookkeeping. Management is personally liable.

- [ ] **16. Review compliance deadlines** — Mark the relevant enforcement dates in your calendar: 1 January 2026 (latest) for mandatory use of approved digital bookkeeping system for all companies.

### Ongoing Compliance (Items 17-20)

- [ ] **17. Record transactions promptly** — Bogføringsloven requires transactions to be recorded "without undue delay" (uden ugrundet ophold). Best practice: within 1-5 business days.

- [ ] **18. Reconcile bank statements monthly** — Regular reconciliation between your bookkeeping and bank is not just best practice but demonstrates proper bookkeeping.

- [ ] **19. Monitor regulatory updates** — Subscribe to Erhvervsstyrelsen updates at https://erhvervsstyrelsen.dk/bogfoering. The implementation details continue to evolve.

- [ ] **20. Prepare for potential SAF-T data requests** — Have a process ready for when Skattestyrelsen or Erhvervsstyrelsen requests your data in SAF-T DK format. Know how to generate and transmit the file.

---

## 9. Key Resources & Links

| Resource | URL |
|---|---|
| Bogføringsloven (full text) | https://www.retsinformation.dk/eli/lta/2022/700 |
| Erhvervsstyrelsen — Bookkeeping page | https://erhvervsstyrelsen.dk/bogfoering |
| Registered digital bookkeeping systems | https://erhvervsstyrelsen.dk/registrerede-digitale-bogfoeringssystemer |
| BEK nr. 97 (digital system requirements) | https://www.retsinformation.dk/eli/lta/2024/97 |
| NemHandel registration | https://nemhandel.dk/ |
| Peppol BIS Billing 3.0 | https://docs.peppol.eu/poacc/billing/3.0/ |
| Skattestyrelsen (tax authority) | https://skat.dk/ |
| Virk.dk (business portal) | https://virk.dk/ |
| EU ViDA proposal | https://ec.europa.eu/taxation_customs/vida_en |

---

## 10. EUComply Integration Notes

### Prompt Template Tags
- `bogfoeringsloven`, `saf-t-dk`, `digital-bookkeeping`, `peppol`, `nemhandel`, `e-invoicing`
- `record-retention-dk`, `aps-compliance`, `erhvervsstyrelsen`

### Checklist Category Mapping
- Items 1-6 → **Technical Infrastructure**
- Items 7-9 → **E-Invoicing Setup**
- Items 10-12 → **Data Retention**
- Items 13-16 → **Legal/Organizational**
- Items 17-20 → **Ongoing Operations**

### Risk Scoring Factors
- No approved bookkeeping system → **Critical** (blocks compliance entirely)
- No SAF-T export capability → **High** (cannot respond to authority requests)
- No e-invoicing for B2G → **High** (cannot invoice public sector clients)
- Paper-only records → **High** (violates digital storage requirement)
- No documented procedures → **Medium**
- No Peppol registration → **Low-Medium** (not yet mandatory for B2B, but increasingly expected)

### Priority for Startups
1. **Immediate**: Get on an approved digital bookkeeping system
2. **Short-term**: Digitize all records, set up e-invoicing
3. **Medium-term**: Document procedures, prepare for SAF-T requests
4. **Ongoing**: Monitor updates, maintain compliance

---

*Document prepared for EUComply project. This is a research reference — not legal advice. Consult a Danish revisor (auditor) or legal professional for company-specific guidance.*

*Research based on legislation and publicly available information as of early 2025. Danish regulatory implementation is ongoing — verify current status at erhvervsstyrelsen.dk.*
