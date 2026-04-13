/**
 * Prompt templates index — maps regulation slugs to their domain-specific prompt context.
 */

import { gdprPrompt } from "./gdpr";
import { bogfoeringsloven } from "./bogfoeringsloven";
import { nis2Prompt } from "./nis2";
import { aiActPrompt } from "./ai-act";
import { eprivacyPrompt } from "./eprivacy";
import { generalPrompt } from "./general";

const PROMPT_MAP: Record<string, string> = {
  gdpr: gdprPrompt,
  databeskyttelsesloven: gdprPrompt, // Closely linked — uses GDPR base with DK additions
  eprivacy: eprivacyPrompt,
  nis2: nis2Prompt,
  ai_act: aiActPrompt,
  bogfoeringsloven: bogfoeringsloven,
  hvidvaskloven: generalPrompt,
  whistleblower: generalPrompt,
  psd2: generalPrompt,
  dora: generalPrompt,
};

export function getPromptForRegulation(slug: string): string {
  return PROMPT_MAP[slug] ?? generalPrompt;
}
