import Anthropic from "@anthropic-ai/sdk";

let _client: Anthropic | null = null;

/**
 * Singleton Anthropic client. Server-side only — never import in client components.
 * Reads ANTHROPIC_API_KEY from process.env at first call.
 */
export function getAnthropicClient(): Anthropic {
  if (_client) return _client;

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error(
      "ANTHROPIC_API_KEY is not set. Add it to .env.local and restart the dev server."
    );
  }

  _client = new Anthropic({ apiKey });
  return _client;
}

// Model constants — single source of truth
export const MODELS = {
  /** Fast & cheap — used for classification */
  HAIKU: "claude-haiku-4-5-20251001" as const,
  /** Powerful — used for detailed assessments */
  SONNET: "claude-sonnet-4-6" as const,
} as const;

export const DEFAULT_TEMPERATURE = 0;
export const MAX_TOKENS_CLASSIFY = 4096;
export const MAX_TOKENS_ASSESS = 8192;
