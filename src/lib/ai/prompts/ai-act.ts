/**
 * EU AI Act prompt context
 *
 * Regulation (EU) 2024/1689 — laying down harmonised rules on artificial intelligence.
 * Entered into force 1 August 2024. Phased enforcement timeline.
 */

export const aiActPrompt = `
## Regulation Context: EU AI Act (Regulation 2024/1689)

### Overview
The EU AI Act is the world's first comprehensive AI regulation. It adopts a **risk-based approach**: obligations scale with the risk level of the AI system. It applies to providers placing AI systems on the EU market, importers, distributors, and deployers (users of AI systems in a professional context).

### Who is affected?
- **Providers** — develop and place AI systems on the market (including for own use)
- **Deployers** — use AI systems in a professional context (not private use)
- **Importers/Distributors** — for non-EU providers' systems
- Applies even if the provider is outside the EU, if output is used in the EU

### Risk Categories

**1. Unacceptable Risk — PROHIBITED (Art. 5)**
Effective from 2 February 2025. Already in force. Prohibited AI practices include:
- Subliminal manipulation techniques affecting behaviour without awareness
- Exploitation of vulnerabilities (age, disability, social/economic situation)
- Social scoring by public authorities
- Real-time biometric identification in public spaces (with narrow exceptions)
- Emotion recognition in workplaces and educational institutions
- Biometric categorisation to infer sensitive attributes (race, political opinion, sexual orientation)
- Scraping facial images from internet/CCTV to build recognition databases
- Predictive policing based solely on profiling
Any AI system falling into these categories must be discontinued immediately.

**2. High-Risk AI Systems — STRICT OBLIGATIONS (Annex III)**
Effective from 2 August 2026 for most. High-risk systems include:
- Biometric identification and categorisation (remote biometric ID, emotion recognition in work/education)
- Safety components of critical infrastructure (electricity, water, transport)
- Educational/vocational training (admissions, assessments, monitoring)
- Employment and worker management (recruitment, performance evaluation, task allocation, termination)
- Access to essential services (creditworthiness assessment, insurance pricing, benefits eligibility)
- Law enforcement (crime risk assessment, lie detection, profiling)
- Migration and asylum management (risk assessment, processing applications)
- Justice administration (predicting judicial outcomes)
- Medical devices with AI components regulated under MDR/IVDR

**High-risk obligations (provider):**
- Risk management system (continuous throughout lifecycle)
- Data governance and quality management
- Technical documentation
- Record-keeping (automatic event logging)
- Transparency and provision of information to deployers
- Human oversight design
- Accuracy, robustness, cybersecurity
- Conformity assessment before market placement
- CE marking and EU declaration of conformity
- Registration in EU database

**High-risk obligations (deployer/user):**
- Use in accordance with instructions for use
- Ensure human oversight by qualified personnel
- Monitor operation and report incidents
- Conduct Data Protection Impact Assessment (DPIA) where applicable

**3. Limited-Risk — TRANSPARENCY OBLIGATIONS (Arts. 50-52)**
Effective from 2 August 2026:
- **Chatbots/conversational AI:** Must inform users they are interacting with AI
- **Deepfakes:** Must label as AI-generated content
- **Emotion recognition:** Inform persons being assessed
- **Biometric categorisation:** Inform persons being categorised

**4. Minimal Risk — No mandatory obligations**
Spam filters, AI in video games, most productivity tools. Providers encouraged to adhere to voluntary codes of conduct.

### General Purpose AI (GPAI) Models (Art. 51-55)
- Models trained on broad data at scale with significant capabilities (e.g. GPT-4, Claude)
- Must provide technical documentation, copyright compliance policy, training data summary
- **Systemic risk GPAI** (large-scale, high-impact): additional requirements including adversarial testing, incident reporting, cybersecurity measures
- Applies to GPAI providers — deployers of GPAI APIs must still comply with deployer obligations

### Enforcement Timeline

| Date | What takes effect |
|------|-------------------|
| 1 August 2024 | Regulation enters into force |
| 2 February 2025 | **Prohibited AI practices** (Art. 5) apply — these are already banned |
| 2 August 2025 | Rules on GPAI models (Arts. 51-55) apply; governance bodies established |
| 2 August 2026 | **High-risk AI** obligations (Annex III) fully apply; transparency rules (Art. 50) |
| 2 August 2027 | High-risk AI embedded in regulated products (Annex I) — e.g. medical devices, machinery |

### Penalties
- Prohibited AI practices: up to €35M or 7% of global annual turnover (higher of the two)
- High-risk non-compliance: up to €15M or 3% of global annual turnover
- Incorrect information to authorities: up to €7.5M or 1.5% of turnover
- SMEs/startups: reduced caps apply

### Danish Context
- **Erhvervsstyrelsen** (Danish Business Authority) is designated as coordinating authority
- AI Office at EU level (under European Commission) coordinates across member states
- Denmark has a **National AI Strategy** — pragmatic, innovation-friendly approach expected
- **Datatilsynet** remains responsible for AI systems processing personal data (GDPR intersection)
- Danish companies embedding AI in HR, recruitment, or employee monitoring face compounding GDPR + AI Act obligations
- The AI Act intersects with Danish employment law for workplace AI (tillidsrepræsentant notification for monitoring tools)

### Key compliance steps for Danish SMBs

**Immediate (now — prohibited practices):**
- Audit any AI systems for prohibited use cases — social scoring, manipulation, biometric surveillance
- Discontinue any such systems immediately

**Pre-August 2026 (high-risk):**
- Inventory all AI systems in use (as provider or deployer)
- Classify each by risk category using Annex I and III
- For high-risk: implement risk management, data governance, technical documentation, logging
- For deployer: ensure human oversight mechanisms exist

**Transparency (chatbots, deepfakes, emotion recognition):**
- Label AI-generated content
- Disclose AI nature in conversational interfaces
- Inform employees about emotion recognition or biometric systems

**Practical SMB guidance:**
- AI in recruitment tools (CV screening, candidate ranking) is high-risk — requires human review before any employment decision
- AI-powered credit decisions are high-risk — need human oversight and clear appeals process
- Customer service chatbots: disclose as AI (limited risk — transparency only)
- Using off-the-shelf AI tools (Microsoft Copilot, ChatGPT for drafting): minimal risk as deployer, but check if repurposed for high-risk tasks
- GPAI API use (Claude, GPT-4): provider (Anthropic/OpenAI) handles GPAI obligations; you handle deployer obligations
`;
