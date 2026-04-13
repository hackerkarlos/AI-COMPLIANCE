/**
 * assess.ts — Orchestration layer for AI-driven compliance assessment.
 *
 * Calls the AI assessor (Sonnet) and persists results to:
 *   - assessments table (full AI analysis snapshot)
 *   - company_regulations table (compliance_score, status, last_assessed_at)
 *
 * Server-side only — requires next/headers cookie context (Route Handler, Server Action).
 */

import { createClient } from "@/lib/supabase/server";
import {
  assessCompliance,
  type AssessmentResult,
} from "./assessor";
import type { Company, Regulation, ChecklistItem } from "@/types/assessment";

export type { AssessmentResult };

// ─── Return type ─────────────────────────────────────────────

export interface StoredAssessmentResult {
  /** UUID of the newly created assessments row */
  assessmentId: string;
  /** Full AI assessment result */
  result: AssessmentResult;
}

// ─── Compliance status derivation ────────────────────────────

function deriveStatus(
  score: number
): "not_started" | "in_progress" | "compliant" | "non_compliant" {
  if (score >= 80) return "compliant";
  if (score >= 40) return "in_progress";
  return "non_compliant";
}

// ─── Main orchestrator ───────────────────────────────────────

/**
 * Run a per-regulation AI assessment and persist results.
 *
 * Flow:
 * 1. Fetch company, regulation, and checklist items from DB
 * 2. Call Sonnet assessor (tool_use for structured JSON output, temperature=0)
 * 3. Insert a new row into `assessments` with the full AI analysis
 * 4. Update `company_regulations` with compliance_score, status, last_assessed_at
 *
 * @param companyId    UUID of the company being assessed
 * @param regulationId UUID of the regulation to assess against
 * @returns assessmentId (new DB row) and the full AI result
 */
export async function runAssessment(
  companyId: string,
  regulationId: string
): Promise<StoredAssessmentResult> {
  const supabase = await createClient();

  // Fetch all required data in parallel to minimise latency
  const [companyRes, regulationRes, checklistRes] = await Promise.all([
    supabase.from("companies").select("*").eq("id", companyId).single(),
    supabase.from("regulations").select("*").eq("id", regulationId).single(),
    supabase
      .from("checklist_items")
      .select("*")
      .eq("regulation_id", regulationId)
      .eq("is_active", true)
      .order("display_order"),
  ]);

  if (companyRes.error || !companyRes.data) {
    throw new Error(
      `Company not found: ${companyId}${companyRes.error ? ` — ${companyRes.error.message}` : ""}`
    );
  }
  if (regulationRes.error || !regulationRes.data) {
    throw new Error(
      `Regulation not found: ${regulationId}${regulationRes.error ? ` — ${regulationRes.error.message}` : ""}`
    );
  }

  const company = companyRes.data as Company;
  const regulation = regulationRes.data as Regulation;
  const checklistItems = (checklistRes.data ?? []) as ChecklistItem[];

  // Run AI assessment (Sonnet, temperature=0, tool_use for structured output)
  const result = await assessCompliance(company, regulation, checklistItems);

  // Determine the assessment_type: initial if no prior assessment exists,
  // periodic otherwise
  const { count } = await supabase
    .from("assessments")
    .select("id", { count: "exact", head: true })
    .eq("company_id", companyId)
    .contains("ai_analysis", { regulation_id: regulationId });

  const assessmentType = count === 0 ? "initial" : "periodic";

  // Insert assessment record
  // ai_analysis stores the full result plus regulation metadata for traceability
  const { data: assessment, error: assessError } = await supabase
    .from("assessments")
    .insert({
      company_id: companyId,
      assessment_type: assessmentType,
      status: "completed",
      overall_score: result.overall_score,
      overall_risk_level: result.risk_level,
      ai_analysis: {
        regulation_id: regulationId,
        regulation_slug: regulation.slug,
        regulation_name: regulation.name,
        executive_summary: result.executive_summary,
        checklist_assessments: result.checklist_assessments,
        penalties_exposure: result.penalties_exposure,
        danish_specific_notes: result.danish_specific_notes,
      },
      recommendations: result.top_recommendations,
      responses: {},
      completed_at: new Date().toISOString(),
      is_latest: true,
      version: 1,
    })
    .select("id")
    .single();

  if (assessError || !assessment) {
    console.error("Failed to store assessment:", assessError);
    throw new Error(
      `Failed to save assessment${assessError ? `: ${assessError.message}` : ""}`
    );
  }

  // Update company_regulations with the assessed compliance score and status
  const { error: crError } = await supabase
    .from("company_regulations")
    .update({
      compliance_score: result.overall_score,
      status: deriveStatus(result.overall_score),
      last_assessed_at: new Date().toISOString(),
    })
    .eq("company_id", companyId)
    .eq("regulation_id", regulationId);

  if (crError) {
    // Non-fatal: the assessment was stored; log and continue
    console.error(
      "Failed to update company_regulations compliance score:",
      crError
    );
  }

  return { assessmentId: assessment.id, result };
}
