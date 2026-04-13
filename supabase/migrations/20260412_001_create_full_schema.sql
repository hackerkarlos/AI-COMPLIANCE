-- EUComply Full Schema
-- Applied via Supabase MCP: create_full_schema (20260412131417)
-- This file is the local reference copy of the deployed schema.

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =============================================================
-- 1. companies — Company profiles with applicability flags
-- =============================================================
CREATE TABLE companies (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),

    -- Identity
    name TEXT NOT NULL,
    cvr_number TEXT,                  -- Danish CVR
    industry_sector TEXT,
    company_size TEXT CHECK (company_size IN ('micro','small','medium','large')),
    employee_count INTEGER,
    annual_turnover_eur NUMERIC,

    -- Location
    country TEXT DEFAULT 'DK',
    city TEXT,
    postal_code TEXT,

    -- Contact
    contact_name TEXT,
    contact_email TEXT,

    -- Applicability flags (matched against regulation criteria during onboarding)
    processes_personal_data BOOLEAN DEFAULT true,
    processes_special_categories BOOLEAN DEFAULT false,
    operates_online BOOLEAN DEFAULT true,
    uses_ai_systems BOOLEAN DEFAULT false,
    processes_payments BOOLEAN DEFAULT false,
    is_financial_entity BOOLEAN DEFAULT false,
    has_critical_infrastructure BOOLEAN DEFAULT false,
    has_employees BOOLEAN DEFAULT true,

    -- State
    onboarding_completed BOOLEAN DEFAULT false,
    is_active BOOLEAN DEFAULT true
);

COMMENT ON TABLE companies IS 'Company profiles with applicability flags for regulation matching';

-- =============================================================
-- 2. regulations — 10 EU/DK regulations with JSONB criteria
-- =============================================================
CREATE TABLE regulations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),

    slug TEXT NOT NULL UNIQUE,
    name TEXT NOT NULL,
    short_name TEXT NOT NULL,
    description TEXT,
    authority TEXT,
    regulation_type TEXT CHECK (regulation_type IN ('eu_regulation','eu_directive','dk_law')),

    effective_date DATE,
    enforcement_date DATE,

    -- Machine-readable applicability rules
    applicability_criteria JSONB NOT NULL DEFAULT '{}',

    risk_level TEXT CHECK (risk_level IN ('low','medium','high','critical')),
    max_fine_description TEXT,
    official_url TEXT,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0
);

COMMENT ON TABLE regulations IS 'EU and Danish regulations with machine-readable applicability criteria';
COMMENT ON COLUMN regulations.applicability_criteria IS 'JSONB rules for auto-determining if regulation applies to a company';

-- =============================================================
-- 3. checklist_items — Actionable compliance items per regulation
-- =============================================================
CREATE TABLE checklist_items (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    regulation_id UUID NOT NULL REFERENCES regulations(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),

    code TEXT NOT NULL,           -- e.g. GDPR-01, NIS2-03
    title TEXT NOT NULL,
    description TEXT,
    guidance TEXT,
    category TEXT,
    priority TEXT DEFAULT 'medium' CHECK (priority IN ('critical','high','medium','low')),
    effort_level TEXT DEFAULT 'moderate' CHECK (effort_level IN ('minimal','moderate','significant')),
    display_order INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT true
);

COMMENT ON TABLE checklist_items IS 'Actionable compliance checklist items per regulation';

-- =============================================================
-- 4. company_regulations — Junction: which regs apply to a company
-- =============================================================
CREATE TABLE company_regulations (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    regulation_id UUID NOT NULL REFERENCES regulations(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),

    is_applicable BOOLEAN DEFAULT true,
    applicability_reason TEXT,
    status TEXT DEFAULT 'not_started'
        CHECK (status IN ('not_started','in_progress','compliant','non_compliant')),
    compliance_score SMALLINT DEFAULT 0 CHECK (compliance_score >= 0 AND compliance_score <= 100),
    last_assessed_at TIMESTAMPTZ,

    UNIQUE (company_id, regulation_id)
);

COMMENT ON TABLE company_regulations IS 'Junction: which regulations apply to which company';

-- =============================================================
-- 5. company_checklist — Junction: per-item progress tracking
-- =============================================================
CREATE TABLE company_checklist (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    checklist_item_id UUID NOT NULL REFERENCES checklist_items(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),

    status TEXT DEFAULT 'not_started'
        CHECK (status IN ('not_started','in_progress','completed','not_applicable')),
    notes TEXT,
    evidence_url TEXT,
    completed_at TIMESTAMPTZ,
    completed_by UUID REFERENCES auth.users(id),

    UNIQUE (company_id, checklist_item_id)
);

COMMENT ON TABLE company_checklist IS 'Junction: company progress on individual checklist items';

-- =============================================================
-- 6. assessments — Periodic assessment snapshots with AI analysis
-- =============================================================
CREATE TABLE assessments (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    completed_at TIMESTAMPTZ,

    assessment_type TEXT DEFAULT 'initial'
        CHECK (assessment_type IN ('initial','periodic','triggered')),
    status TEXT DEFAULT 'draft'
        CHECK (status IN ('draft','in_progress','completed','archived')),

    overall_score SMALLINT DEFAULT 0 CHECK (overall_score >= 0 AND overall_score <= 100),
    overall_risk_level TEXT
        CHECK (overall_risk_level IN ('minimal','low','medium','high','critical')),

    responses JSONB DEFAULT '{}',
    ai_analysis JSONB DEFAULT '{}',
    recommendations JSONB DEFAULT '[]',

    version INTEGER DEFAULT 1,
    is_latest BOOLEAN DEFAULT true
);

COMMENT ON TABLE assessments IS 'Periodic compliance assessment snapshots with AI analysis';

-- =============================================================
-- Indexes
-- =============================================================
CREATE INDEX idx_companies_user_id ON companies(user_id);
CREATE INDEX idx_checklist_items_regulation_id ON checklist_items(regulation_id);
CREATE INDEX idx_company_regulations_company_id ON company_regulations(company_id);
CREATE INDEX idx_company_regulations_regulation_id ON company_regulations(regulation_id);
CREATE INDEX idx_company_checklist_company_id ON company_checklist(company_id);
CREATE INDEX idx_company_checklist_item_id ON company_checklist(checklist_item_id);
CREATE INDEX idx_assessments_company_id ON assessments(company_id);
CREATE INDEX idx_assessments_status ON assessments(status);

-- =============================================================
-- updated_at trigger
-- =============================================================
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_companies_updated_at BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_regulations_updated_at BEFORE UPDATE ON regulations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_checklist_items_updated_at BEFORE UPDATE ON checklist_items
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_company_regulations_updated_at BEFORE UPDATE ON company_regulations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_company_checklist_updated_at BEFORE UPDATE ON company_checklist
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER trg_assessments_updated_at BEFORE UPDATE ON assessments
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================================
-- Row-Level Security
-- =============================================================

-- companies: owner only
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
CREATE POLICY users_own_companies ON companies
    FOR ALL USING (auth.uid() = user_id);

-- regulations: public read
ALTER TABLE regulations ENABLE ROW LEVEL SECURITY;
CREATE POLICY regulations_public_read ON regulations
    FOR SELECT USING (true);

-- checklist_items: public read
ALTER TABLE checklist_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY checklist_items_public_read ON checklist_items
    FOR SELECT USING (true);

-- company_regulations: owner via company
ALTER TABLE company_regulations ENABLE ROW LEVEL SECURITY;
CREATE POLICY users_own_company_regulations ON company_regulations
    FOR ALL USING (
        company_id IN (SELECT id FROM companies WHERE user_id = auth.uid())
    );

-- company_checklist: owner via company
ALTER TABLE company_checklist ENABLE ROW LEVEL SECURITY;
CREATE POLICY users_own_company_checklist ON company_checklist
    FOR ALL USING (
        company_id IN (SELECT id FROM companies WHERE user_id = auth.uid())
    );

-- assessments: owner via company
ALTER TABLE assessments ENABLE ROW LEVEL SECURITY;
CREATE POLICY users_own_assessments ON assessments
    FOR ALL USING (
        company_id IN (SELECT id FROM companies WHERE user_id = auth.uid())
    );
