import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { RegulationCard } from '@/components/regulations';
import type { ChecklistStatus } from '@/components/regulations';
import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent } from '@/components/ui/card';

interface RegulationRow {
  id: string;
  slug: string;
  name: string;
  short_name: string;
  risk_level: 'low' | 'medium' | 'high' | 'critical';
  enforcement_date: string | null;
  display_order: number;
}

interface CompanyRegRow {
  id: string;
  regulation_id: string;
  regulation: RegulationRow;
}

interface ChecklistItemRow {
  id: string;
  regulation_id: string;
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
}

export default async function RegulationsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  const { data: company } = await supabase
    .from('companies')
    .select('id, name, onboarding_completed')
    .eq('user_id', user.id)
    .single();

  if (!company?.onboarding_completed) {
    redirect('/onboarding');
  }

  // Fetch company regulations and checklist status in parallel
  const [{ data: companyRegs }, { data: companyChecklist }] = await Promise.all([
    supabase
      .from('company_regulations')
      .select(
        'id, regulation_id, regulation:regulations(id, slug, name, short_name, risk_level, enforcement_date, display_order)'
      )
      .eq('company_id', company.id)
      .eq('is_applicable', true),
    supabase
      .from('company_checklist')
      .select('checklist_item_id, status')
      .eq('company_id', company.id),
  ]);

  const regulations = (companyRegs ?? []) as unknown as CompanyRegRow[];
  const checklist = (companyChecklist ?? []) as CompanyChecklistRow[];

  // Fetch all checklist items for applicable regulations
  const regIds = regulations.map((cr) => cr.regulation_id);
  const { data: allItems } =
    regIds.length > 0
      ? await supabase
          .from('checklist_items')
          .select('id, regulation_id, code, title, description, guidance, category, priority, effort_level, display_order')
          .in('regulation_id', regIds)
          .eq('is_active', true)
          .order('display_order')
      : { data: [] as ChecklistItemRow[] };

  const items = (allItems ?? []) as ChecklistItemRow[];

  // Build status lookup: checklist_item_id -> status
  const statusMap: Record<string, ChecklistStatus> = {};
  for (const row of checklist) {
    statusMap[row.checklist_item_id] = row.status as ChecklistStatus;
  }

  // Group items by regulation_id
  const itemsByRegulation = new Map<string, ChecklistItemRow[]>();
  for (const item of items) {
    const list = itemsByRegulation.get(item.regulation_id) ?? [];
    list.push(item);
    itemsByRegulation.set(item.regulation_id, list);
  }

  // Overall stats
  let totalItems = 0;
  let completedItems = 0;
  for (const item of items) {
    const s = statusMap[item.id] ?? 'not_started';
    if (s === 'not_applicable') continue;
    totalItems++;
    if (s === 'completed') completedItems++;
  }
  const overallPercentage = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0;

  // Sort regulations by display_order
  const sortedRegs = [...regulations].sort(
    (a, b) => (a.regulation.display_order ?? 0) - (b.regulation.display_order ?? 0)
  );

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Regulations & Compliance Checklist</h1>
        <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
          Track your compliance progress across all applicable regulations. Click a regulation to
          expand its checklist items and update their status.
        </p>
      </div>

      {/* Overall Summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Card>
          <div className="p-5">
            <p className="text-sm text-[var(--color-muted-foreground)]">Overall Compliance</p>
            <p className="mt-1 text-3xl font-bold">{overallPercentage}%</p>
            <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
              {completedItems} of {totalItems} items completed
            </p>
          </div>
        </Card>
        <Card>
          <div className="p-5">
            <p className="text-sm text-[var(--color-muted-foreground)]">Regulations</p>
            <p className="mt-1 text-3xl font-bold">{sortedRegs.length}</p>
            <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
              applicable to {company.name}
            </p>
          </div>
        </Card>
        <Card>
          <div className="p-5">
            <p className="text-sm text-[var(--color-muted-foreground)]">Total Checklist Items</p>
            <p className="mt-1 text-3xl font-bold">{items.length}</p>
            <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
              across all regulations
            </p>
          </div>
        </Card>
      </div>

      {/* Regulation Cards */}
      {sortedRegs.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="text-lg font-medium">No applicable regulations found</p>
          <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
            Complete onboarding to determine which regulations apply to your company.
          </p>
        </Card>
      ) : (
        <div className="space-y-4">
          {sortedRegs.map((cr) => (
            <RegulationCard
              key={cr.id}
              regulation={cr.regulation}
              items={itemsByRegulation.get(cr.regulation_id) ?? []}
              statusMap={statusMap}
              companyId={company.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}
