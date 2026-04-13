/**
 * NIS2 Directive prompt context
 *
 * EU 2022/2555 — Network and Information Security Directive (recast).
 * Danish transposition via Lov om foranstaltninger til sikring af et højt
 * cybersikkerhedsniveau (expected 2024/2025).
 */

export const nis2Prompt = `
## Regulation Context: NIS2 (Network and Information Security Directive)

### Overview
NIS2 (EU 2022/2555) significantly expands the scope of EU cybersecurity regulation. It replaces the original NIS Directive and brings many more sectors and entities into scope. Member states were required to transpose by 17 October 2024. Denmark's transposition is handled via sector-specific legislation coordinated by CFCS (Center for Cybersikkerhed).

### Scope — Who is affected?
NIS2 distinguishes between **essential entities** and **important entities**:

**Essential entities (stricter obligations):**
- Energy (electricity, district heating, oil, gas, hydrogen)
- Transport (air, rail, water, road)
- Banking and financial market infrastructure
- Health sector (hospitals, labs, pharma, medical devices)
- Drinking water supply and distribution
- Digital infrastructure (IXPs, DNS, TLD registries, cloud providers, data centres, CDNs)
- ICT service management (B2B — managed service providers, managed security service providers)
- Public administration
- Space

**Important entities (same obligations, lighter enforcement):**
- Postal and courier services
- Waste management
- Chemicals manufacturing/distribution
- Food production/distribution
- Manufacturing (medical devices, electronics, machinery, motor vehicles)
- Digital providers (online marketplaces, search engines, social networks)
- Research organisations

**Size thresholds:**
- Generally: medium enterprises (50+ employees OR €10M+ turnover) and large enterprises
- BUT: some entities are in scope regardless of size (DNS providers, TLD registries, qualified trust services, public electronic communications networks)

### Key Obligations
1. **Risk management measures (Art. 21):**
   - Risk analysis and information system security policies
   - Incident handling procedures
   - Business continuity and crisis management
   - Supply chain security
   - Security in network/system acquisition, development, maintenance
   - Vulnerability handling and disclosure
   - Cybersecurity testing and auditing
   - Cryptography and encryption policies
   - HR security, access control, asset management
   - Multi-factor authentication and secure communications

2. **Incident reporting (Art. 23):**
   - **Early warning:** Within 24 hours of becoming aware of a significant incident
   - **Incident notification:** Within 72 hours with initial assessment
   - **Final report:** Within 1 month with detailed description, root cause, mitigation

3. **Management body accountability (Art. 20):**
   - Management must approve cybersecurity risk measures
   - Management must oversee implementation
   - Management must undergo cybersecurity training
   - **Personal liability** for management members who fail to ensure compliance

4. **Supply chain security:**
   - Assess risks of direct suppliers and service providers
   - Include cybersecurity requirements in contracts

### Penalties
- **Essential entities:** Up to €10M or 2% of global annual turnover
- **Important entities:** Up to €7M or 1.4% of global annual turnover
- **Personal liability:** Management can be temporarily suspended; personal fines possible
- **Public naming:** Authorities can publish non-compliance decisions

### Danish Context
- **CFCS (Center for Cybersikkerhed)** under Forsvarsministeriet coordinates national cybersecurity
- Sector-specific authorities handle enforcement in their domains (Energistyrelsen for energy, etc.)
- **Sikkerhedsstyrelsen** may handle certain sectors
- Denmark already had robust cybersecurity culture in critical infrastructure; NIS2 expands to medium businesses
- **Danish Defence Intelligence Service** involvement in threat assessments
- Cross-reference with ISO 27001 — many Danish companies already certified; NIS2 aligns well

### Practical SMB Guidance
- **Determine if you're in scope** — many companies are surprised to fall under NIS2 (especially IT service providers, SaaS companies serving essential entities, food producers)
- **Start with ISO 27001** — if not certified, use the framework to structure your approach; the overlap with NIS2 Art. 21 is ~80%
- **Document your supply chain** — who are your critical ICT suppliers? Cloud providers, hosting, security tools
- **Incident response plan** — 24-hour early warning is very tight; have templates and contacts ready
- **Board-level training** — management liability is personal; directors need to understand cybersecurity basics
- **Multi-factor authentication** — implement across all systems immediately; it's a specific NIS2 requirement
- **Register with authorities** — in-scope entities must register with the relevant national authority
`;
