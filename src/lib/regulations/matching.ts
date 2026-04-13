import type { ApplicabilityCriteria, Regulation } from '@/types/assessment';

export interface CompanyProfile {
  name: string;
  cvr_number: string;
  industry_sector: string;
  employee_count: number;
  // Step 2: Data & Privacy
  processes_personal_data: boolean;
  processes_special_categories: boolean;
  uses_ai_systems: boolean;
  // Step 3: Digital Presence
  operates_online: boolean;
  processes_payments: boolean;
  annual_turnover_eur: number | null;
  // Step 4: Infrastructure
  is_financial_entity: boolean;
  has_critical_infrastructure: boolean;
  contact_email: string;
}

export interface MatchResult {
  regulation_id: string;
  slug: string;
  short_name: string;
  name: string;
  is_applicable: boolean;
  reason: string;
  risk_level: string;
  enforcement_date: string | null;
}

/**
 * Determine which regulations apply to a company based on its profile
 * and each regulation's applicability_criteria JSONB.
 */
export function matchRegulations(
  company: CompanyProfile,
  regulations: Regulation[]
): MatchResult[] {
  return regulations.map((reg) => {
    const criteria = reg.applicability_criteria as ApplicabilityCriteria;
    const reasons: string[] = [];
    let applicable = true;

    // Check requires_personal_data_processing
    if (criteria.requires_personal_data_processing) {
      if (company.processes_personal_data) {
        reasons.push('Processes personal data');
      } else {
        applicable = false;
      }
    }

    // Check requires_digital_services
    if (criteria.requires_digital_services) {
      if (company.operates_online) {
        reasons.push('Provides digital services');
      } else {
        applicable = false;
      }
    }

    // Check requires_ai_systems
    if (criteria.requires_ai_systems) {
      if (company.uses_ai_systems) {
        reasons.push('Uses AI systems');
      } else {
        applicable = false;
      }
    }

    // Check requires_payment_processing
    if (criteria.requires_payment_processing) {
      if (company.processes_payments) {
        reasons.push('Handles payments');
      } else {
        applicable = false;
      }
    }

    // Check requires_financial_services
    if (criteria.requires_financial_services) {
      if (company.is_financial_entity) {
        reasons.push('Is a financial entity');
      } else {
        applicable = false;
      }
    }

    // Check requires_critical_infrastructure
    if (criteria.requires_critical_infrastructure) {
      if (company.has_critical_infrastructure) {
        reasons.push('Operates critical infrastructure');
      } else {
        applicable = false;
      }
    }

    // Check employee count
    if (criteria.requires_employees && criteria.min_employees > 0) {
      if (company.employee_count >= criteria.min_employees) {
        reasons.push(`Has ${company.employee_count}+ employees (min: ${criteria.min_employees})`);
      } else {
        applicable = false;
      }
    }

    // Check sector
    if (criteria.sectors && criteria.sectors.length > 0) {
      if (criteria.sectors.includes(company.industry_sector)) {
        reasons.push(`Industry sector: ${company.industry_sector}`);
      } else if (!criteria.default_applicable) {
        // Only fail on sector if not default_applicable
        applicable = false;
      }
    }

    // default_applicable with no specific requires_* flags = applies to everyone
    if (criteria.default_applicable && reasons.length === 0 && applicable) {
      reasons.push('Applies to all Danish businesses');
    }

    return {
      regulation_id: reg.id,
      slug: reg.slug,
      short_name: reg.short_name,
      name: reg.name,
      is_applicable: applicable,
      reason: applicable
        ? reasons.join('; ')
        : criteria.description_en || 'Does not meet applicability criteria',
      risk_level: reg.risk_level,
      enforcement_date: reg.enforcement_date,
    };
  });
}
