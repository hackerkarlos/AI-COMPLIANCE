/**
 * classify.ts — Orchestration layer for AI-driven regulation classification.
 *
 * Calls the AI classifier (Haiku) and persists results to company_regulations.
 * Server-side only — requires next/headers cookie context (Route Handler, Server Action).
 */

import { createClient } from "@/lib/supabase/server";
import {
  classifyRegulations,
  type ClassificationResult,
} from "./classifier";
import type { Company } from "@/types/assessment";

export type { ClassificationResult };

// ─── Main orchestrator ───────────────────────────────────────

/**
 * Run AI classification for a company and persist results to company_regulations.
 *
 * - Fetches company and all active regulations from DB
 * - Calls Haiku to classify which regulations apply
 * - Upserts company_regulations rows (is_applicable, applicability_reason)
 *   using ON CONFLICT to safely handle re-runs
 *
 * @param companyId UUID of the company to classify
 * @returns Full classification result including per-regulation classifications and summary
 */
export async function runClassification(
  companyId: string
): Promise<ClassificationResult> {
  const supabase = await createClient();

  // Fetch the company profile
  const { data: company, error: companyError } = await supabase
    .from("companies")
    .select("*")
    .eq("id", companyId)
    .single();

  if (companyError || !company) {
    throw new Error(
      `Company not found: ${companyId}${companyError ? ` — ${companyError.message}` : ""}`
    );
  }

  // Fetch all active regulations (need id→slug mapping)
  const { data: regulations, error: regError } = await supabase
    .from("regulations")
    .select("id, slug")
    .eq("is_active", true);

  if (regError || !regulations) {
    throw new Error(
      `Failed to fetch regulations${regError ? `: ${regError.message}` : ""}`
    );
  }

  // Run AI classification (Haiku, temperature=0)
  const result = await classifyRegulations(company as Company);

  // Build slug→id map for persistence
  const slugToId: Record<string, string> = {};
  for (const reg of regulations) {
    slugToId[reg.slug] = reg.id;
  }

  // Upsert company_regulations — one row per regulation
  // ON CONFLICT (company_id, regulation_id) — safe to re-run
  const upsertRows = result.classifications
    .filter((c) => slugToId[c.regulation_slug]) // skip unknown slugs
    .map((c) => ({
      company_id: companyId,
      regulation_id: slugToId[c.regulation_slug],
      is_applicable: c.applies,
      applicability_reason: c.reason,
      // Preserve existing status/score when re-classifying
      status: "not_started" as const,
      compliance_score: 0,
    }));

  if (upsertRows.length > 0) {
    const { error: upsertError } = await supabase
      .from("company_regulations")
      .upsert(upsertRows, { onConflict: "company_id,regulation_id" });

    if (upsertError) {
      console.error("Failed to persist classification results:", upsertError);
      throw new Error(
        `Failed to save classification results: ${upsertError.message}`
      );
    }
  }

  return result;
}
