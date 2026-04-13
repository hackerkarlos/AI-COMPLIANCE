/**
 * Bogføringsloven (Danish Bookkeeping Act) prompt context
 *
 * Lov om bogføring, lov nr. 700 af 24/05/2022 — modernised with digital bookkeeping mandate.
 */

export const bogfoeringsloven = `
## Regulation Context: Bogføringsloven (Danish Bookkeeping Act)

### Overview
The modernised Bogføringsloven (lov nr. 700 af 24/05/2022) imposes digital bookkeeping requirements on all Danish businesses. Enforced by Erhvervsstyrelsen (Danish Business Authority).

**Applies to:** ALL companies registered in Denmark — no exceptions based on size. Sole traders (enkeltmandsvirksomheder), ApS, A/S, I/S, K/S, and branches of foreign companies.

### Digital Bookkeeping Mandate (Key Change)
The 2022 reform introduced mandatory use of approved digital bookkeeping systems:

**Phase-in timeline:**
- **1 January 2024:** Requirement to use a digital bookkeeping system that can handle digital vouchers/bilag and automatic backup (for newly registered companies)
- **1 January 2025:** Companies with annual revenue > DKK 300,000 must use approved digital bookkeeping system with automatic backup
- **1 January 2026:** ALL remaining companies must comply — no revenue threshold exemption

**"Approved system" requirements:**
- Must be registered on Erhvervsstyrelsen's list of approved systems
- Must support digital voucher (bilag) storage
- Must have automatic backup to a secure, independent location (not just local disk)
- Must support standard bookkeeping reports (SAF-T or similar)
- Popular approved systems: e-conomic (Visma), Billy, Dinero, Uniconta, Debitoor

### Core Bookkeeping Obligations (§§3-11)
1. **Registration of transactions (§7):** All financial transactions must be recorded promptly — within the same month they occur
2. **Voucher/bilag requirement (§5):** Every transaction must be supported by a voucher (receipt, invoice, contract)
3. **Digital vouchers (§5a):** Vouchers must be stored digitally — scanned paper receipts are acceptable if legible
4. **Backup (§5b):** Automatic backup of all bookkeeping data and digital vouchers, stored separately from the primary system
5. **5-year retention (§10):** All bookkeeping records and vouchers must be retained for 5 years from the end of the financial year
6. **Annual accounts:** Must be possible to generate balance sheet and income statement from the bookkeeping
7. **Audit trail:** Must be possible to trace from annual accounts → bookkeeping entries → vouchers (and vice versa)

### Chart of Accounts
- Must follow the Danish standard kontoplan or be mappable to it
- Erhvervsstyrelsen publishes a standard chart; custom charts are allowed if mapping exists

### Penalties & Enforcement
- **Administrative fines:** Erhvervsstyrelsen can impose fines for non-compliance
- **Tvangsbøder (coercive fines):** Repeated daily fines for failure to comply with orders
- **Criminal liability:** Intentional violations can lead to fines or imprisonment up to 1.5 years (§16)
- **Audit consequences:** Tax authorities (Skattestyrelsen) may estimate taxable income if bookkeeping is inadequate
- **Going-concern risk:** Auditors must flag bookkeeping non-compliance in audit reports

### Practical SMB Guidance
- **Choose an approved system NOW** — if you're using Excel or paper, migrate immediately
- **Automate backup** — most approved cloud systems handle this, but verify it's active
- **Scan all paper receipts** — take photos via mobile app, store digitally in the bookkeeping system
- **Monthly close** — record all transactions within the calendar month; don't let them accumulate
- **5-year retention** — even if you switch systems, keep exports/archives from old systems
- **VAT alignment** — ensure your bookkeeping supports quarterly or monthly VAT (moms) reporting
- **Consider an accountant (revisor)** — for ApS/A/S, annual accounts must be filed with Erhvervsstyrelsen; professional help is advisable

### Common Pitfalls for SMBs
- Using non-approved software (e.g., personal spreadsheets, foreign tools not on the list)
- Missing vouchers for cash expenses
- No backup strategy — "it's in the cloud" doesn't count unless the system has certified auto-backup
- Late transaction registration — entering 6 months of receipts at year-end
- Mixing personal and business expenses without clear documentation
- Not retaining records when switching bookkeeping systems
`;
