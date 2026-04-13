import { NextResponse } from 'next/server';
import type { Tool } from '@anthropic-ai/sdk/resources/messages';
import { createClient } from '@/lib/supabase/server';
import { getAnthropicClient, MODELS, DEFAULT_TEMPERATURE } from '@/lib/ai/client';
import { eprivacyPrompt } from '@/lib/ai/prompts/eprivacy';

// ─── Tool schema ─────────────────────────────────────────────

const generateCookiePolicyTool: Tool = {
  name: 'generate_cookie_policy',
  description:
    'Generate a complete, GDPR/ePrivacy-compliant cookie policy template tailored to the company profile.',
  input_schema: {
    type: 'object' as const,
    properties: {
      introduction: {
        type: 'string',
        description:
          'Opening paragraph that names the company and explains the purpose of the cookie policy. ~2-3 sentences.',
      },
      what_are_cookies: {
        type: 'string',
        description:
          'Plain-language explanation of what cookies are and how they work. ~2-3 sentences.',
      },
      cookies_we_use: {
        type: 'array',
        description: 'Array of cookie categories used by the company.',
        items: {
          type: 'object',
          properties: {
            category: {
              type: 'string',
              description:
                'Category name, e.g. "Strictly Necessary", "Analytics", "Marketing", "Functional".',
            },
            legal_basis: {
              type: 'string',
              description:
                'Legal basis for processing, e.g. "Legitimate interest / strictly necessary" or "Consent (Article 5(3) ePrivacy Directive)".',
            },
            purpose: {
              type: 'string',
              description: 'What these cookies are used for.',
            },
            retention: {
              type: 'string',
              description: 'Typical retention period, e.g. "Session", "1 year", "2 years".',
            },
            examples: {
              type: 'string',
              description:
                'Comma-separated example cookie names or providers, e.g. "Google Analytics (_ga, _gid)".',
            },
          },
          required: ['category', 'legal_basis', 'purpose', 'retention'],
        },
      },
      consent_mechanism: {
        type: 'string',
        description:
          'Paragraph explaining how the company obtains and records cookie consent, referencing the CMP / banner.',
      },
      how_to_manage_cookies: {
        type: 'string',
        description:
          'Instructions for withdrawing consent, deleting cookies via browser settings, and opting out.',
      },
      third_parties: {
        type: 'string',
        description:
          'Paragraph about third-party cookies and any data transfers outside the EEA, including safeguards.',
      },
      updates_to_policy: {
        type: 'string',
        description: 'How and when the company updates the cookie policy.',
      },
      contact_details_placeholder: {
        type: 'string',
        description:
          'Template text for the contact section with placeholders in [BRACKETS] for name, email, address.',
      },
    },
    required: [
      'introduction',
      'what_are_cookies',
      'cookies_we_use',
      'consent_mechanism',
      'how_to_manage_cookies',
      'third_parties',
      'updates_to_policy',
      'contact_details_placeholder',
    ],
  },
};

// ─── Response type ────────────────────────────────────────────

interface CookieCategory {
  category: string;
  legal_basis: string;
  purpose: string;
  retention: string;
  examples?: string;
}

export interface CookiePolicyTemplate {
  introduction: string;
  what_are_cookies: string;
  cookies_we_use: CookieCategory[];
  consent_mechanism: string;
  how_to_manage_cookies: string;
  third_parties: string;
  updates_to_policy: string;
  contact_details_placeholder: string;
}

// ─── Route handler ────────────────────────────────────────────

export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { data: company } = await supabase
      .from('companies')
      .select(
        'id, name, industry_sector, operates_online, processes_personal_data, uses_ai_systems, processes_payments, contact_email'
      )
      .eq('user_id', user.id)
      .single();

    if (!company) {
      return NextResponse.json({ error: 'Company profile not found' }, { status: 404 });
    }

    const client = getAnthropicClient();

    const systemPrompt = `You are an expert EU and Danish regulatory compliance lawyer specialising in ePrivacy, GDPR, and cookie law. You generate clear, practical cookie policy templates for Danish SMBs.

${eprivacyPrompt}

Your cookie policy template must:
- Be written in clear, plain English (company will translate to Danish)
- Follow Danish Datatilsynet guidance and cookie-erklæringen.dk standards
- Include placeholders in [SQUARE BRACKETS] where the company must fill in specifics
- Be proportionate — reflect only the cookies actually relevant to the company's profile
- Not fabricate specific cookie names unless they are universally standard (e.g. _ga for Google Analytics)`;

    const companyContext = [
      `Company name: ${company.name}`,
      `Industry: ${company.industry_sector ?? 'Not specified'}`,
      `Operates online / has website: ${company.operates_online}`,
      `Processes personal data: ${company.processes_personal_data}`,
      `Uses AI systems: ${company.uses_ai_systems}`,
      `Processes payments: ${company.processes_payments}`,
    ].join('\n');

    const response = await client.messages.create({
      model: MODELS.SONNET,
      max_tokens: 4096,
      temperature: DEFAULT_TEMPERATURE,
      system: systemPrompt,
      tools: [generateCookiePolicyTool],
      tool_choice: { type: 'tool', name: 'generate_cookie_policy' },
      messages: [
        {
          role: 'user',
          content: `Generate a cookie policy template for this Danish company:

${companyContext}

Tailor the cookie categories to what this type of company realistically uses. For an online business, include analytics and potentially marketing cookies. For a company not operating online, keep it minimal. Always include strictly necessary cookies.`,
        },
      ],
    });

    const toolUseBlock = response.content.find((block) => block.type === 'tool_use');
    if (!toolUseBlock || toolUseBlock.type !== 'tool_use') {
      throw new Error('AI did not return structured cookie policy output');
    }

    const policy = toolUseBlock.input as CookiePolicyTemplate;

    return NextResponse.json({ success: true, policy });
  } catch (err) {
    console.error('Cookie policy generation error:', err);
    return NextResponse.json({ error: 'Failed to generate cookie policy' }, { status: 500 });
  }
}
