-- EUComply Regulation Seed Data
-- Applied via Supabase MCP: seed_regulations (20260412131522)
-- 10 EU/DK regulations with applicability_criteria JSONB

INSERT INTO regulations (slug, name, short_name, description, authority, regulation_type, effective_date, enforcement_date, applicability_criteria, risk_level, max_fine_description, official_url, display_order)
VALUES

-- 1. GDPR
('gdpr',
 'General Data Protection Regulation (EU) 2016/679',
 'GDPR',
 'EU-wide data protection regulation governing the processing of personal data. Applies to any organisation processing personal data of EU residents.',
 'Datatilsynet', 'eu_regulation', '2018-05-25', '2018-05-25',
 '{"default_applicable":true,"requires_personal_data_processing":true,"requires_digital_services":false,"requires_ai_systems":false,"requires_payment_processing":false,"requires_financial_services":false,"requires_critical_infrastructure":false,"requires_employees":false,"min_employees":0,"sectors":[],"description_en":"Applies to all organisations that process personal data of individuals in the EU/EEA","description_da":"Gælder for alle organisationer der behandler personoplysninger om personer i EU/EØS"}'::jsonb,
 'critical',
 'Up to EUR 20 million or 4% of global annual turnover, whichever is higher',
 'https://eur-lex.europa.eu/eli/reg/2016/679/oj', 1),

-- 2. Databeskyttelsesloven
('databeskyttelsesloven',
 'Databeskyttelsesloven (Danish Data Protection Act, Act No. 502 of 23 May 2018)',
 'Databeskyttelsesloven',
 'Danish national implementation of GDPR with additional provisions on CPR numbers, criminal data, age of consent (13), and Datatilsynet enforcement.',
 'Datatilsynet', 'dk_law', '2018-05-25', '2018-05-25',
 '{"default_applicable":true,"requires_personal_data_processing":true,"requires_digital_services":false,"requires_ai_systems":false,"requires_payment_processing":false,"requires_financial_services":false,"requires_critical_infrastructure":false,"requires_employees":false,"min_employees":0,"sectors":[],"description_en":"Applies to all organisations processing personal data in Denmark — supplements GDPR with Danish-specific rules","description_da":"Gælder for alle organisationer der behandler personoplysninger i Danmark — supplerer GDPR med danske regler"}'::jsonb,
 'critical',
 'Fines determined by Datatilsynet; criminal penalties possible under Danish law',
 'https://www.retsinformation.dk/eli/lta/2018/502', 2),

-- 3. ePrivacy / Cookies
('eprivacy',
 'ePrivacy Directive 2002/58/EC & Danish Cookie Order (BEK nr 1148 of 09/12/2011)',
 'ePrivacy / Cookies',
 'Rules on electronic communications privacy: cookie consent, email marketing opt-in, and telemarketing restrictions.',
 'Datatilsynet', 'eu_directive', '2011-12-09', '2011-12-09',
 '{"default_applicable":false,"requires_personal_data_processing":false,"requires_digital_services":true,"requires_ai_systems":false,"requires_payment_processing":false,"requires_financial_services":false,"requires_critical_infrastructure":false,"requires_employees":false,"min_employees":0,"sectors":[],"description_en":"Applies to organisations operating websites, apps, or digital services that use cookies or electronic marketing","description_da":"Gælder for organisationer der driver hjemmesider, apps eller digitale tjenester med cookies eller elektronisk markedsføring"}'::jsonb,
 'high',
 'Fines per GDPR framework; Datatilsynet enforcement actions',
 'https://eur-lex.europa.eu/legal-content/EN/ALL/?uri=CELEX%3A32002L0058', 3),

-- 4. NIS2
('nis2',
 'Directive (EU) 2022/2555 on measures for a high common level of cybersecurity (NIS2)',
 'NIS2',
 'EU cybersecurity directive requiring essential and important entities to implement risk management measures and incident reporting. Management can be held personally liable.',
 'Center for Cybersikkerhed (CFCS)', 'eu_directive', '2023-01-16', '2024-10-17',
 '{"default_applicable":false,"requires_personal_data_processing":false,"requires_digital_services":false,"requires_ai_systems":false,"requires_payment_processing":false,"requires_financial_services":false,"requires_critical_infrastructure":true,"requires_employees":true,"min_employees":50,"sectors":["energy","transport","banking","financial_market","health","water","digital_infrastructure","ict_services","public_admin","space","postal","waste","chemicals","food","manufacturing","digital_providers"],"description_en":"Applies to medium and large entities in essential/important sectors (energy, transport, health, digital infrastructure, etc.) with 50+ employees or EUR 10M+ turnover","description_da":"Gælder for mellemstore og store enheder i væsentlige/vigtige sektorer (energi, transport, sundhed, digital infrastruktur mv.) med 50+ ansatte eller EUR 10M+ omsætning"}'::jsonb,
 'critical',
 'Up to EUR 10 million or 2% of global annual turnover for essential entities; EUR 7 million or 1.4% for important entities. Personal liability for management.',
 'https://eur-lex.europa.eu/eli/dir/2022/2555/oj', 4),

-- 5. EU AI Act
('ai_act',
 'Regulation (EU) 2024/1689 laying down harmonised rules on artificial intelligence (AI Act)',
 'EU AI Act',
 'Comprehensive AI regulation classifying AI systems by risk level. Prohibits certain AI practices, imposes strict requirements on high-risk systems, and mandates transparency for all AI.',
 'Erhvervsstyrelsen', 'eu_regulation', '2024-08-01', '2026-08-02',
 '{"default_applicable":false,"requires_personal_data_processing":false,"requires_digital_services":false,"requires_ai_systems":true,"requires_payment_processing":false,"requires_financial_services":false,"requires_critical_infrastructure":false,"requires_employees":false,"min_employees":0,"sectors":[],"description_en":"Applies to organisations that develop, deploy, or use AI systems within the EU. Phased enforcement: prohibited practices Feb 2025, high-risk Aug 2026.","description_da":"Gælder for organisationer der udvikler, udbyder eller anvender AI-systemer i EU. Trinvis håndhævelse: forbudte praksisser feb 2025, højrisiko aug 2026."}'::jsonb,
 'high',
 'Up to EUR 35 million or 7% of global annual turnover for prohibited AI; EUR 15 million or 3% for high-risk violations',
 'https://eur-lex.europa.eu/eli/reg/2024/1689/oj', 5),

-- 6. Bogforingsloven
('bogfoeringsloven',
 'Bogføringsloven (Danish Bookkeeping Act, Act No. 700 of 24 May 2022)',
 'Bogføringsloven',
 'Requires Danish businesses to use approved digital bookkeeping systems, maintain 5-year digital records, and support standard export formats (SAF-T DK).',
 'Erhvervsstyrelsen', 'dk_law', '2022-07-01', '2024-07-01',
 '{"default_applicable":true,"requires_personal_data_processing":false,"requires_digital_services":false,"requires_ai_systems":false,"requires_payment_processing":false,"requires_financial_services":false,"requires_critical_infrastructure":false,"requires_employees":false,"min_employees":0,"sectors":[],"description_en":"Applies to all businesses registered in Denmark that are required to maintain bookkeeping records","description_da":"Gælder for alle virksomheder registreret i Danmark der er bogføringspligtige"}'::jsonb,
 'medium',
 'Fines and potential criminal liability for non-compliance; Erhvervsstyrelsen can issue orders',
 'https://www.retsinformation.dk/eli/lta/2022/700', 6),

-- 7. Hvidvaskloven (AML)
('hvidvaskloven',
 'Hvidvaskloven (Danish Anti-Money Laundering Act, consolidated Act No. 316 of 11 March 2022)',
 'Hvidvaskloven',
 'Anti-money laundering obligations including customer due diligence (KYC), suspicious transaction reporting, and record-keeping for obligated entities.',
 'Finanstilsynet', 'dk_law', '2017-06-26', '2020-01-10',
 '{"default_applicable":false,"requires_personal_data_processing":false,"requires_digital_services":false,"requires_ai_systems":false,"requires_payment_processing":false,"requires_financial_services":true,"requires_critical_infrastructure":false,"requires_employees":false,"min_employees":0,"sectors":["finance","banking","insurance","real_estate","legal","accounting","gambling"],"description_en":"Applies to obligated entities: banks, payment providers, insurers, real estate agents, lawyers, accountants, and other designated businesses","description_da":"Gælder for forpligtede enheder: banker, betalingsudbydere, forsikringsselskaber, ejendomsmæglere, advokater, revisorer og andre udpegede virksomheder"}'::jsonb,
 'critical',
 'Significant fines from Finanstilsynet; criminal prosecution possible',
 'https://www.retsinformation.dk/eli/lta/2022/316', 7),

-- 8. Whistleblower Act
('whistleblower',
 'Lov om beskyttelse af whistleblowere (Danish Whistleblower Protection Act, Act No. 1436 of 29 June 2021)',
 'Whistleblower Act',
 'Requires organisations with 50+ employees to establish internal reporting channels and protect whistleblowers from retaliation.',
 'Justitsministeriet', 'dk_law', '2021-12-17', '2023-12-17',
 '{"default_applicable":false,"requires_personal_data_processing":false,"requires_digital_services":false,"requires_ai_systems":false,"requires_payment_processing":false,"requires_financial_services":false,"requires_critical_infrastructure":false,"requires_employees":true,"min_employees":50,"sectors":[],"description_en":"Mandatory for organisations with 50 or more employees. Entities in financial services sector are covered regardless of size.","description_da":"Obligatorisk for organisationer med 50 eller flere ansatte. Enheder i den finansielle sektor er omfattet uanset størrelse."}'::jsonb,
 'medium',
 'Fines for failure to establish reporting channels; compensation for retaliation against whistleblowers',
 'https://www.retsinformation.dk/eli/lta/2021/1436', 8),

-- 9. PSD2
('psd2',
 'Directive (EU) 2015/2366 on payment services (PSD2) & Danish Payment Services Act',
 'PSD2',
 'Payment services regulation requiring Strong Customer Authentication, secure APIs for third-party access, and fraud monitoring for payment service providers.',
 'Finanstilsynet', 'eu_directive', '2018-01-13', '2019-09-14',
 '{"default_applicable":false,"requires_personal_data_processing":false,"requires_digital_services":false,"requires_ai_systems":false,"requires_payment_processing":true,"requires_financial_services":false,"requires_critical_infrastructure":false,"requires_employees":false,"min_employees":0,"sectors":["finance","banking","fintech","payments"],"description_en":"Applies to payment service providers, banks, fintechs, and businesses offering payment initiation or account information services","description_da":"Gælder for betalingstjenesteudbydere, banker, fintechs og virksomheder der tilbyder betalingsiniterings- eller kontoinformationstjenester"}'::jsonb,
 'high',
 'Fines and license revocation by Finanstilsynet',
 'https://eur-lex.europa.eu/eli/dir/2015/2366/oj', 9),

-- 10. DORA
('dora',
 'Regulation (EU) 2022/2554 on digital operational resilience for the financial sector (DORA)',
 'DORA',
 'ICT risk management framework for financial entities covering incident reporting, resilience testing, third-party risk oversight, and threat intelligence sharing.',
 'Finanstilsynet', 'eu_regulation', '2023-01-16', '2025-01-17',
 '{"default_applicable":false,"requires_personal_data_processing":false,"requires_digital_services":false,"requires_ai_systems":false,"requires_payment_processing":false,"requires_financial_services":true,"requires_critical_infrastructure":false,"requires_employees":false,"min_employees":0,"sectors":["finance","banking","insurance","investment","crypto","fintech"],"description_en":"Applies to financial entities: banks, insurers, investment firms, crypto-asset providers, and their critical ICT third-party service providers","description_da":"Gælder for finansielle enheder: banker, forsikringsselskaber, investeringsselskaber, kryptoaktivudbydere og deres kritiske IKT-tredjepartsleverandører"}'::jsonb,
 'high',
 'Fines determined by Finanstilsynet; periodic penalty payments up to 1% of average daily global turnover',
 'https://eur-lex.europa.eu/eli/reg/2022/2554/oj', 10);
