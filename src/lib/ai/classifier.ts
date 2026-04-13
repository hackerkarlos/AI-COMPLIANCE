import type { Tool } from "@anthropic-ai/sdk/resources/messages";
import {
  getAnthropicClient,
  MODELS,
  DEFAULT_TEMPERATURE,
  MAX_TOKENS_CLASSIFY,
} from "./client";
import type { Company } from "@/types/assessment";

// ─── Tool definition for structured output ───────────────────

const classifyRegulationsTool: Tool = {
  name: "classify_regulations",
  description:
    "Return which EU/DK regulations apply to a company, with confidence scores and reasoning.",
  input_schema: {
    type: "object" as const,
    properties: {
      classifications: {
        type: "array",
        description: "One entry per regulation assessed",
        items: {
          type: "object",
          properties: {
            regulation_slug: {
              type: "string",
              description:
                "Slug identifier: gdpr, databeskyttelsesloven, eprivacy, nis2, ai_act, bogfoeringsloven, hvidvaskloven, whistleblower, psd2, dora",
            },
            applies: {
              type: "boolean",
              description: "Whether this regulation applies to the company",
            },
            confidence: {
              type: "number",
              description: "Confidence score 0.0–1.0",
            },
            reason: {
              type: "string",
              description:
                "Brief explanation of why the regulation does or does not apply",
            },
            risk_level: {
              type: "string",
              enum: ["low", "medium", "high", "critical"],
              description:
                "Risk level if applicable (how serious non-compliance would be)",
            },
          },
          required: [
            "regulation_slug",
            "applies",
            "confidence",
            "reason",
            "risk_level",
          ],
        },
      },
      summary: {
        type: "string",
        description:
          "One-paragraph executive summary of the company's regulatory landscape",
      },
    },
    required: ["classifications", "summary"],
  },
};

// ─── Types ───────────────────────────────────────────────────

export interface RegulationClassification {
  regulation_slug: string;
  applies: boolean;
  confidence: number;
  reason: string;
  risk_level: "low" | "medium" | "high" | "critical";
}

export interface ClassificationResult {
  classifications: RegulationClassification[];
  summary: string;
}

// ─── System prompt ───────────────────────────────────────────

function buildClassificationSystemPrompt(): string {
  return `You are an expert EU and Danish regulatory compliance analyst. Your task is to classify which regulations apply to a Danish company based on its profile.

You must evaluate ALL 10 regulations below and provide a classification for each:

1. **GDPR** (EU 2016/679) — Applies to virtually all companies processing personal data. Enforced by Datatilsynet.
2. **Databeskyttelsesloven** — Denmark's national supplement to GDPR. Applies when GDPR applies, adds DK-specific rules (CPR numbers, children, employment).
3. **ePrivacy / Cookie rules** — Cookie consent, email marketing, electronic communications. Applies to any company with a website or app.
4. **NIS2** (EU 2022/2555) — Cybersecurity obligations for essential/important entities. Sectors: energy, transport, health, digital infrastructure, ICT services, etc. DK transposed into law. Personal liability for management.
5. **EU AI Act** (EU 2024/1689) — Applies to providers/deployers of AI systems. Risk-based. Full enforcement Aug 2026, but prohibited practices already banned.
6. **Bogføringsloven** — Danish Bookkeeping Act. ALL Danish businesses must comply. Digital bookkeeping requirement phased in: companies with >DKK 300k turnover by Jan 2025, rest by Jan 2026.
7. **Hvidvaskloven** (AML) — Anti-money laundering. Primarily financial sector, accountants, lawyers, estate agents, crypto providers.
8. **Whistleblower Act** (DK implementation of EU 2019/1937) — Companies with 50+ employees must have internal whistleblower scheme.
9. **PSD2** (EU 2015/2366) — Payment Services Directive. Only for payment service providers, banks, and companies initiating/processing payments as a service.
10. **DORA** (EU 2022/2554) — Digital Operational Resilience Act. Financial entities and their critical ICT service providers. Effective Jan 2025.

Danish context:
- Datatilsynet enforces GDPR/Databeskyttelsesloven; fines have historically been moderate but increasing
- Erhvervsstyrelsen enforces Bogføringsloven; digital bookkeeping mandate is actively enforced
- CFCS (Center for Cybersikkerhed) assists with NIS2 implementation
- Most Danish SMBs (under 250 employees) still fall under GDPR, ePrivacy, Bogføringsloven at minimum

Be precise about edge cases. A 3-person startup still needs GDPR compliance if they handle personal data. Bogføringsloven applies to ALL companies. Consider the company's sector, size, and activities carefully.`;
}

// ─── Main classifier function ────────────────────────────────

export async function classifyRegulations(
  company: Company
): Promise<ClassificationResult> {
  const client = getAnthropicClient();

  const companyDescription = formatCompanyProfile(company);

  const response = await client.messages.create({
    model: MODELS.HAIKU,
    max_tokens: MAX_TOKENS_CLASSIFY,
    temperature: DEFAULT_TEMPERATURE,
    system: buildClassificationSystemPrompt(),
    tools: [classifyRegulationsTool],
    tool_choice: { type: "tool", name: "classify_regulations" },
    messages: [
      {
        role: "user",
        content: `Classify which regulations apply to this Danish company:\n\n${companyDescription}\n\nEvaluate all 10 regulations and provide your classification.`,
      },
    ],
  });

  // Extract structured tool_use output
  const toolUseBlock = response.content.find(
    (block) => block.type === "tool_use"
  );
  if (!toolUseBlock || toolUseBlock.type !== "tool_use") {
    throw new Error("Classifier did not return structured tool_use output");
  }

  const result = toolUseBlock.input as ClassificationResult;
  return result;
}

// ─── Helpers ─────────────────────────────────────────────────

function formatCompanyProfile(company: Company): string {
  const lines: string[] = [
    `Company name: ${company.name}`,
    company.cvr_number ? `CVR: ${company.cvr_number}` : null,
    `Industry sector: ${company.industry_sector ?? "Not specified"}`,
    `Size: ${company.company_size ?? "Not specified"}`,
    `Employees: ${company.employee_count ?? "Not specified"}`,
    company.annual_turnover_eur
      ? `Annual turnover: €${company.annual_turnover_eur.toLocaleString()}`
      : null,
    `Country: ${company.country}`,
    company.city ? `City: ${company.city}` : null,
    "",
    "--- Applicability flags ---",
    `Processes personal data: ${company.processes_personal_data}`,
    `Processes special categories of data: ${company.processes_special_categories}`,
    `Operates online (website/app): ${company.operates_online}`,
    `Uses AI systems: ${company.uses_ai_systems}`,
    `Processes payments: ${company.processes_payments}`,
    `Is financial entity: ${company.is_financial_entity}`,
    `Has critical infrastructure: ${company.has_critical_infrastructure}`,
    `Has employees: ${company.has_employees}`,
  ];

  return lines.filter(Boolean).join("\n");
}
