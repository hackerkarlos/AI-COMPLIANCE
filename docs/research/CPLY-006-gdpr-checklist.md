# CPLY-006: GDPR Compliance Checklist for Danish Startups (1-50 Employees)

**Document ID:** CPLY-006
**Created:** 2026-04-13
**Purpose:** Comprehensive GDPR compliance reference for Danish startups, tailored for EUComply AI prompt templates and checklist generation.
**Scope:** Companies registered in Denmark with 1-50 employees, subject to GDPR and the Danish Data Protection Act (Databeskyttelsesloven, Act No. 502 of 23 May 2018).

---

## Executive Summary

Danish startups must comply with both the EU General Data Protection Regulation (GDPR) and the Danish Data Protection Act (Databeskyttelsesloven), which supplements the GDPR with Denmark-specific provisions. The Danish Data Protection Agency (Datatilsynet) is the supervisory authority and has been notably active in enforcement, issuing fines and reprimands even to small companies. This checklist covers 20 actionable items organized by the 10 topic areas, each rated by difficulty and priority.

---

## Legend

- **Difficulty:** Easy (template/document task) | Medium (requires some legal/technical effort) | Hard (complex, may need external counsel)
- **Priority:** Critical (non-compliance = immediate risk of fines/orders) | High (expected by Datatilsynet, commonly audited) | Medium (best practice, reduces risk) | Low (nice-to-have, forward-looking)

---

## 1. Datatilsynet (Danish DPA) Specific Requirements

### Danish Context

Datatilsynet (datatilsynet.dk) enforces GDPR in Denmark and has issued specific guidance on topics including employee data, customer data, and IT security. Denmark implemented GDPR via the Danish Data Protection Act (Databeskyttelsesloven), which includes:

- **Section 6-11:** Special rules on processing of the Danish CPR number (civil registration number / personnummer). Processing CPR numbers requires explicit legal basis — this is stricter than generic GDPR and catches many startups off guard.
- **Section 12:** Rules on processing for journalistic, artistic, or literary purposes.
- **Section 41:** Criminal offenses for intentional or grossly negligent violations (Denmark is one of few EU countries with criminal sanctions for GDPR breaches).
- **Minimum age of consent for information society services:** 13 years (lower than the GDPR default of 16).

Datatilsynet also maintains a mandatory registration for certain data processors and publishes decisions publicly, making Danish enforcement relatively transparent.

---

## 2. Actionable Checklist Items

---

### Item 1: Register with Datatilsynet (if required)
**Topic:** Datatilsynet Requirements
**Difficulty:** Easy | **Priority:** High

**Action:** Determine if your startup needs to notify or register with Datatilsynet. Under current Danish law, most private companies do NOT need to register, but you must maintain internal records (see ROPA). Public authorities and companies processing special category data at scale may have additional obligations.

**Danish-specific note:** Datatilsynet abolished the old notification system (anmeldelsesordning) when GDPR took effect. The obligation shifted to internal accountability (ROPA + documentation).

**Deliverable:** Confirm no registration is needed; document this assessment.

---

### Item 2: Implement CPR Number Handling Policy
**Topic:** Datatilsynet Requirements
**Difficulty:** Medium | **Priority:** Critical

**Action:** If your startup collects or processes Danish CPR numbers (personnumre), create a dedicated policy. Under Databeskyttelsesloven Section 11, CPR numbers may only be processed when:
- Required by law
- The data subject has consented
- The processing is carried out exclusively for scientific or statistical purposes
- There is a legitimate purpose and the processing is necessary for unique identification or as a reference number

**Danish-specific note:** Datatilsynet has fined companies for casual collection of CPR numbers (e.g., using them as customer IDs without justification). Never use CPR numbers as general identifiers.

**Deliverable:** CPR number processing policy document; inventory of where CPR numbers appear in your systems.

---

### Item 3: Execute Data Processing Agreements (DPAs) with All Processors
**Topic:** Data Processing Agreements
**Difficulty:** Medium | **Priority:** Critical

**Action:** Identify all third-party data processors (cloud hosting, SaaS tools, payroll providers, email services, analytics platforms) and ensure a written Data Processing Agreement (databehandleraftale) is in place per GDPR Article 28.

**Danish-specific note:** Datatilsynet has published a standard DPA template (standardkontraktbestemmelser for databehandlere) available on datatilsynet.dk. Using this template is strongly recommended as it is accepted by the authority. Datatilsynet has issued multiple reprimands to Danish companies for missing or inadequate DPAs — this is one of the most commonly enforced requirements.

**Deliverable:** Signed DPAs with every data processor; processor inventory list.

---

### Item 4: Audit Sub-Processor Chains
**Topic:** Data Processing Agreements
**Difficulty:** Medium | **Priority:** High

**Action:** For each data processor, document their sub-processors. Ensure your DPA includes provisions for sub-processor approval (general or specific authorization). Verify sub-processors are located in adequate jurisdictions or have appropriate transfer mechanisms.

**Danish-specific note:** Datatilsynet has specifically addressed sub-processor management in guidance and enforcement actions, particularly regarding cloud services (AWS, Google Cloud, Microsoft Azure). After the Schrems II ruling, Datatilsynet ordered several Danish municipalities to stop using Google Workspace due to inadequate sub-processor transfer safeguards — this precedent applies to private companies too.

**Deliverable:** Sub-processor register for each processor; documented approval mechanism.

---

### Item 5: Draft and Publish a GDPR-Compliant Privacy Policy
**Topic:** Privacy Policy Requirements
**Difficulty:** Easy | **Priority:** Critical

**Action:** Create a privacy policy (privatlivspolitik) covering GDPR Articles 13-14 requirements:
- Controller identity and contact details
- Purpose and legal basis for each processing activity
- Data retention periods (specific, not vague)
- Data subject rights (access, rectification, erasure, portability, objection)
- Right to lodge complaint with Datatilsynet
- International transfers (if applicable)
- Automated decision-making / profiling (if applicable)

**Danish-specific note:** Datatilsynet expects the privacy policy to be available in Danish if your services target Danish users. Include Datatilsynet's complaint contact: Datatilsynet, Carl Jacobsens Vej 35, 2500 Valby, dt@datatilsynet.dk. Datatilsynet has criticized companies for overly vague privacy policies (e.g., stating "legitimate interest" without specifying what the interest is).

**Deliverable:** Published privacy policy on website and in app; separate employee privacy notice.

---

### Item 6: Create an Employee Privacy Notice
**Topic:** Privacy Policy Requirements
**Difficulty:** Easy | **Priority:** High

**Action:** Provide employees with a dedicated privacy notice covering payroll processing, IT monitoring, CCTV (if applicable), and any employee data shared with third parties.

**Danish-specific note:** Datatilsynet has issued specific guidance on employee monitoring (kontrolforanstaltninger). Danish labour law intersects with GDPR here — any monitoring must also comply with collective agreements and the Danish Marketing Practices Act. Always inform employees before implementing monitoring tools. The Danish Data Protection Act Section 12 also affects processing of employee data for research/statistics.

**Deliverable:** Employee privacy notice distributed to all staff; signed acknowledgment.

---

### Item 7: Assess DPO Appointment Requirement
**Topic:** DPO Appointment Threshold
**Difficulty:** Easy | **Priority:** High

**Action:** Evaluate whether your startup must appoint a Data Protection Officer (DPO / databeskyttelsesrådgiver) under GDPR Article 37. A DPO is mandatory if you:
- Are a public authority or body
- Carry out large-scale systematic monitoring of individuals (e.g., behavioral tracking, large-scale profiling)
- Process special categories of data or criminal conviction data at scale

**Danish-specific note:** Most Danish startups with 1-50 employees do NOT need a DPO unless their core business involves large-scale monitoring or sensitive data processing. However, Datatilsynet recommends appointing a privacy contact person even when a DPO is not mandatory. If you do appoint a DPO, their contact details must be published and communicated to Datatilsynet. Note: The DPO can be external (outsourced), which is cost-effective for small companies.

**Deliverable:** Documented DPO assessment; if DPO not required, appoint an internal privacy contact person.

---

### Item 8: Establish a Data Breach Response Plan
**Topic:** Data Breach Notification
**Difficulty:** Medium | **Priority:** Critical

**Action:** Create a data breach (brud på persondatasikkerheden) response plan covering:
- Detection and internal escalation procedures
- Risk assessment framework (likelihood and severity for data subjects)
- 72-hour notification to Datatilsynet (GDPR Article 33)
- Communication to affected data subjects when high risk (GDPR Article 34)
- Internal breach register (mandatory even for breaches not reported to Datatilsynet)

**Danish-specific note:** Datatilsynet uses an online breach notification form at https://indberet.datatilsynet.dk/. The form is in Danish and requires specific information including number of affected individuals, categories of data, and remedial actions. Datatilsynet has been strict on the 72-hour deadline — late notifications have resulted in reprimands. In 2023-2024, Datatilsynet received 6,000+ breach notifications annually, many from small companies. Common Danish breach types: misdirected emails, lost devices, and unauthorized access to CPR numbers.

**Deliverable:** Breach response plan document; trained incident response team; bookmarked Datatilsynet reporting portal.

---

### Item 9: Maintain an Internal Breach Register
**Topic:** Data Breach Notification
**Difficulty:** Easy | **Priority:** Critical

**Action:** Maintain a log of ALL personal data breaches, regardless of whether they were reported to Datatilsynet. This is mandatory under GDPR Article 33(5). Include: date, nature of breach, data categories affected, approximate number of individuals, consequences, and remedial measures.

**Danish-specific note:** Datatilsynet audits breach registers during inspections. An empty register for a company that has been operating for years may raise suspicion — it likely means breaches went undetected or unrecorded, not that none occurred.

**Deliverable:** Breach register (spreadsheet or system); process for logging incidents.

---

### Item 10: Implement Transfer Impact Assessments for International Transfers
**Topic:** International Data Transfers (Post-Schrems II)
**Difficulty:** Hard | **Priority:** Critical

**Action:** Map all international data transfers (any personal data leaving the EEA). For each transfer:
1. Identify the transfer mechanism: EU adequacy decision, Standard Contractual Clauses (SCCs — June 2021 version), Binding Corporate Rules, or derogation
2. Conduct a Transfer Impact Assessment (TIA) evaluating the legal framework of the recipient country
3. Implement supplementary measures if needed (encryption, pseudonymization, contractual commitments)

**Danish-specific note:** The EU-US Data Privacy Framework (DPF) adopted in July 2023 provides an adequacy basis for transfers to certified US companies. However, Datatilsynet has signaled caution and recommends verifying the recipient's DPF certification status. For non-US/non-adequate countries, SCCs + TIA remain mandatory. Datatilsynet's landmark decisions on Google Analytics (2022) and Google Workspace (Chromebooks in schools, 2022-2024) demonstrate aggressive enforcement on transfers. Even startups using standard US SaaS tools (Mailchimp, HubSpot, Intercom) must document their transfer basis.

**Deliverable:** Data transfer map; TIA for each non-EEA transfer; updated SCCs where needed.

---

### Item 11: Implement Cookie Consent (Prior Opt-In)
**Topic:** Cookie Consent Requirements
**Difficulty:** Medium | **Priority:** Critical

**Action:** Implement a cookie consent mechanism that:
- Obtains prior, explicit consent before setting non-essential cookies
- Provides granular choices (analytics, marketing, functional — not just "accept all")
- Makes it as easy to reject as to accept cookies
- Does not use dark patterns (pre-ticked boxes, misleading buttons)
- Stores proof of consent

**Danish-specific note:** Cookie rules in Denmark are governed by the Danish Cookie Order (Cookiebekendtgørelsen, BEK nr 1148 of 09/12/2011, updated) implementing the ePrivacy Directive, enforced by the Danish Business Authority (Erhvervsstyrelsen) — NOT Datatilsynet. However, when cookie data constitutes personal data, GDPR applies and Datatilsynet has jurisdiction. Denmark was early to adopt strict cookie enforcement. The Danish Business Authority has issued guidance requiring that cookie banners must not be designed to nudge users toward accepting. Google Analytics cookies specifically have been a focus area.

**Deliverable:** Compliant cookie banner (e.g., Cookiebot, which is a Danish company); cookie policy page; consent log.

---

### Item 12: Maintain Records of Processing Activities (ROPA)
**Topic:** ROPA
**Difficulty:** Medium | **Priority:** Critical

**Action:** Create and maintain a Record of Processing Activities per GDPR Article 30. Document for each processing activity:
- Purpose of processing
- Categories of data subjects and personal data
- Categories of recipients
- International transfers (if any)
- Retention periods
- Technical and organizational security measures

**Danish-specific note:** While GDPR Article 30(5) exempts organizations with fewer than 250 employees from ROPA in some cases, this exemption is very narrow — it does NOT apply if processing is not occasional, involves special category data, or could result in risk to data subjects. In practice, Datatilsynet expects ALL companies to maintain ROPA regardless of size. Datatilsynet has published a ROPA template (fortegnelse over behandlingsaktiviteter) on their website. Use it.

**Deliverable:** Completed ROPA using Datatilsynet's template; annual review schedule.

---

### Item 13: Establish a DSAR Response Process
**Topic:** Data Subject Access Requests
**Difficulty:** Medium | **Priority:** High

**Action:** Create a process to handle Data Subject Access Requests (anmodning om indsigt) within the 30-day deadline:
1. Verify the identity of the requester
2. Search all systems for the individual's data
3. Provide data in a commonly used electronic format
4. Document the request and response

**Danish-specific note:** Datatilsynet has emphasized that identity verification must be proportionate — do not demand excessive ID for low-risk requests. For employee DSARs, Datatilsynet has ruled that internal notes and assessments about an employee are generally subject to access rights, with limited exceptions for internal deliberations. Datatilsynet publishes decisions on DSAR complaints regularly and has reprimanded companies for late or incomplete responses.

**Deliverable:** DSAR response procedure; template response letters; system for tracking requests.

---

### Item 14: Implement Right to Erasure Process
**Topic:** Data Subject Access Requests
**Difficulty:** Medium | **Priority:** High

**Action:** Establish a process for handling erasure requests ("right to be forgotten" / ret til sletning) including:
- Criteria for when erasure must be performed vs. can be refused
- Technical capability to delete data across all systems (including backups within reasonable timeframes)
- Notification to processors to also delete the data

**Danish-specific note:** Datatilsynet has provided specific guidance on data retention and deletion. They expect concrete retention periods, not indefinite storage. For startups using cloud-based systems, ensure you can actually execute deletion across all services. Datatilsynet has fined companies for retaining data beyond stated retention periods.

**Deliverable:** Erasure request procedure; data deletion capability verification; retention schedule.

---

### Item 15: Conduct a Data Protection Impact Assessment (DPIA) Where Required
**Topic:** Datatilsynet Requirements
**Difficulty:** Hard | **Priority:** High

**Action:** Determine if any of your processing activities require a DPIA (konsekvensanalyse) under GDPR Article 35. A DPIA is mandatory when processing is likely to result in high risk, including:
- Systematic and extensive profiling with significant effects
- Large-scale processing of special category data
- Systematic monitoring of publicly accessible areas

**Danish-specific note:** Datatilsynet has published a specific list of processing operations that always require a DPIA (the "must-do" list per Article 35(4)). This includes: large-scale processing of location data, systematic monitoring of employee activities, and processing of genetic or biometric data for identification. Check Datatilsynet's DPIA list at datatilsynet.dk before concluding a DPIA is unnecessary.

**Deliverable:** DPIA screening assessment; completed DPIA(s) where required.

---

### Item 16: Implement Appropriate Technical and Organizational Security Measures
**Topic:** Datatilsynet Requirements
**Difficulty:** Medium | **Priority:** Critical

**Action:** Implement security measures proportionate to your processing risks:
- Access control and role-based permissions
- Encryption at rest and in transit
- Multi-factor authentication for systems containing personal data
- Regular security updates and patch management
- Employee security awareness training

**Danish-specific note:** Datatilsynet has published detailed IT security guidance (Vejledning om informationssikkerhed) and frequently references ISO 27001 as a benchmark. In enforcement actions, Datatilsynet has specifically criticized: lack of MFA, excessive access rights, unencrypted email transmission of sensitive data, and failure to log access to personal data. For startups, Datatilsynet expects at minimum: MFA, encryption, access logging, and regular access reviews.

**Deliverable:** Security policy document; MFA enabled on all systems; access control matrix.

---

### Item 17: Define and Document Data Retention Periods
**Topic:** ROPA / Datatilsynet Requirements
**Difficulty:** Medium | **Priority:** High

**Action:** Establish specific retention periods for each category of personal data. Implement automated deletion or review processes. Danish law prescribes some retention periods:
- Bookkeeping records (bogføringslov): 5 years
- Employment records: varies, but salary records typically 5 years
- Tax-related records: 5 years after the relevant tax year
- Customer data for contractual purposes: duration of contract + statute of limitations (typically 3 years under Danish law, 5 years for some claims)

**Danish-specific note:** Datatilsynet frequently penalizes companies for vague retention policies ("as long as necessary") and for keeping data beyond stated periods. Be specific.

**Deliverable:** Retention schedule by data category; automated deletion processes where possible.

---

### Item 18: Train Employees on GDPR and Data Handling
**Topic:** Datatilsynet Requirements
**Difficulty:** Easy | **Priority:** High

**Action:** Conduct regular GDPR awareness training for all employees, covering:
- Recognizing personal data and special category data
- Breach identification and internal reporting
- Handling DSARs
- Secure data handling practices (clean desk, screen lock, secure email)

**Danish-specific note:** Datatilsynet considers employee training a key organizational measure under GDPR Article 32. In enforcement cases, lack of training has been cited as an aggravating factor. Training does not need to be expensive — a documented annual session with records of attendance is sufficient for small companies.

**Deliverable:** Training materials; attendance records; annual training schedule.

---

### Item 19: Review Marketing and Direct Communication Compliance
**Topic:** Cookie Consent / Datatilsynet Requirements
**Difficulty:** Medium | **Priority:** High

**Action:** Ensure email marketing and electronic communications comply with both GDPR and the Danish Marketing Practices Act (Markedsføringsloven):
- B2C email marketing requires prior opt-in consent
- B2B "soft opt-in" is permitted for existing customer relationships for similar products/services
- Every communication must include an easy unsubscribe mechanism
- Consent records must be maintained

**Danish-specific note:** The Danish Consumer Ombudsman (Forbrugerombudsmanden) enforces marketing rules alongside Datatilsynet's GDPR enforcement. Unsolicited marketing can trigger both GDPR fines and marketing law sanctions. Denmark has been active in prosecuting spam and non-consensual marketing.

**Deliverable:** Marketing consent audit; updated subscription forms; unsubscribe mechanism verification.

---

### Item 20: Prepare for Datatilsynet Inspections
**Topic:** Datatilsynet Requirements
**Difficulty:** Medium | **Priority:** Medium

**Action:** Maintain an "audit-ready" compliance folder containing:
- ROPA
- All DPAs
- Privacy policies (public and employee)
- Breach register
- DPO/privacy contact person documentation
- DPIA assessments (if applicable)
- DSAR response records
- Training records
- Transfer impact assessments
- Cookie consent documentation

**Danish-specific note:** Datatilsynet conducts both planned and unannounced inspections (tilsyn). In recent years, they have conducted thematic inspections focusing on specific sectors (e.g., fintech, healthtech, e-commerce). Datatilsynet publishes an annual plan of focus areas — check datatilsynet.dk at the start of each year. Having documentation organized and accessible demonstrates accountability (GDPR Article 5(2)) and significantly reduces risk during inspections.

**Deliverable:** Centralized compliance documentation folder; annual compliance self-audit.

---

## 3. Common Violations and Fines in Denmark

### Datatilsynet Enforcement Trends (2019-2025)

Datatilsynet can recommend fines (bøder) to the police/prosecution service, as the Danish system routes GDPR fines through the criminal justice system (unlike many other EU countries where the DPA issues fines directly). This means:

- Fines are proposed by Datatilsynet but decided by courts
- Criminal liability applies for intentional/grossly negligent violations (Databeskyttelsesloven Section 41)
- Datatilsynet also issues reprimands (påtaler), serious reprimands (alvorlige påtaler), injunctions (påbud), and bans (forbud)

### Most Common Violations Affecting Danish Startups

| Violation | Typical Consequence | Frequency |
|-----------|-------------------|-----------|
| Missing or inadequate DPAs | Reprimand / serious reprimand | Very common |
| Insufficient security measures (no MFA, poor access control) | Fine recommendation (DKK 50,000-500,000+) | Common |
| Excessive data retention | Reprimand / injunction | Common |
| Unauthorized processing of CPR numbers | Fine recommendation | Common |
| Inadequate or missing privacy policy | Reprimand | Common |
| Late breach notification (beyond 72 hours) | Reprimand | Frequent |
| Illegal international data transfers | Injunction / ban | Increasing |
| Missing ROPA | Reprimand | Common during inspections |
| Non-compliant cookie consent | Fine / injunction (Erhvervsstyrelsen) | Increasing |
| Failure to respond to DSARs within 30 days | Reprimand | Moderate |

### Notable Danish Fines and Decisions

- **IDdesign A/S (2019):** DKK 1.5 million fine for retaining personal data of 385,000 customers beyond retention period
- **Taxa 4x35 (2019):** DKK 1.2 million fine for retaining 8.8 million trip records beyond the 2-year retention period
- **Arp-Hansen Hotel Group (2020):** DKK 500,000 fine for retaining guest data beyond stated periods
- **Municipality of Gladsaxe (2020):** Reprimand for inadequate TIA for Google Chromebooks
- **Danske Bank (2022):** DKK 10 million fine recommendation for failure to delete personal data across 400+ systems
- **Multiple SMEs (ongoing):** DKK 25,000-100,000 fines for basic security failures

**Key takeaway for startups:** Datatilsynet does not exempt small companies from enforcement. Fines are proportionate to size but reprimands and injunctions apply equally. Data retention and security are the highest-risk areas.

---

## 4. Summary Matrix

| # | Checklist Item | Difficulty | Priority | Topic Area |
|---|---------------|-----------|----------|------------|
| 1 | Registration assessment | Easy | High | Datatilsynet |
| 2 | CPR number handling policy | Medium | Critical | Datatilsynet |
| 3 | Data Processing Agreements | Medium | Critical | DPA |
| 4 | Sub-processor audit | Medium | High | DPA |
| 5 | Public privacy policy | Easy | Critical | Privacy Policy |
| 6 | Employee privacy notice | Easy | High | Privacy Policy |
| 7 | DPO assessment | Easy | High | DPO |
| 8 | Breach response plan | Medium | Critical | Breach Notification |
| 9 | Internal breach register | Easy | Critical | Breach Notification |
| 10 | Transfer impact assessments | Hard | Critical | International Transfers |
| 11 | Cookie consent mechanism | Medium | Critical | Cookies |
| 12 | Records of processing (ROPA) | Medium | Critical | ROPA |
| 13 | DSAR response process | Medium | High | DSAR |
| 14 | Right to erasure process | Medium | High | DSAR |
| 15 | DPIA screening/completion | Hard | High | Datatilsynet |
| 16 | Technical security measures | Medium | Critical | Datatilsynet |
| 17 | Data retention schedule | Medium | High | ROPA / Datatilsynet |
| 18 | Employee GDPR training | Easy | High | Datatilsynet |
| 19 | Marketing compliance review | Medium | High | Cookies / Marketing |
| 20 | Inspection preparedness | Medium | Medium | Datatilsynet |

---

## 5. Recommended Implementation Order for Startups

**Phase 1 — Immediate (Week 1-2):** Items rated Critical
- Item 5: Privacy policy
- Item 3: DPAs with all processors
- Item 9: Breach register
- Item 12: ROPA
- Item 16: Basic security measures (MFA, encryption)
- Item 2: CPR number policy (if applicable)

**Phase 2 — Short-term (Week 3-6):** Items rated Critical + complex
- Item 8: Breach response plan
- Item 10: Transfer impact assessments
- Item 11: Cookie consent
- Item 17: Retention schedule

**Phase 3 — Medium-term (Month 2-3):** Items rated High
- Item 4: Sub-processor audit
- Item 6: Employee privacy notice
- Item 7: DPO assessment
- Item 13: DSAR process
- Item 14: Erasure process
- Item 15: DPIA screening
- Item 18: Employee training
- Item 19: Marketing compliance

**Phase 4 — Ongoing:** Maintenance and audit readiness
- Item 1: Registration review
- Item 20: Inspection preparedness
- Annual reviews of all documents

---

## 6. Key Danish Resources

- **Datatilsynet website:** https://datatilsynet.dk
- **Datatilsynet ROPA template:** https://datatilsynet.dk/hvad-siger-reglerne/vejledning/fortegnelse
- **Datatilsynet standard DPA template:** https://datatilsynet.dk/hvad-siger-reglerne/vejledning/databehandleraftaler
- **Breach notification portal:** https://indberet.datatilsynet.dk/
- **Danish Data Protection Act (Databeskyttelsesloven):** https://www.retsinformation.dk/eli/lta/2018/502
- **Erhvervsstyrelsen cookie guidance:** https://erhvervsstyrelsen.dk/cookies
- **Datatilsynet annual reports and inspection plans:** Published each January on datatilsynet.dk

---

*This document is for informational purposes within the EUComply project and does not constitute legal advice. Startups should consult with a Danish data protection lawyer for company-specific compliance guidance.*
