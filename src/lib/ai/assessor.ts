import type { Tool } from "@anthropic-ai/sdk/resources/messages";
import {
  getAnthropicClient,
  MODELS,
  DEFAULT_TEMPERATURE,
  MAX_TOKENS_ASSESS,
} from "./client";
import type { Company, ChecklistItem, Regulation } from "@/types/assessment";
import { getPromptForRegulation } from "./prompts";

// ─── Tool definition for structured output ───────────────────

const assessComplianceTool: Tool = {
  name: "assess_compliance",
  description:
    "Return a detailed compliance assessment for a company against a specific regulation.",
  input_schema: {
    type: "object" as const,
    properties: {
      overall_score: {
        type: "number",
        description:
          "Overall compliance score 0–100, where 100 is fully compliant",
      },
      risk_level: {
        type: "string",
        enum: ["minimal", "low", "medium", "high", "critical"],
        description: "Overall risk level based on compliance gaps",
      },
      executive_summary: {
        type: "string",
        description:
          "2-3 paragraph executive summary of compliance status, key risks, and priorities",
      },
      checklist_assessments: {
        type: "array",
        description: "Assessment for each checklist item",
        items: {
          type: "object",
          properties: {
            checklist_item_code: {
              type: "string",
              description: "The code of the checklist item being assessed",
            },
            status: {
              type: "string",
              enum: [
                "likely_compliant",
                "partially_compliant",
                "likely_non_compliant",
                "unknown",
                "not_applicable",
              ],
              description: "Assessed compliance status for this item",
            },
            confidence: {
              type: "number",
              description: "Confidence in this assessment 0.0–1.0",
            },
            finding: {
              type: "string",
              description:
                "What was found or inferred about the company's current state for this item",
            },
            recommendation: {
              type: "string",
              description:
                "Specific, actionable recommendation for this item — practical for an SMB",
            },
            priority: {
              type: "string",
              enum: ["critical", "high", "medium", "low"],
              description: "Priority for addressing this item",
            },
            effort_estimate: {
              type: "string",
              description:
                "Estimated effort to remediate (e.g., '2-4 hours', '1-2 weeks', 'ongoing')",
            },
          },
          required: [
            "checklist_item_code",
            "status",
            "confidence",
            "finding",
            "recommendation",
            "priority",
            "effort_estimate",
          ],
        },
      },
      top_recommendations: {
        type: "array",
        description:
          "Top 3-5 prioritized recommendations, most urgent first",
        items: {
          type: "object",
          properties: {
            title: {
              type: "string",
              description: "Short title for the recommendation",
            },
            description: {
              type: "string",
              description: "Detailed description and rationale",
            },
            priority: {
              type: "string",
              enum: ["critical", "high", "medium", "low"],
            },
            timeline: {
              type: "string",
              description:
                "Suggested timeline (e.g., 'Immediately', 'Within 30 days', 'Within 90 days')",
            },
          },
          required: ["title", "description", "priority", "timeline"],
        },
      },
      penalties_exposure: {
        type: "string",
        description:
          "Description of potential penalties/fines for non-compliance with this regulation",
      },
      danish_specific_notes: {
        type: "string",
        description:
          "Any Denmark-specific enforcement context, authority guidance, or local considerations",
      },
    },
    required: [
      "overall_score",
      "risk_level",
      "executive_summary",
      "checklist_assessments",
      "top_recommendations",
      "penalties_exposure",
      "danish_specific_notes",
    ],
  },
};

// ─── Types ───────────────────────────────────────────────────

export interface ChecklistAssessment {
  checklist_item_code: string;
  status:
    | "likely_compliant"
    | "partially_compliant"
    | "likely_non_compliant"
    | "unknown"
    | "not_applicable";
  confidence: number;
  finding: string;
  recommendation: string;
  priority: "critical" | "high" | "medium" | "low";
  effort_estimate: string;
}

export interface TopRecommendation {
  title: string;
  description: string;
  priority: "critical" | "high" | "medium" | "low";
  timeline: string;
}

export interface AssessmentResult {
  overall_score: number;
  risk_level: "minimal" | "low" | "medium" | "high" | "critical";
  executive_summary: string;
  checklist_assessments: ChecklistAssessment[];
  top_recommendations: TopRecommendation[];
  penalties_exposure: string;
  danish_specific_notes: string;
}

// ─── Main assessor function ──────────────────────────────────

export async function assessCompliance(
  company: Company,
  regulation: Regulation,
  checklistItems: ChecklistItem[]
): Promise<AssessmentResult> {
  const client = getAnthropicClient();

  const regulationPrompt = getPromptForRegulation(regulation.slug);
  const companyDescription = formatCompanyForAssessment(company);
  const checklistDescription = formatChecklist(checklistItems);

  const systemPrompt = `You are an expert EU and Danish regulatory compliance assessor. You provide thorough, actionable compliance assessments specifically tailored for Danish SMBs.

${regulationPrompt}

Your assessment must be:
- Specific and actionable — avoid generic advice
- Practical for SMBs — consider limited resources and budgets
- Danish-context-aware — reference Datatilsynet guidance, Danish enforcement practice, local conventions
- Conservative — when in doubt, flag as potentially non-compliant rather than assume compliance
- Prioritized — clearly indicate what to fix first based on risk and effort`;

  const response = await client.messages.create({
    model: MODELS.SONNET,
    max_tokens: MAX_TOKENS_ASSESS,
    temperature: DEFAULT_TEMPERATURE,
    system: systemPrompt,
    tools: [assessComplianceTool],
    tool_choice: { type: "tool", name: "assess_compliance" },
    messages: [
      {
        role: "user",
        content: `Assess this company's compliance with ${regulation.name} (${regulation.slug}).

--- COMPANY PROFILE ---
${companyDescription}

--- REGULATION ---
Name: ${regulation.name}
Type: ${regulation.regulation_type}
Authority: ${regulation.authority ?? "N/A"}
Risk level: ${regulation.risk_level}
Max fine: ${regulation.max_fine_description ?? "N/A"}
Effective: ${regulation.effective_date ?? "N/A"}
Enforcement: ${regulation.enforcement_date ?? "N/A"}

--- CHECKLIST ITEMS TO ASSESS ---
${checklistDescription}

Assess the company against every checklist item. Be specific about findings and recommendations.`,
      },
    ],
  });

  const toolUseBlock = response.content.find(
    (block) => block.type === "tool_use"
  );
  if (!toolUseBlock || toolUseBlock.type !== "tool_use") {
    throw new Error("Assessor did not return structured tool_use output");
  }

  return toolUseBlock.input as AssessmentResult;
}

// ─── Helpers ─────────────────────────────────────────────────

function formatCompanyForAssessment(company: Company): string {
  const lines: (string | null)[] = [
    `Company: ${company.name}`,
    company.cvr_number ? `CVR: ${company.cvr_number}` : null,
    `Sector: ${company.industry_sector ?? "Not specified"}`,
    `Size: ${company.company_size ?? "Not specified"} (${company.employee_count ?? "?"} employees)`,
    company.annual_turnover_eur
      ? `Annual turnover: €${company.annual_turnover_eur.toLocaleString()}`
      : null,
    `Location: ${company.city ?? ""} ${company.postal_code ?? ""}, ${company.country}`.trim(),
    "",
    "Applicability flags:",
    `  Processes personal data: ${company.processes_personal_data}`,
    `  Special category data: ${company.processes_special_categories}`,
    `  Operates online: ${company.operates_online}`,
    `  Uses AI systems: ${company.uses_ai_systems}`,
    `  Processes payments: ${company.processes_payments}`,
    `  Financial entity: ${company.is_financial_entity}`,
    `  Critical infrastructure: ${company.has_critical_infrastructure}`,
    `  Has employees: ${company.has_employees}`,
  ];

  return lines.filter((l) => l !== null).join("\n");
}

function formatChecklist(items: ChecklistItem[]): string {
  return items
    .map(
      (item, i) =>
        `${i + 1}. [${item.code}] ${item.title} (priority: ${item.priority}, effort: ${item.effort_level})${item.description ? `\n   ${item.description}` : ""}`
    )
    .join("\n\n");
}
