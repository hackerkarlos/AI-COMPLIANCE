import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { ComplianceScore } from '@/components/RiskIndicator';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Badge,
} from '@/components/ui';

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
  title: string;
  priority: string;
  code: string;
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // Get user's company
  const { data: company } = await supabase
    .from('companies')
    .select('id, name, onboarding_completed')
    .eq('user_id', user.id)
    .single();

  if (!company?.onboarding_completed) {
    redirect('/onboarding');
  }

  // Fetch applicable regulations and checklist progress in parallel
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
  const checklist = companyChecklist ?? [];

  // Fetch all checklist items for applicable regulations
  const regIds = regulations.map((cr) => cr.regulation_id);
  const { data: allItems } =
    regIds.length > 0
      ? await supabase
          .from('checklist_items')
          .select('id, regulation_id, title, priority, code')
          .in('regulation_id', regIds)
          .eq('is_active', true)
      : { data: [] as ChecklistItemRow[] };

  const items = (allItems ?? []) as ChecklistItemRow[];

  // Build status lookups
  const completedIds = new Set(
    checklist.filter((c) => c.status === 'completed').map((c) => c.checklist_item_id)
  );
  const notApplicableIds = new Set(
    checklist.filter((c) => c.status === 'not_applicable').map((c) => c.checklist_item_id)
  );

  // Per-regulation compliance stats
  const regStats = new Map<string, { total: number; completed: number }>();
  for (const item of items) {
    if (notApplicableIds.has(item.id)) continue;
    const stats = regStats.get(item.regulation_id) ?? { total: 0, completed: 0 };
    stats.total++;
    if (completedIds.has(item.id)) stats.completed++;
    regStats.set(item.regulation_id, stats);
  }

  // Overall compliance score
  let totalItems = 0;
  let totalCompleted = 0;
  for (const stats of regStats.values()) {
    totalItems += stats.total;
    totalCompleted += stats.completed;
  }
  const overallScore = totalItems > 0 ? Math.round((totalCompleted / totalItems) * 100) : 0;

  // Sort regulations by display_order
  const sortedRegs = [...regulations].sort(
    (a, b) => (a.regulation.display_order ?? 0) - (b.regulation.display_order ?? 0)
  );

  // Regulation lookup for urgent items
  const regMap = new Map(regulations.map((cr) => [cr.regulation_id, cr.regulation]));

  // Urgent actions: critical/high priority, incomplete, applicable
  const priorityRank: Record<string, number> = { critical: 0, high: 1, medium: 2, low: 3 };
  const urgentItems = items
    .filter(
      (item) =>
        (item.priority === 'critical' || item.priority === 'high') &&
        !completedIds.has(item.id) &&
        !notApplicableIds.has(item.id)
    )
    .sort((a, b) => (priorityRank[a.priority] ?? 2) - (priorityRank[b.priority] ?? 2))
    .slice(0, 5)
    .map((item) => ({
      ...item,
      regulationName: regMap.get(item.regulation_id)?.short_name ?? '',
    }));

  // Nearest upcoming enforcement deadline
  const now = new Date();
  const nextDeadline =
    sortedRegs
      .filter(
        (cr) => cr.regulation.enforcement_date && new Date(cr.regulation.enforcement_date) > now
      )
      .map((cr) => ({
        name: cr.regulation.name,
        date: new Date(cr.regulation.enforcement_date!),
      }))
      .sort((a, b) => a.date.getTime() - b.date.getTime())[0] ?? null;

  const daysUntil = (date: Date) => Math.ceil((date.getTime() - now.getTime()) / 86_400_000);

  const getRegCompliance = (regId: string) => {
    const stats = regStats.get(regId);
    if (!stats || stats.total === 0) return 0;
    return Math.round((stats.completed / stats.total) * 100);
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
          Compliance overview for {company.name}
        </p>
      </div>

      {/* Enforcement Deadline Banner */}
      {nextDeadline && (
        <div className="rounded-lg border border-[var(--color-risk-high)]/30 bg-[var(--color-risk-high)]/5 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-[var(--color-risk-high)]">
                Upcoming Enforcement Deadline
              </p>
              <p className="mt-1 text-lg font-semibold">
                {nextDeadline.name} —{' '}
                {nextDeadline.date.toLocaleDateString('en-DK', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-[var(--color-risk-high)]">
                {daysUntil(nextDeadline.date)}
              </p>
              <p className="text-xs text-[var(--color-muted-foreground)]">days remaining</p>
            </div>
          </div>
        </div>
      )}

      {/* Summary Cards */}
      <div className="grid gap-6 sm:grid-cols-3">
        <Card className="flex flex-col items-center justify-center p-6">
          <ComplianceScore percentage={overallScore} size={120} />
          <p className="mt-3 text-sm font-medium">Overall Compliance</p>
          <p className="text-xs text-[var(--color-muted-foreground)]">
            {totalCompleted} of {totalItems} items completed
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-[var(--color-muted-foreground)]">Applicable Regulations</p>
          <p className="mt-1 text-3xl font-bold">{regulations.length}</p>
          <p className="mt-2 text-xs text-[var(--color-muted-foreground)]">
            {
              regulations.filter((r) => {
                const s = regStats.get(r.regulation_id);
                return s && s.total > 0 && s.completed === s.total;
              }).length
            }{' '}
            fully compliant
          </p>
        </Card>
        <Card className="p-6">
          <p className="text-sm text-[var(--color-muted-foreground)]">Urgent Actions</p>
          <p className="mt-1 text-3xl font-bold">{urgentItems.length}</p>
          <p className="mt-2 text-xs text-[var(--color-muted-foreground)]">
            Critical & high priority items pending
          </p>
        </Card>
      </div>

      {/* Regulation Status Grid */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">Regulation Status</h2>
        {sortedRegs.length === 0 ? (
          <p className="text-sm text-[var(--color-muted-foreground)]">
            No applicable regulations found.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sortedRegs.map((cr) => {
              const reg = cr.regulation;
              const compliance = getRegCompliance(cr.regulation_id);
              const stats = regStats.get(cr.regulation_id);
              return (
                <Card key={cr.id}>
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-base">{reg.short_name}</CardTitle>
                      <Badge variant={reg.risk_level}>{reg.risk_level}</Badge>
                    </div>
                    <p className="text-xs text-[var(--color-muted-foreground)]">{reg.name}</p>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center gap-3">
                      <ComplianceScore percentage={compliance} size={48} />
                      <div>
                        <p className="text-sm font-medium">{compliance}% compliant</p>
                        <p className="text-xs text-[var(--color-muted-foreground)]">
                          {stats?.completed ?? 0}/{stats?.total ?? 0} items
                        </p>
                      </div>
                    </div>
                  </CardContent>
                  <div className="border-t border-[var(--color-border)] px-6 py-3">
                    <Link
                      href="/regulations"
                      className="text-sm font-medium text-[var(--color-accent)] hover:underline"
                    >
                      View Checklist →
                    </Link>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* Urgent Action Items */}
      {urgentItems.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-semibold">Urgent Actions</h2>
          <Card>
            <ul className="divide-y divide-[var(--color-border)]">
              {urgentItems.map((item) => (
                <li key={item.id} className="flex items-center justify-between px-6 py-4">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-medium">{item.title}</p>
                    <p className="text-xs text-[var(--color-muted-foreground)]">
                      {item.regulationName} · {item.code}
                    </p>
                  </div>
                  <Badge variant={item.priority as 'critical' | 'high'}>{item.priority}</Badge>
                </li>
              ))}
            </ul>
          </Card>
        </section>
      )}
    </div>
  );
}
