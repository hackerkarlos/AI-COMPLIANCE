/**
 * assessor.test.ts — Unit tests for src/lib/ai/assessor.ts
 *
 * Tests:
 * - assessCompliance() with mocked Anthropic client
 * - Structured output parsing from tool_use blocks
 * - Error handling for malformed responses
 * - formatCompanyForAssessment() and formatChecklist() output
 * - Prompt inclusion for regulation-specific context
 */

import {
  describe,
  it,
  expect,
  vi,
  beforeEach,
  afterEach,
} from "vitest";
import {
  assessCompliance,
  type AssessmentResult,
} from "./assessor";
import type { Company, Regulation, ChecklistItem } from "@/types/assessment";

// ─── Mock fixtures ─────────────────────────────────────────────

const testCompany: Company = {
  id: "test-comp-001",
  user_id: "user-001",
  created_at: "2025-01-01T00:00:00Z",
  updated_at: "2025-01-01T00:00:00Z",
  name: "TestCo ApS",
  cvr_number: "11223344",
  industry_sector: "SaaS",
  company_size: "small",
  employee_count: 15,
  annual_turnover_eur: 500000,
  country: "DK",
  city: "Odense",
  postal_code: "5000",
  contact_name: "Test User",
  contact_email: "test@testco.dk",
  processes_personal_data: true,
  processes_special_categories: true,
  operates_online: true,
  uses_ai_systems: false,
  processes_payments: false,
  is_financial_entity: false,
  has_critical_infrastructure: false,
  has_employees: true,
  onboarding_completed: true,
  is_active: true,
};

const gdprRegulation: Regulation = {
  id: "reg-gdpr",
  created_at: "2025-01-01T00:00:00Z",
  updated_at: "2025-01-01T00:00:00Z",
  slug: "gdpr",
  name: "General Data Protection Regulation",
  short_name: "GDPR",
  description: "EU data protection regulation",
  authority: "Datatilsynet",
  regulation_type: "eu_regulation",
  effective_date: "2018-05-25",
  enforcement_date: "2018-05-25",
  applicability_criteria: {
    default_applicable: true,
    sectors: [],
    min_employees: 0,
    requires_personal_data_processing: false,
    requires_digital_services: false,
    requires_payment_processing: false,
    requires_financial_services: false,
    requires_ai_systems: false,
    requires_critical_infrastructure: false,
    requires_employees: false,
    description_en: "Applies to all processing of personal data",
    description_da: "Gælder for al behandling af personoplysninger",
  },
  risk_level: "high",
  max_fine_description: "Up to €20M or 4% of global turnover",
  official_url: "https://gdpr.eu",
  is_active: true,
  display_order: 1,
};

const checklistItems: ChecklistItem[] = [
  {
    id: "item-001",
    regulation_id: "reg-gdpr",
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
    code: "GDPR-001",
    title: "Lawful Basis for Processing",
    description: "Document the lawful basis for each processing activity",
    guidance: "Use Article 6 GDPR as reference",
    category: "Legal Basis",
    priority: "critical",
    effort_level: "moderate",
    display_order: 1,
    is_active: true,
  },
  {
    id: "item-002",
    regulation_id: "reg-gdpr",
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
    code: "GDPR-002",
    title: "Privacy Policy",
    description: "Maintain an up-to-date privacy policy",
    guidance: null,
    category: "Transparency",
    priority: "high",
    effort_level: "minimal",
    display_order: 2,
    is_active: true,
  },
  {
    id: "item-003",
    regulation_id: "reg-gdpr",
    created_at: "2025-01-01T00:00:00Z",
    updated_at: "2025-01-01T00:00:00Z",
    code: "GDPR-003",
    title: "Data Breach Response Plan",
    description: "Have a documented procedure for handling data breaches",
    guidance: "Must be able to notify Datatilsynet within 72 hours",
    category: "Incident Response",
    priority: "critical",
    effort_level: "significant",
    display_order: 3,
    is_active: true,
  },
];

// ─── Mock Anthropic client ─────────────────────────────────────

const mockCreate = vi.fn();

vi.mock("@/lib/ai/client", () => ({
  getAnthropicClient: () => ({
    messages: {
      create: mockCreate,
    },
  }),
  MODELS: {
    HAIKU: "claude-haiku-4-5-20251001",
    SONNET: "claude-sonnet-4-6",
  },
  DEFAULT_TEMPERATURE: 0,
  MAX_TOKENS_CLASSIFY: 256,
  MAX_TOKENS_ASSESS: 4096,
}));

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  vi.restoreAllMocks();
});

// ─── Tests ─────────────────────────────────────────────────────

describe("assessCompliance", () => {
  const mockAssessmentResult: AssessmentResult = {
    overall_score: 45,
    risk_level: "high",
    executive_summary:
      "TestCo ApS has significant gaps in GDPR compliance. While the company processes personal data and special categories, several key obligations are not yet met. Immediate attention is required for the lawful basis documentation and breach response plan.",
    checklist_assessments: [
      {
        checklist_item_code: "GDPR-001",
        status: "likely_non_compliant",
        confidence: 0.8,
        finding:
          "No documented lawful basis was found for the company's data processing activities",
        recommendation:
          "Create a processing register mapping each processing activity to a specific Article 6 lawful basis",
        priority: "critical",
        effort_estimate: "1-2 weeks",
      },
      {
        checklist_item_code: "GDPR-002",
        status: "partially_compliant",
        confidence: 0.7,
        finding:
          "A privacy policy exists but lacks required information about data subject rights",
        recommendation:
          "Update the privacy policy to include all Article 13/14 information requirements, in Danish",
        priority: "high",
        effort_estimate: "2-4 hours",
      },
      {
        checklist_item_code: "GDPR-003",
        status: "likely_non_compliant",
        confidence: 0.9,
        finding:
          "No documented data breach response plan exists",
        recommendation:
          "Create a breach response procedure with a 72-hour notification timeline to Datatilsynet",
        priority: "critical",
        effort_estimate: "1-2 days",
      },
    ],
    top_recommendations: [
      {
        title: "Document Lawful Basis",
        description:
          "Map all personal data processing activities to specific GDPR Article 6 bases",
        priority: "critical",
        timeline: "Immediately",
      },
      {
        title: "Create Breach Response Plan",
        description:
          "Document procedures for detecting, investigating, and reporting data breaches",
        priority: "critical",
        timeline: "Within 30 days",
      },
      {
        title: "Update Privacy Policy",
        description:
          "Ensure privacy policy meets all GDPR Article 13/14 requirements in Danish",
        priority: "high",
        timeline: "Within 30 days",
      },
    ],
    penalties_exposure:
      "GDPR fines up to €20M or 4% of global annual turnover. Danish enforcement by Datatilsynet typically ranges from DKK 50,000 to DKK 1.2M+ for SMBs.",
    danish_specific_notes:
      "In Denmark, Datatilsynet (datatilsynet.dk) enforces GDPR. They have published extensive guidance on consent, cookies, and cloud transfers. Special attention to CPR number processing under Databeskyttelsesloven §11.",
  };

  it("should return a structured assessment result", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [
        {
          type: "tool_use",
          id: "assess-001",
          name: "assess_compliance",
          input: mockAssessmentResult,
        },
      ],
    });

    const result = await assessCompliance(
      testCompany,
      gdprRegulation,
      checklistItems
    );

    expect(result.overall_score).toBe(45);
    expect(result.risk_level).toBe("high");
    expect(result.checklist_assessments).toHaveLength(3);
    expect(result.top_recommendations).toHaveLength(3);
  });

  it("should pass Sonnet model with temperature 0 to the API", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [
        {
          type: "tool_use",
          id: "assess-002",
          name: "assess_compliance",
          input: mockAssessmentResult,
        },
      ],
    });

    await assessCompliance(testCompany, gdprRegulation, checklistItems);

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        model: "claude-sonnet-4-6",
        temperature: 0,
        max_tokens: 4096,
        tool_choice: { type: "tool", name: "assess_compliance" },
      })
    );
  });

  it("should include regulation name in the user message", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [
        {
          type: "tool_use",
          id: "assess-003",
          name: "assess_compliance",
          input: mockAssessmentResult,
        },
      ],
    });

    await assessCompliance(testCompany, gdprRegulation, checklistItems);

    const callArgs = mockCreate.mock.calls[0]?.[0];
    expect(callArgs?.messages?.[0]?.content).toContain(
      "General Data Protection Regulation"
    );
  });

  it("should include regulation slug in the user message", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [
        {
          type: "tool_use",
          id: "assess-004",
          name: "assess_compliance",
          input: mockAssessmentResult,
        },
      ],
    });

    await assessCompliance(testCompany, gdprRegulation, checklistItems);

    const callArgs = mockCreate.mock.calls[0]?.[0];
    expect(callArgs?.messages?.[0]?.content).toContain("gdpr");
  });

  it("should include company name in the assessment request", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [
        {
          type: "tool_use",
          id: "assess-005",
          name: "assess_compliance",
          input: mockAssessmentResult,
        },
      ],
    });

    await assessCompliance(testCompany, gdprRegulation, checklistItems);

    const callArgs = mockCreate.mock.calls[0]?.[0];
    expect(callArgs?.messages?.[0]?.content).toContain("TestCo ApS");
  });

  it("should include the authority in the regulation section", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [
        {
          type: "tool_use",
          id: "assess-006",
          name: "assess_compliance",
          input: mockAssessmentResult,
        },
      ],
    });

    await assessCompliance(testCompany, gdprRegulation, checklistItems);

    const callArgs = mockCreate.mock.calls[0]?.[0];
    expect(callArgs?.messages?.[0]?.content).toContain("Datatilsynet");
  });

  it("should include checklist items in the assessment request", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [
        {
          type: "tool_use",
          id: "assess-007",
          name: "assess_compliance",
          input: mockAssessmentResult,
        },
      ],
    });

    await assessCompliance(testCompany, gdprRegulation, checklistItems);

    const callArgs = mockCreate.mock.calls[0]?.[0];
    const content = callArgs?.messages?.[0]?.content as string;
    expect(content).toContain("GDPR-001");
    expect(content).toContain("Lawful Basis for Processing");
    expect(content).toContain("GDPR-003");
  });

  it("should throw error when assessor does not return tool_use output", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [
        {
          type: "text",
          text: "Here is my assessment in plain text format...",
        },
      ],
    });

    await expect(
      assessCompliance(testCompany, gdprRegulation, checklistItems)
    ).rejects.toThrow("Assessor did not return structured tool_use output");
  });

  it("should throw error when assessor returns empty content array", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [],
    });

    await expect(
      assessCompliance(testCompany, gdprRegulation, checklistItems)
    ).rejects.toThrow("Assessor did not return structured tool_use output");
  });

  it("should handle a compliant assessment result", async () => {
    const compliantResult: AssessmentResult = {
      overall_score: 90,
      risk_level: "minimal",
      executive_summary: "Company is largely compliant with GDPR requirements.",
      checklist_assessments: [
        {
          checklist_item_code: "GDPR-001",
          status: "likely_compliant",
          confidence: 0.9,
          finding: "Lawful basis is properly documented for all processing",
          recommendation: "Continue monitoring for new processing activities",
          priority: "low",
          effort_estimate: "ongoing",
        },
      ],
      top_recommendations: [
        {
          title: "Annual Review",
          description: "Schedule annual review of processing activities",
          priority: "low",
          timeline: "Within 90 days",
        },
      ],
      penalties_exposure: "Minimal risk due to strong compliance posture.",
      danish_specific_notes:
        "Danish Datatilsynet enforcement is proportionate for compliant companies.",
    };

    mockCreate.mockResolvedValueOnce({
      content: [
        {
          type: "tool_use",
          id: "assess-008",
          name: "assess_compliance",
          input: compliantResult,
        },
      ],
    });

    const result = await assessCompliance(
      testCompany,
      gdprRegulation,
      checklistItems
    );

    expect(result.overall_score).toBe(90);
    expect(result.risk_level).toBe("minimal");
    expect(result.checklist_assessments?.[0]?.status).toBe("likely_compliant");
  });

  it("should include regulation effective and enforcement dates in the message", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [
        {
          type: "tool_use",
          id: "assess-009",
          name: "assess_compliance",
          input: mockAssessmentResult,
        },
      ],
    });

    await assessCompliance(testCompany, gdprRegulation, checklistItems);

    const callArgs = mockCreate.mock.calls[0]?.[0];
    const content = callArgs?.messages?.[0]?.content as string;
    expect(content).toContain("Effective: 2018-05-25");
    expect(content).toContain("Enforcement: 2018-05-25");
  });

  it("should handle N/A for null regulation fields", async () => {
    const regulationWithNulls: Regulation = {
      ...gdprRegulation,
      authority: null,
      max_fine_description: null,
      effective_date: null,
      enforcement_date: null,
    };

    mockCreate.mockResolvedValueOnce({
      content: [
        {
          type: "tool_use",
          id: "assess-010",
          name: "assess_compliance",
          input: mockAssessmentResult,
        },
      ],
    });

    await assessCompliance(testCompany, regulationWithNulls, checklistItems);

    const callArgs = mockCreate.mock.calls[0]?.[0];
    const content = callArgs?.messages?.[0]?.content as string;
    expect(content).toContain("Authority: N/A");
    expect(content).toContain("Effective: N/A");
    expect(content).toContain("Enforcement: N/A");
    expect(content).toContain("Max fine: N/A");
  });

  it("should use the regulation-specific prompt from the prompt module", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [
        {
          type: "tool_use",
          id: "assess-011",
          name: "assess_compliance",
          input: mockAssessmentResult,
        },
      ],
    });

    await assessCompliance(testCompany, gdprRegulation, checklistItems);

    const callArgs = mockCreate.mock.calls[0]?.[0];
    const systemPrompt = callArgs?.system as string;
    expect(systemPrompt).toContain("GDPR");
    expect(systemPrompt).toContain("Datatilsynet");
  });

  it("should include company applicability flags", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [
        {
          type: "tool_use",
          id: "assess-012",
          name: "assess_compliance",
          input: mockAssessmentResult,
        },
      ],
    });

    await assessCompliance(testCompany, gdprRegulation, checklistItems);

    const callArgs = mockCreate.mock.calls[0]?.[0];
    const content = callArgs?.messages?.[0]?.content as string;
    expect(content).toContain("Processes personal data: true");
    expect(content).toContain("Special category data: true");
    expect(content).toContain("Operates online: true");
  });

  it("should handle empty checklist items array", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [
        {
          type: "tool_use",
          id: "assess-013",
          name: "assess_compliance",
          input: mockAssessmentResult,
        },
      ],
    });

    const result = await assessCompliance(
      testCompany,
      gdprRegulation,
      []
    );

    // Should still resolve with the AI result
    expect(result.overall_score).toBe(45);
  });

  it("should return all required fields from AssessmentResult", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [
        {
          type: "tool_use",
          id: "assess-014",
          name: "assess_compliance",
          input: mockAssessmentResult,
        },
      ],
    });

    const result = await assessCompliance(
      testCompany,
      gdprRegulation,
      checklistItems
    );

    // Verify all required fields are present
    expect(result).toHaveProperty("overall_score");
    expect(result).toHaveProperty("risk_level");
    expect(result).toHaveProperty("executive_summary");
    expect(result).toHaveProperty("checklist_assessments");
    expect(result).toHaveProperty("top_recommendations");
    expect(result).toHaveProperty("penalties_exposure");
    expect(result).toHaveProperty("danish_specific_notes");
  });
});

describe("assessCompliance — malformed response handling", () => {
  it("should throw when response has text-only output with no tool_use block", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [
        { type: "text", text: "Here's my assessment:" },
        { type: "text", text: "Score: 50/100" },
      ],
    });

    const testComp: Company = {
      id: "c1",
      user_id: "u1",
      created_at: "2025-01-01",
      updated_at: "2025-01-01",
      name: "Test",
      cvr_number: null,
      industry_sector: null,
      company_size: "micro",
      employee_count: 1,
      annual_turnover_eur: null,
      country: "DK",
      city: null,
      postal_code: null,
      contact_name: null,
      contact_email: null,
      processes_personal_data: false,
      processes_special_categories: false,
      operates_online: false,
      uses_ai_systems: false,
      processes_payments: false,
      is_financial_entity: false,
      has_critical_infrastructure: false,
      has_employees: false,
      onboarding_completed: false,
      is_active: true,
    };

    const testReg: Regulation = {
      id: "r1",
      created_at: "2025-01-01",
      updated_at: "2025-01-01",
      slug: "gdpr",
      name: "GDPR",
      short_name: "GDPR",
      description: null,
      authority: null,
      regulation_type: "eu_regulation",
      effective_date: null,
      enforcement_date: null,
      applicability_criteria: {
        default_applicable: true,
        sectors: [],
        min_employees: 0,
        requires_personal_data_processing: false,
        requires_digital_services: false,
        requires_payment_processing: false,
        requires_financial_services: false,
        requires_ai_systems: false,
        requires_critical_infrastructure: false,
        requires_employees: false,
        description_en: "",
        description_da: "",
      },
      risk_level: "high",
      max_fine_description: null,
      official_url: null,
      is_active: true,
      display_order: 1,
    };

    await expect(
      assessCompliance(testComp, testReg, [])
    ).rejects.toThrow("Assessor did not return structured tool_use output");
  });
});
