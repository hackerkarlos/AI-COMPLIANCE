/**
 * classifier.test.ts — Unit tests for src/lib/ai/classifier.ts
 *
 * Tests:
 * - classifyRegulations() with mocked Anthropic client
 * - Gaming startup gets GDPR + ePrivacy + Bogforingsloven but NOT AML/Hvidvaskloven
 * - Fintech startup also gets AML (Hvidvaskloven)
 * - Error handling for missing tool_use output
 * - formatCompanyProfile() output format
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
  classifyRegulations,
  type ClassificationResult,
} from "./classifier";
import type { Company } from "@/types/assessment";

// ─── Mock fixtures ─────────────────────────────────────────────

const gamingCompany: Company = {
  id: "gaming-001",
  user_id: "user-001",
  created_at: "2025-01-01T00:00:00Z",
  updated_at: "2025-01-01T00:00:00Z",
  name: "PixelStorm Gaming ApS",
  cvr_number: "12345678",
  industry_sector: "Gaming & Entertainment",
  company_size: "micro",
  employee_count: 3,
  annual_turnover_eur: 50000,
  country: "DK",
  city: "Copenhagen",
  postal_code: "1000",
  contact_name: "Mikkel Jensen",
  contact_email: "mikkel@pixelstorm.dk",
  processes_personal_data: true,
  processes_special_categories: false,
  operates_online: true,
  uses_ai_systems: false,
  processes_payments: false,
  is_financial_entity: false,
  has_critical_infrastructure: false,
  has_employees: true,
  onboarding_completed: true,
  is_active: true,
};

const fintechCompany: Company = {
  id: "fintech-001",
  user_id: "user-002",
  created_at: "2025-01-01T00:00:00Z",
  updated_at: "2025-01-01T00:00:00Z",
  name: "NordicPay ApS",
  cvr_number: "87654321",
  industry_sector: "Financial Technology",
  company_size: "small",
  employee_count: 25,
  annual_turnover_eur: 2000000,
  country: "DK",
  city: "Aarhus",
  postal_code: "8000",
  contact_name: "Sofia Andersen",
  contact_email: "sofia@nordicpay.dk",
  processes_personal_data: true,
  processes_special_categories: false,
  operates_online: true,
  uses_ai_systems: true,
  processes_payments: true,
  is_financial_entity: true,
  has_critical_infrastructure: false,
  has_employees: true,
  onboarding_completed: true,
  is_active: true,
};

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

describe("classifyRegulations", () => {
  const mockClassificationResult: ClassificationResult = {
    classifications: [
      {
        regulation_slug: "gdpr",
        applies: true,
        confidence: 0.95,
        reason: "Company processes personal data of EU citizens",
        risk_level: "high",
      },
      {
        regulation_slug: "databeskyttelsesloven",
        applies: true,
        confidence: 0.95,
        reason: "Follows from GDPR applicability in Denmark",
        risk_level: "high",
      },
      {
        regulation_slug: "eprivacy",
        applies: true,
        confidence: 0.9,
        reason: "Company operates online with website/app",
        risk_level: "medium",
      },
      {
        regulation_slug: "nis2",
        applies: false,
        confidence: 0.85,
        reason:
          "Gaming company does not fall under essential/important entity sectors",
        risk_level: "low",
      },
      {
        regulation_slug: "ai_act",
        applies: false,
        confidence: 0.8,
        reason: "Company does not use AI systems",
        risk_level: "low",
      },
      {
        regulation_slug: "bogfoeringsloven",
        applies: true,
        confidence: 0.99,
        reason:
          "All Danish companies must comply with the Danish Bookkeeping Act",
        risk_level: "medium",
      },
      {
        regulation_slug: "hvidvaskloven",
        applies: false,
        confidence: 0.9,
        reason:
          "Gaming company is not a financial entity or obliged AML entity",
        risk_level: "low",
      },
      {
        regulation_slug: "whistleblower",
        applies: false,
        confidence: 0.95,
        reason: "Company has fewer than 50 employees",
        risk_level: "low",
      },
      {
        regulation_slug: "psd2",
        applies: false,
        confidence: 0.9,
        reason: "Company does not provide payment services",
        risk_level: "low",
      },
      {
        regulation_slug: "dora",
        applies: false,
        confidence: 0.9,
        reason: "Company is not a financial entity",
        risk_level: "low",
      },
    ],
    summary: "This gaming startup primarily needs GDPR, ePrivacy, and Danish bookkeeping compliance.",
  };

  const mockFintechResult: ClassificationResult = {
    classifications: [
      {
        regulation_slug: "gdpr",
        applies: true,
        confidence: 0.95,
        reason: "Company processes personal data of EU citizens",
        risk_level: "high",
      },
      {
        regulation_slug: "databeskyttelsesloven",
        applies: true,
        confidence: 0.95,
        reason: "Follows from GDPR applicability in Denmark",
        risk_level: "high",
      },
      {
        regulation_slug: "eprivacy",
        applies: true,
        confidence: 0.9,
        reason: "Company operates online with website/app",
        risk_level: "medium",
      },
      {
        regulation_slug: "nis2",
        applies: false,
        confidence: 0.8,
        reason: "Fintech SMB not classified as essential entity",
        risk_level: "low",
      },
      {
        regulation_slug: "ai_act",
        applies: true,
        confidence: 0.85,
        reason: "Company uses AI systems for risk assessment",
        risk_level: "high",
      },
      {
        regulation_slug: "bogfoeringsloven",
        applies: true,
        confidence: 0.99,
        reason:
          "All Danish companies must comply with the Danish Bookkeeping Act",
        risk_level: "medium",
      },
      {
        regulation_slug: "hvidvaskloven",
        applies: true,
        confidence: 0.95,
        reason:
          "Payment processing and financial entity classification trigger AML obligations",
        risk_level: "critical",
      },
      {
        regulation_slug: "whistleblower",
        applies: false,
        confidence: 0.9,
        reason: "Company has fewer than 50 employees (25)",
        risk_level: "low",
      },
      {
        regulation_slug: "psd2",
        applies: true,
        confidence: 0.9,
        reason:
          "Company processes payments and qualifies as a payment service provider",
        risk_level: "high",
      },
      {
        regulation_slug: "dora",
        applies: true,
        confidence: 0.85,
        reason:
          "Financial entity classification triggers DORA applicability",
        risk_level: "high",
      },
    ],
    summary:
      "This fintech company faces extensive regulatory obligations across data protection, financial services, AML, and operational resilience frameworks.",
  };

  it("should classify a gaming startup as needing GDPR", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [
        {
          type: "tool_use",
          id: "call-001",
          name: "classify_regulations",
          input: mockClassificationResult,
        },
      ],
    });

    const result = await classifyRegulations(gamingCompany);

    const gdpr = result.classifications.find((c) => c.regulation_slug === "gdpr");
    expect(gdpr).toBeDefined();
    expect(gdpr?.applies).toBe(true);
  });

  it("should classify a gaming startup as needing ePrivacy", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [
        {
          type: "tool_use",
          id: "call-002",
          name: "classify_regulations",
          input: mockClassificationResult,
        },
      ],
    });

    const result = await classifyRegulations(gamingCompany);

    const eprivacy = result.classifications.find(
      (c) => c.regulation_slug === "eprivacy"
    );
    expect(eprivacy).toBeDefined();
    expect(eprivacy?.applies).toBe(true);
  });

  it("should classify a gaming startup as needing Bogforingsloven", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [
        {
          type: "tool_use",
          id: "call-003",
          name: "classify_regulations",
          input: mockClassificationResult,
        },
      ],
    });

    const result = await classifyRegulations(gamingCompany);

    const bogfoeringsloven = result.classifications.find(
      (c) => c.regulation_slug === "bogfoeringsloven"
    );
    expect(bogfoeringsloven).toBeDefined();
    expect(bogfoeringsloven?.applies).toBe(true);
  });

  it("should classify a gaming startup as NOT needing AML (Hvidvaskloven)", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [
        {
          type: "tool_use",
          id: "call-004",
          name: "classify_regulations",
          input: mockClassificationResult,
        },
      ],
    });

    const result = await classifyRegulations(gamingCompany);

    const hvidvaskloven = result.classifications.find(
      (c) => c.regulation_slug === "hvidvaskloven"
    );
    expect(hvidvaskloven).toBeDefined();
    expect(hvidvaskloven?.applies).toBe(false);
  });

  it("should classify a fintech startup as needing AML (Hvidvaskloven)", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [
        {
          type: "tool_use",
          id: "call-005",
          name: "classify_regulations",
          input: mockFintechResult,
        },
      ],
    });

    const result = await classifyRegulations(fintechCompany);

    const hvidvaskloven = result.classifications.find(
      (c) => c.regulation_slug === "hvidvaskloven"
    );
    expect(hvidvaskloven).toBeDefined();
    expect(hvidvaskloven?.applies).toBe(true);
  });

  it("should classify a fintech startup as needing PSD2 and DORA", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [
        {
          type: "tool_use",
          id: "call-006",
          name: "classify_regulations",
          input: mockFintechResult,
        },
      ],
    });

    const result = await classifyRegulations(fintechCompany);

    const psd2 = result.classifications.find(
      (c) => c.regulation_slug === "psd2"
    );
    const dora = result.classifications.find(
      (c) => c.regulation_slug === "dora"
    );
    expect(psd2?.applies).toBe(true);
    expect(dora?.applies).toBe(true);
  });

  it("should throw error when classifier does not return tool_use output", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [
        {
          type: "text",
          text: "I cannot classify this company without more information.",
        },
      ],
    });

    await expect(classifyRegulations(gamingCompany)).rejects.toThrow(
      "Classifier did not return structured tool_use output"
    );
  });

  it("should throw error when classifier returns empty content", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [],
    });

    await expect(classifyRegulations(gamingCompany)).rejects.toThrow(
      "Classifier did not return structured tool_use output"
    );
  });

  it("should pass correct model, temperature, and tool parameters to the AI", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [
        {
          type: "tool_use",
          id: "call-007",
          name: "classify_regulations",
          input: mockClassificationResult,
        },
      ],
    });

    await classifyRegulations(gamingCompany);

    expect(mockCreate).toHaveBeenCalledWith(
      expect.objectContaining({
        model: "claude-haiku-4-5-20251001",
        temperature: 0,
        max_tokens: 256,
        tool_choice: { type: "tool", name: "classify_regulations" },
      })
    );
  });

  it("should include company name in the user message", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [
        {
          type: "tool_use",
          id: "call-008",
          name: "classify_regulations",
          input: mockClassificationResult,
        },
      ],
    });

    await classifyRegulations(gamingCompany);

    const callArgs = mockCreate.mock.calls[0]?.[0];
    expect(callArgs?.messages?.[0]?.content).toContain("PixelStorm Gaming ApS");
  });

  it("should include applicability flags in the company description", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [
        {
          type: "tool_use",
          id: "call-009",
          name: "classify_regulations",
          input: mockClassificationResult,
        },
      ],
    });

    await classifyRegulations(gamingCompany);

    const callArgs = mockCreate.mock.calls[0]?.[0];
    const content = callArgs?.messages?.[0]?.content as string;
    expect(content).toContain("Processes personal data: true");
    expect(content).toContain("Operates online (website/app): true");
    expect(content).toContain("Is financial entity: false");
  });

  it("should return a summary field", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [
        {
          type: "tool_use",
          id: "call-010",
          name: "classify_regulations",
          input: mockClassificationResult,
        },
      ],
    });

    const result = await classifyRegulations(gamingCompany);

    expect(result.summary).toBe(
      "This gaming startup primarily needs GDPR, ePrivacy, and Danish bookkeeping compliance."
    );
  });

  it("should classify all 10 regulations", async () => {
    mockCreate.mockResolvedValueOnce({
      content: [
        {
          type: "tool_use",
          id: "call-011",
          name: "classify_regulations",
          input: mockClassificationResult,
        },
      ],
    });

    const result = await classifyRegulations(gamingCompany);

    expect(result.classifications).toHaveLength(10);
  });
});
