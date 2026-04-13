# CPLY-007: Cookie/ePrivacy Compliance for EU/Danish Websites — Requirements & Implementation

**Research ID:** CPLY-007
**Status:** Complete
**Last Updated:** 2026-04-13
**Scope:** Cookie consent and ePrivacy compliance for Danish websites, focusing on ePrivacy Directive implementation, GDPR overlap, Datatilsynet guidance, banner requirements, CMPs, and common violations.
**Regulation:** ePrivacy Directive 2002/58/EC, Danish Cookie Order (Cookiebekendtgørelsen, BEK nr 1148 of 09/12/2011), GDPR (overlap), Datatilsynet cookie guidance, Erhvervsstyrelsen enforcement.

---

## Executive Summary

Cookie compliance in Denmark is governed by the **ePrivacy Directive** as implemented via the **Danish Cookie Order** (Cookiebekendtgørelsen). Unlike many EU countries where data protection authorities enforce cookie rules, in Denmark the primary enforcement authority is the **Danish Business Authority (Erhvervsstyrelsen)**. However, when cookies process personal data, the **GDPR** applies and the **Danish Data Protection Agency (Datatilsynet)** has jurisdiction. Denmark has strict cookie enforcement and was among the first EU countries to require explicit prior consent for non‑essential cookies.

**Key takeaways for Danish websites:**
- Non‑essential cookies (analytics, marketing, functional) require **prior, explicit, informed, and granular consent** before being set.
- Consent must be as easy to refuse as to accept; dark patterns (pre‑ticked boxes, misleading buttons) are prohibited.
- A compliant cookie banner must provide category‑level choices, a persistent “Cookie Settings” link, and a mechanism to withdraw consent.
- Consent records must be stored as evidence of lawful processing.
- Third‑party scripts and trackers must be inventoried and consent‑gated.
- Email marketing requires **opt‑in consent** (double opt‑in recommended).
- Telemarketing must respect the Danish Robinson list and do‑not‑call rules.

---

## 1. Legal Framework & Authorities

### 1.1 ePrivacy Directive & Danish Implementation
- **ePrivacy Directive (2002/58/EC)**: EU directive on privacy in electronic communications, Article 5(3) requires consent for storing/accessing information on user equipment (cookies, tracking).
- **Danish Cookie Order (Cookiebekendtgørelsen, BEK nr 1148 of 09/12/2011)**: The national implementation of Article 5(3). The Order was updated in 2012, 2015, and 2020 to align with GDPR and CJEU rulings.
- **Enforcement authority**: **Erhvervsstyrelsen** (Danish Business Authority) is responsible for cookie‑rule enforcement. Datatilsynet handles complaints when cookies involve personal data (overlap with GDPR).

### 1.2 GDPR Overlap
When cookies collect personal data (IP address, device identifiers, browsing behavior), the GDPR applies alongside the ePrivacy rules. Key overlaps:
- **Lawful basis**: Consent under the ePrivacy Directive also satisfies GDPR consent requirements, provided it meets GDPR standards (freely given, specific, informed, unambiguous, easy to withdraw).
- **Data subject rights**: Users have the right to access, rectify, erase, and port personal data collected via cookies.
- **Privacy notice**: Information about cookie‑based processing must be included in the GDPR privacy notice (Articles 13‑14).
- **Data protection by design**: Cookie banners and consent mechanisms must be designed with privacy as default.

### 1.3 Datatilsynet Cookie Guidance
Datatilsynet has issued guidance on cookies, emphasizing:
- **Analytics cookies** that process personal data require GDPR‑compliant consent (prior opt‑in).
- **Google Analytics** has been a focus area; Datatilsynet has ruled that GA cookies constitute personal data and require valid consent.
- **Cookie walls** (blocking access unless consent is given) are generally not permissible, as consent must be freely given.
- **Withdrawal of consent** must be as easy as giving it, and must result in deletion of the relevant cookies.
- **Consent records** must be maintained to demonstrate compliance.

---

## 2. Required Cookie Banner Elements (Danish Requirements)

Based on Erhvervsstyrelsen guidance and EU Court of Justice (CJEU) rulings, a compliant Danish cookie banner must include:

1. **Clear, prominent notice** that cookies are used, with a link to the cookie policy.
2. **Granular category choices** (at minimum: necessary, functional, analytics, marketing). Users must be able to accept/reject per category.
3. **Prior blocking** of non‑essential cookies until consent is obtained.
4. **Equal prominence** for “Accept” and “Reject” buttons (no visual nudging toward acceptance).
5. **No pre‑ticked boxes** for any non‑essential category.
6. **Persistent “Cookie Settings” link** in the footer (or equivalent) allowing users to change their choices at any time.
7. **Withdrawal mechanism** that actually deletes the relevant cookies when consent is withdrawn.
8. **Information about data transfers** if cookies involve third‑country data transfers (e.g., Google Analytics to USA).
9. **Language** – the banner must be in Danish for Danish‑language websites; English may be acceptable for international sites, but Danish is recommended.
10. **No “cookie walls”** that make access to the website conditional on consent, unless the website has a legitimate alternative (e.g., paid subscription).

---

## 3. Consent Management Platform (CMP) Requirements

A CMP is strongly recommended for automated consent collection, blocking, and record‑keeping. Key requirements:

- **Granular consent capture**: Must support category‑level consent.
- **Prior blocking**: Must prevent non‑essential scripts from loading until consent is given.
- **Consent storage**: Must store consent records (timestamp, user ID, consent version, categories).
- **Withdrawal functionality**: Must allow users to change preferences and delete cookies.
- **Integration with tag managers**: Should work with Google Tag Manager, Tealium, etc.
- **Danish‑language support**: Interface should be available in Danish.
- **Popular CMPs used in Denmark**: Cookiebot (Danish company), CookieYes, OneTrust, Quantcast Choice.

**Note**: Using a CMP does not guarantee compliance; configuration must align with Danish rules (e.g., no implicit consent, no “Accept all” as default).

---

## 4. Common Violations & Enforcement Examples

### 4.1 Typical Violations
- **No consent banner** or banner that does not block non‑essential cookies before consent.
- **“Accept all” as default** with no equal‑size “Reject” button.
- **Pre‑ticked boxes** for analytics/marketing cookies.
- **Missing “Cookie Settings” link** or link that is hard to find.
- **No consent records** stored.
- **Cookie walls** that deny access unless consent is given.
- **Ignoring withdrawal** – cookies remain after user withdraws consent.
- **Third‑party trackers** (Facebook Pixel, Google Analytics) firing before consent.

### 4.2 Enforcement in Denmark
- **Erhvervsstyrelsen** conducts periodic sweeps and can issue injunctions, orders to comply, and fines (though fines are less common than under GDPR).
- **Datatilsynet** has taken action against websites using Google Analytics without valid consent (e.g., rulings against public authorities and private companies).
- **Private litigation**: Consumer associations (Forbrugerrådet) can bring cases on behalf of users.

### 4.3 Recent Cases
- **Datatilsynet vs. a Danish municipality** (2023): Ordered to stop using Google Analytics because consent was not valid and data transfers to USA lacked adequate safeguards.
- **Erhvervsstyrelsen guidance on dark patterns** (2024): Emphasized that banners must not nudge users toward acceptance through design or wording.

---

## 5. Checklist: 20 Actionable Items for Danish Cookie Compliance

Based on the ePrivacy Directive, Danish Cookie Order, GDPR, and guidance from Erhvervsstyrelsen/Datatilsynet.

### Category 1: Cookie Banner & Consent Mechanism
1. **Implement a cookie consent banner with granular controls** – Display a banner that allows users to accept/reject cookies by category before non‑essential cookies are set.
2. **Provide equal‑prominence “Accept” and “Reject” buttons** – Do not design the banner to nudge users toward acceptance; reject must be as easy as accept.
3. **Include a persistent “Cookie Settings” link** – Place a visible link in the footer (or equivalent) that re‑opens the consent interface for changes.
4. **Block non‑essential cookies before consent** – Ensure analytics, marketing, and functional cookies are not set until affirmative consent is obtained.
5. **Avoid pre‑ticked boxes and dark patterns** – All non‑essential categories must be unchecked by default; no misleading wording or design.

### Category 2: Cookie Inventory & Classification
6. **Categorise all cookies and tracking technologies** – Audit and classify every cookie/tracker into necessary, functional, analytics, and marketing categories.
7. **Maintain a cookie register/inventory** – Keep an up‑to‑date register of all cookies (name, provider, purpose, category, duration, first/third party).
8. **Review third‑party cookies and tracking technologies** – Inventory all third‑party scripts (analytics, ads, social widgets) and ensure each has a lawful basis.
9. **Conduct regular cookie audits** – Perform automated monthly scans to detect new/undocumented cookies; update the register accordingly.

### Category 3: Consent Management & Documentation
10. **Obtain explicit consent before setting non‑essential cookies** – Consent must be affirmative (click, toggle) and recorded before any non‑necessary cookie is placed.
11. **Document cookie consent records** – Store evidence of consent (timestamp, anonymised user ID, consent version, categories consented to) for the duration of processing.
12. **Provide mechanism to withdraw cookie consent** – Allow users to change or withdraw consent as easily as they gave it; withdrawal must delete the relevant cookies.
13. **Implement server‑side consent verification** – Verify consent status server‑side before processing data collected via cookies; do not rely solely on client‑side checks.

### Category 4: Policy & Transparency
14. **Publish a comprehensive cookie policy** – Explain what cookies are used, why, how long they last, and how users can control them. Use plain language.
15. **Include cookie information in privacy notice** – Integrate cookie details into the GDPR privacy notice (Articles 13‑14).
16. **Update cookie policy with clear descriptions** – Regularly review and update the policy to reflect current cookie usage.

### Category 5: Email & Telemarketing Compliance
17. **Implement consent for email marketing (opt‑in)** – Electronic direct marketing to individuals requires prior opt‑in consent under ePrivacy and Markedsføringsloven; use double opt‑in.
18. **Comply with telephone marketing restrictions** – Respect the Danish Robinson list and do‑not‑call rules; maintain an internal do‑not‑call list.

### Category 6: Training & Governance
19. **Train marketing team on ePrivacy requirements** – Ensure marketing/digital teams understand cookie consent, email opt‑in rules, and telemarketing restrictions.
20. **Conduct annual cookie compliance review** – Assess cookie banner functionality, consent records, third‑party scripts, and policy updates; document findings.

---

## 6. Sources & Further Reading

- **Danish Cookie Order (Cookiebekendtgørelsen)**: BEK nr 1148 af 09/12/2011 – https://www.retsinformation.dk/eli/lta/2011/1148
- **Erhvervsstyrelsen cookie guidance**: https://erhvervsstyrelsen.dk/cookies
- **Datatilsynet cookie guidance**: https://www.datatilsynet.dk/english/cookies
- **EU ePrivacy Directive**: Directive 2002/58/EC – https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=CELEX%3A32002L0058
- **GDPR (consent requirements)**: Articles 4(11), 6, 7, 8 – https://eur-lex.europa.eu/eli/reg/2016/679/oj
- **CJEU Planet49 ruling** (C‑673/17) on pre‑ticked boxes and consent.
- **Danish Consumer Council (Forbrugerrådet)** cookie reports.

---

**Prepared by:** Dwight (assigned to CPLY-007)
**Date:** 2026-04-13
**Next steps:** Integrate checklist items into EUComply AI templates and compliance workflows.