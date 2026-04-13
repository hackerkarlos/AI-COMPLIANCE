/**
 * AI classification + assessment engine — public API.
 * Server-side only — import only from Route Handlers, Server Actions, or Server Components.
 */

export { getAnthropicClient, MODELS, DEFAULT_TEMPERATURE, MAX_TOKENS_CLASSIFY, MAX_TOKENS_ASSESS } from "./client";

export { runClassification } from "./classify";
export type { ClassificationResult, RegulationClassification } from "./classifier";

export { runAssessment } from "./assess";
export type { StoredAssessmentResult } from "./assess";
export type { AssessmentResult, ChecklistAssessment, TopRecommendation } from "./assessor";
