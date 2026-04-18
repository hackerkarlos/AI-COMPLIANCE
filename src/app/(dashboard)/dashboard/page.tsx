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
  Progress,
} from '@/components/ui';
import { Skeleton } from '@/components/ui/skeleton';

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
  description: string | null;
  priority: string;
  code: string;
}

/**
 * Get color for compliance level.
 */
function getComplianceColor(pct: number): string {
  if (pct >= 90) return 'text-risk-minimal';
  if (pct >= 70) return 'text-risk-low';
  if (pct >= 50) return 'text-risk-medium';
  return 'text-risk-high';
}

/**
 * Label for urgency based on days remaining.
 */
function urgencyLabel(days: number): { label: string; className: string } {
  if (days <= 0) return { label: 'Enforced', className: 'text-risk-high' };
  if (days <= 30) return { label: `${days} days — urgent`, className: 'text-risk-high' };
  if (days <= 90) return { label: `${days} days`, className: 'text-risk-medium' };
  return { label: `${days} days`, className: 'text-risk-low' };
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
                {nextDeadline.name}—{' '}
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

      {/* Compliance Overview */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {/* Overall Compliance Score — larger card */}
        <Card className="col-span-2 flex flex-col items-center justify-center p-8 lg:col-span-1">
          <ComplianceScore percentage={overallScore} size={110} />
          <p className="mt-4 text-sm font-semibold">Overall Compliance</p>
          <p className="mt-0.5 text-xs text-[var(--color-muted-foreground)]">
            {totalCompleted} of {totalItems} items completed
          </p>
        </Card>

        {/* Applicable Regulations */}
        <Card className="p-6">
          <p className="text-sm font-medium text-[var(--color-muted-foreground)]">Applicable Regulations</p>
          <p className="mt-1 text-4xl font-bold">{regulations.length}</p>
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

        {/* Total Checklist Items */}
        <Card className="p-6">
          <p className="text-sm font-medium text-[var(--color-muted-foreground)]">Checklist Items</p>
          <p className="mt-1 text-4xl font-bold">{totalItems}</p>
          <p className="mt-2 text-xs text-[var(--color-muted-foreground)]">
            across {regulations.length} regulations
          </p>
        </Card>

        {/* Urgent Actions */}
        <Card className="p-6">
          <p className="text-sm font-medium text-[var(--color-muted-foreground)]">Urgent Actions</p>
          <p className={`mt-1 text-4xl font-bold ${urgentItems.length > 0 ? getComplianceColor(urgentItems.length > 3 ? 0 : 40) : 'text-risk-minimal'}`}>
            {urgentItems.length}
          </p>
          <p className="mt-2 text-xs text-[var(--color-muted-foreground)]">
            Critical & high priority items pending
          </p>
        </Card>
      </div>

      {/* Regulation Status Grid */}
      <section>
        <h2 className="mb-4 text-lg font-semibold">Regulation Status</h2>
        {sortedRegs.length === 0 ? (
          <Card className="p-10 text-center">
            <p className="text-lg font-medium">No applicable regulations found</p>
            <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
              Complete onboarding to determine which regulations apply to your company.
            </p>
          </Card>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {sortedRegs.map((cr) => {
              const reg = cr.regulation;
              const compliance = getRegCompliance(cr.regulation_id);
              const stats = regStats.get(cr.regulation_id);
              const color = getComplianceColor(compliance);
              const deadline = reg.enforcement_date
                ? new Date(reg.enforcement_date)
                : null;
              const daysRemaining = deadline
                ? daysUntil(deadline)
                : null;
              const urgency = daysRemaining !== null
                ? urgencyLabel(Math.max(daysRemaining, 0))
                : null;

              return (
                <Card key={cr.id} className="flex flex-col transition-shadow hover:shadow-md">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-0.5">
                        <CardTitle className="text-base">{reg.short_name}</CardTitle>
                        <p className="text-xs text-[var(--color-muted-foreground)]">{reg.name}</p>
                      </div>
                      <Badge variant={reg.risk_level}>{reg.risk_level}</Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="flex items-center gap-3">
                      <ComplianceScore percentage={compliance} size={52} />
                      <div>
                        <p className={`text-sm font-semibold ${color}`}>{compliance}% compliant</p>
                        <p className="text-xs text-[var(--color-muted-foreground)]">
                          {stats?.completed ?? 0}/{stats?.total ?? 0} items
                        </p>
                      </div>
                    </div>
                    <div className="mt-3">
                      <Progress value={compliance} aria-label={`Compliance: ${compliance}% for ${reg.short_name}`} />
                    </div>
                    {deadline && (
                      <p className={`mt-2 text-xs ${urgency?.className}`}>
                        Enforcement: {deadline.toLocaleDateString('en-DK', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                        })}{' '}
                        · {urgency?.label}
                      </p>
                    )}
                  </CardContent>
                  <div className="border-t border-[var(--color-border)] px-6 py-3">
                    <Link
                      href={`/regulations/${reg.slug}`}
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
      <section>
        <h2 className="mb-4 text-lg font-semibold">Urgent Actions</h2>
        {urgentItems.length === 0 ? (
          <Card className="p-10 text-center">
            <p className="text-lg font-medium">All clear!</p>
            <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
              No critical or high-priority items are pending. Great job!
            </p>
          </Card>
        ) : (
          <Card>
            <ul className="divide-y divide-[var(--color-border)]">
              {urgentItems.map((item) => (
                <li key={item.id} className="flex items-center justify-between px-6 py-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{item.title}</p>
                      <Badge variant={item.priority as 'critical' | 'high'}>{item.priority}</Badge>
                    </div>
                    <p className="text-xs text-[var(--color-muted-foreground)]">
                      {item.regulationName} · {item.code}
                    </p>
                    {item.description && (
                      <p className="mt-1 truncate text-xs text-[var(--color-muted-foreground)]">
                        {item.description}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </section>
    </div>
  );
}
