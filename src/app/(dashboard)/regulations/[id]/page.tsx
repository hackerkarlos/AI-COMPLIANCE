import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Progress, Badge } from '@/components/ui';
import { ChecklistItemGroup } from '@/components/regulations/ChecklistItemGroup';
import type { ChecklistStatus } from '@/components/regulations';

export const dynamic = 'force-dynamic';

interface RegulationRow {
  id: string;
  slug: string;
  name: string;
  short_name: string;
  description: string | null;
  authority: string | null;
  regulation_type: string | null;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  enforcement_date: string | null;
  max_fine_description: string | null;
  applicability_criteria: Record<string, unknown> | null;
}

interface ChecklistItemRow {
  id: string;
  code: string;
  title: string;
  description: string | null;
  guidance: string | null;
  category: string | null;
  priority: 'critical' | 'high' | 'medium' | 'low';
  effort_level: 'minimal' | 'moderate' | 'significant';
  display_order: number;
}

interface CompanyChecklistRow {
  checklist_item_id: string;
  status: string;
  notes: string | null;
  evidence_url: string | null;
}

interface CompanyRegulationRow {
  applicability_reason: string | null;
}

/**
 * Convert AI applicability criteria JSON into a human-readable sentence explaining
 * why the regulation applies to this company.
 */
function buildApplicabilityReason(
  criteria: Record<string, unknown> | undefined | null,
  company: {
    processes_personal_data: boolean;
    operates_online: boolean;
    uses_ai_systems: boolean;
    processes_payments: boolean;
    is_financial_entity: boolean;
    has_critical_infrastructure: boolean;
    has_employees: boolean;
    employee_count: number | null;
    industry_sector: string | null;
  }
): string {
  if (!criteria) return 'This regulation applies to your company.';

  const reasons: string[] = [];

  if (criteria.default_applicable === true) {
    reasons.push('Automatically applies to all organisations in scope');
  }
  if (
    criteria.requires_personal_data_processing === true &&
    company.processes_personal_data
  ) {
    reasons.push('Your company processes personal data');
  }
  if (criteria.requires_digital_services === true && company.operates_online) {
    reasons.push('Your company operates online / digital services');
  }
  if (criteria.requires_ai_systems === true && company.uses_ai_systems) {
    reasons.push('Your company uses AI systems');
  }
  if (criteria.requires_payment_processing === true && company.processes_payments) {
    reasons.push('Your company processes payments');
  }
  if (criteria.requires_financial_services === true && company.is_financial_entity) {
    reasons.push('Your company is a financial entity');
  }
  if (criteria.requires_critical_infrastructure === true && company.has_critical_infrastructure) {
    reasons.push('Your company has critical infrastructure');
  }
  if (criteria.requires_employees === true && company.has_employees) {
    const min = criteria.min_employees as number | undefined;
    if (min) {
      reasons.push(
        `Your company has ${company.employee_count ?? 'N/A'} employees (threshold: ${min}+)`
      );
    } else {
      reasons.push('Your company has employees');
    }
  }

  const descKey =
    criteria.description_en as string | undefined ??
    criteria.description_da as string | undefined;
  if (descKey && reasons.length === 0) {
    return descKey;
  }

  if (reasons.length > 0) {
    return reasons.join('; ') + '.';
  }

  return 'This regulation applies to your company.';
}

export default async function RegulationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Fetch company
  const { data: company } = await supabase
    .from('companies')
    .select(
      'id, name, onboarding_completed, processes_personal_data, operates_online, uses_ai_systems, processes_payments, is_financial_entity, has_critical_infrastructure, has_employees, employee_count, industry_sector'
    )
    .eq('user_id', user.id)
    .single();

  if (!company?.onboarding_completed) redirect('/onboarding');

  // Fetch the regulation
  const { data: regulation } = await supabase
    .from('regulations')
    .select(
      'id, slug, name, short_name, description, authority, regulation_type, risk_level, enforcement_date, max_fine_description, applicability_criteria'
    )
    .or(`id.eq.${id},slug.eq.${id}`)
    .single();

  if (!regulation) notFound();

  // Verify this regulation applies to the company
  const { data: companyReg } = await supabase
    .from('company_regulations')
    .select('applicability_reason')
    .eq('company_id', company.id)
    .eq('regulation_id', (regulation as RegulationRow).id)
    .eq('is_applicable', true)
    .single() as { data: CompanyRegulationRow | null; error: unknown };

  if (!companyReg) {
    // Not applicable — still show page for informational purposes
  }

  // Fetch checklist items for this regulation
  const { data: items } = await supabase
    .from('checklist_items')
    .select('id, code, title, description, guidance, category, priority, effort_level, display_order')
    .eq('regulation_id', (regulation as RegulationRow).id)
    .eq('is_active', true)
    .order('display_order');

  const checklistItems = (items ?? []) as ChecklistItemRow[];

  // Fetch company progress for each checklist item
  const itemIds = checklistItems.map((i) => i.id);
  const { data: progress } = await supabase
    .from('company_checklist')
    .select('checklist_item_id, status, notes, evidence_url')
    .eq('company_id', company.id)
    .in('checklist_item_id', itemIds);

  const progressRows = (progress ?? []) as CompanyChecklistRow[];

  // Build status + notes + evidence lookup
  const progressMap: Record<
    string,
    { status: ChecklistStatus; notes: string | null; evidence_url: string | null }
  > = {};
  for (const row of progressRows) {
    progressMap[row.checklist_item_id] = {
      status: row.status as ChecklistStatus,
      notes: row.notes,
      evidence_url: row.evidence_url,
    };
  }

  // Group items by category
  const itemsByCategory = new Map<string, ChecklistItemRow[]>();
  for (const item of checklistItems) {
    const cat = item.category ?? 'General';
    const list = itemsByCategory.get(cat) ?? [];
    list.push(item);
    itemsByCategory.set(cat, list);
  }

  // Overall progress for this regulation
  let totalItems = 0;
  let completedItems = 0;
  for (const item of checklistItems) {
    const s = progressMap[item.id]?.status ?? 'not_started';
    if (s === 'not_applicable') continue;
    totalItems++;
    if (s === 'completed') completedItems++;
  }
  const percentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  const reg = regulation as RegulationRow;
  const applicabilityReason = buildApplicabilityReason(reg.applicability_criteria, company);

  const riskBadgeVariant =
    reg.risk_level === 'critical'
      ? 'critical'
      : reg.risk_level === 'high'
        ? 'high'
        : reg.risk_level === 'medium'
          ? 'medium'
          : 'low';

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="text-sm text-[var(--color-muted-foreground)]">
        <Link href="/regulations" className="hover:text-[var(--color-foreground)] hover:underline">
          Regulations
        </Link>
        <span className="mx-2">/</span>
        <span className="text-[var(--color-foreground)]">{reg.short_name}</span>
      </nav>

      {/* Header Card */}
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-6">
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight">{reg.short_name}</h1>
              <Badge variant={riskBadgeVariant}>{reg.risk_level}</Badge>
            </div>
            <p className="text-sm text-[var(--color-muted-foreground)]">{reg.name}</p>
          </div>

          {/* Run AI risk assessment — available for GDPR */}
          {reg.slug === 'gdpr' && (
            <Link
              href="/assessments/new"
              className="flex-shrink-0 rounded-md bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity"
            >
              Run GDPR Risk Assessment
            </Link>
          )}
        </div>

        {/* Progress */}
        <div className="mt-5">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">Compliance Progress</span>
            <span className="text-[var(--color-muted-foreground)]">
              {completedItems}/{totalItems} items ({percentage}%)
            </span>
          </div>
          <div className="mt-2">
            <Progress value={percentage} className="h-3" />
          </div>
        </div>
      </div>

      {/* Overview Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Authority */}
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
          <p className="text-xs uppercase tracking-wider text-[var(--color-muted-foreground)]">
            Authority
          </p>
          <p className="mt-1 font-medium">{reg.authority ?? '—'}</p>
        </div>

        {/* Enforcement Date */}
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
          <p className="text-xs uppercase tracking-wider text-[var(--color-muted-foreground)]">
            Enforcement
          </p>
          <p className="mt-1 font-medium">
            {reg.enforcement_date
              ? new Date(reg.enforcement_date).toLocaleDateString('en-DK', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })
              : '—'}
          </p>
        </div>

        {/* Type */}
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
          <p className="text-xs uppercase tracking-wider text-[var(--color-muted-foreground)]">
            Type
          </p>
          <p className="mt-1 font-medium">
            {reg.regulation_type
              ? {
                  eu_regulation: 'EU Regulation',
                  eu_directive: 'EU Directive',
                  dk_law: 'Danish Law',
                }[reg.regulation_type] ?? reg.regulation_type
              : '—'}
          </p>
        </div>

        {/* Max Penalty */}
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-4">
          <p className="text-xs uppercase tracking-wider text-[var(--color-muted-foreground)]">
            Max Penalty
          </p>
          <p className="mt-1 text-xs font-medium leading-relaxed">
            {reg.max_fine_description ?? '—'}
          </p>
        </div>
      </div>

      {/* Why It Applies */}
      <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-5">
        <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
          Why This Applies to {company.name}
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-[var(--color-foreground)]">
          {applicabilityReason}
        </p>
        {companyReg?.applicability_reason && (
          <p className="mt-2 border-t border-[var(--color-border)] pt-2 text-sm italic text-[var(--color-muted-foreground)]">
            AI Assessment: {companyReg.applicability_reason}
          </p>
        )}
      </div>

      {/* Description */}
      {reg.description && (
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-5">
          <h2 className="text-sm font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
            Description
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-[var(--color-foreground)]">
            {reg.description}
          </p>
        </div>
      )}

      {/* Checklist Items Grouped by Category */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Compliance Checklist</h2>
        {itemsByCategory.size === 0 ? (
          <div className="rounded-lg border border-[var(--color-border)] p-8 text-center">
            <p className="text-sm text-[var(--color-muted-foreground)]">
              No checklist items available for this regulation.
            </p>
          </div>
        ) : (
          Array.from(itemsByCategory.entries()).map(([category, categoryItems]) => (
            <ChecklistItemGroup
              key={category}
              category={category}
              items={categoryItems}
              companyId={company.id}
              progressMap={progressMap}
              regulationId={reg.id}
            />
          ))
        )}
      </div>
    </div>
  );
}
