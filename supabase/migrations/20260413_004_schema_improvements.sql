-- EUComply Schema Improvements
-- Applied via: supabase db push or MCP apply_migration
-- Adds indexes and constraints missing from initial schema for performance/data-integrity

-- =============================================================
-- Composite unique: no duplicate checklist codes per regulation
-- =============================================================
CREATE UNIQUE INDEX uq_checklist_items_regulation_code
    ON checklist_items(regulation_id, code);

-- =============================================================
-- GIN index on applicability_criteria for JSONB querying
-- (Used by regulation matching during onboarding)
-- =============================================================
CREATE INDEX idx_regulations_applicability_criteria
    ON regulations USING GIN (applicability_criteria);

-- =============================================================
-- GIN index on assessments JSONB columns for search/filter
-- =============================================================
CREATE INDEX idx_assessments_responses ON assessments USING GIN (responses);
CREATE INDEX idx_assessments_ai_analysis ON assessments USING GIN (ai_analysis);
CREATE INDEX idx_assessments_recommendations ON assessments USING GIN (recommendations);

-- =============================================================
-- Additional useful index: companies by country + employee_count
-- (For NIS2/Whistleblower applicability matching)
-- =============================================================
CREATE INDEX idx_companies_country_employees ON companies(country, employee_count);

-- =============================================================
-- Partial index: only active assessments (most queries)
-- =============================================================
CREATE INDEX idx_assessments_company_latest
    ON assessments(company_id) WHERE is_latest = true;
