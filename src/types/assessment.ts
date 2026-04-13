// EUComply Database Types — matches Supabase schema

// ─── Core Tables ─────────────────────────────────────────────

export interface Company {
  id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  name: string;
  cvr_number: string | null;
  industry_sector: string | null;
  company_size: 'micro' | 'small' | 'medium' | 'large' | null;
  employee_count: number | null;
  annual_turnover_eur: number | null;
  country: string;
  city: string | null;
  postal_code: string | null;
  contact_name: string | null;
  contact_email: string | null;
  // applicability flags
  processes_personal_data: boolean;
  processes_special_categories: boolean;
  operates_online: boolean;
  uses_ai_systems: boolean;
  processes_payments: boolean;
  is_financial_entity: boolean;
  has_critical_infrastructure: boolean;
  has_employees: boolean;
  onboarding_completed: boolean;
  is_active: boolean;
}

export interface Regulation {
  id: string;
  created_at: string;
  updated_at: string;
  slug: string;
  name: string;
  short_name: string;
  description: string | null;
  authority: string | null;
  regulation_type: 'eu_regulation' | 'eu_directive' | 'dk_law';
  effective_date: string | null;
  enforcement_date: string | null;
  applicability_criteria: ApplicabilityCriteria;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  max_fine_description: string | null;
  official_url: string | null;
  is_active: boolean;
  display_order: number;
}

export interface ApplicabilityCriteria {
  default_applicable: boolean;
  sectors: string[];
  min_employees: number;
  requires_personal_data_processing: boolean;
  requires_digital_services: boolean;
  requires_payment_processing: boolean;
  requires_financial_services: boolean;
  requires_ai_systems: boolean;
  requires_critical_infrastructure: boolean;
  requires_employees: boolean;
  description_en: string;
  description_da: string;
}

export interface ChecklistItem {
  id: string;
  regulation_id: string;
  created_at: string;
  updated_at: string;
  code: string;
  title: string;
  description: string | null;
  guidance: string | null;
  category: string | null;
  priority: 'critical' | 'high' | 'medium' | 'low';
  effort_level: 'minimal' | 'moderate' | 'significant';
  display_order: number;
  is_active: boolean;
}

// ─── Junction Tables ─────────────────────────────────────────

export interface CompanyRegulation {
  id: string;
  company_id: string;
  regulation_id: string;
  created_at: string;
  updated_at: string;
  is_applicable: boolean;
  applicability_reason: string | null;
  status: 'not_started' | 'in_progress' | 'compliant' | 'non_compliant';
  compliance_score: number;
  last_assessed_at: string | null;
}

export interface CompanyChecklist {
  id: string;
  company_id: string;
  checklist_item_id: string;
  created_at: string;
  updated_at: string;
  status: 'not_started' | 'in_progress' | 'completed' | 'not_applicable';
  notes: string | null;
  evidence_url: string | null;
  completed_at: string | null;
  completed_by: string | null;
}

export interface Assessment {
  id: string;
  company_id: string;
  created_at: string;
  updated_at: string;
  completed_at: string | null;
  assessment_type: 'initial' | 'periodic' | 'triggered';
  status: 'draft' | 'in_progress' | 'completed' | 'archived';
  overall_score: number;
  overall_risk_level: 'minimal' | 'low' | 'medium' | 'high' | 'critical' | null;
  responses: Record<string, unknown>;
  ai_analysis: Record<string, unknown>;
  recommendations: unknown[];
  version: number;
  is_latest: boolean;
}

// ─── Derived / UI Types ──────────────────────────────────────

export interface RegulationWithChecklist extends Regulation {
  checklist_items: ChecklistItem[];
}

export interface CompanyRegulationWithDetails extends CompanyRegulation {
  regulation: Regulation;
  checklist_progress: {
    total: number;
    completed: number;
    in_progress: number;
    not_applicable: number;
  };
}

export interface RiskCalculation {
  totalScore: number;
  maxPossibleScore: number;
  riskLevel: 'minimal' | 'low' | 'medium' | 'high' | 'critical';
  compliancePercentage: number;
  criticalIssues: string[];
  recommendations: string[];
}

// ─── Legacy compat (used by existing assessment form) ────────

export interface AssessmentQuestion {
  id: string;
  question_code: string;
  question_text: string;
  question_type: 'single_choice' | 'multiple_choice' | 'text' | 'number' | 'boolean';
  category: string;
  options?: QuestionOption[];
  max_points: number;
  display_order: number;
  is_required: boolean;
  help_text?: string;
}

export interface QuestionOption {
  value: string;
  label: string;
  points: number;
}

export interface AssessmentResponse {
  question_code: string;
  answer: string | string[] | number | boolean;
}

export interface AssessmentFormData {
  responses: Record<string, unknown>;
  currentStep: number;
  totalSteps: number;
}

/** @deprecated Use Company instead */
export type CompanyProfile = Company;

/** @deprecated Use Assessment instead */
export type ComplianceAssessment = Assessment;
