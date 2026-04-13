import { notFound, redirect } from 'next/navigation';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';
import { Badge } from '@/components/ui';
import { RiskMatrix } from '@/components/assessment/RiskMatrix';

export const dynamic = 'force-dynamic';

// ─── Types ────────────────────────────────────────────────────

interface ChecklistAssessment {
  checklist_item_code: string;
  status:
    | 'likely_compliant'
    | 'partially_compliant'
    | 'likely_non_compliant'
    | 'unknown'
    | 'not_applicable';
  confidence: number;
  finding: string;
  recommendation: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  effort_estimate: string;
}

interface TopRecommendation {
  title: string;
  description: string;
  priority: 'critical' | 'high' | 'medium' | 'low';
  timeline: string;
}

interface AiAnalysis {
  regulation_id: string;
  regulation_slug: string;
  regulation_name: string;
  executive_summary: string;
  checklist_assessments: ChecklistAssessment[];
  penalties_exposure: string;
  danish_specific_notes: string;
}

// ─── Helpers ──────────────────────────────────────────────────

const PRIORITY_ORDER: Record<string, number> = {
  critical: 0,
  high: 1,
  medium: 2,
  low: 3,
};

type StatusKey = 'likely_non_compliant' | 'partially_compliant' | 'likely_compliant' | 'unknown' | 'not_applicable';
type PriorityKey = 'critical' | 'high' | 'medium' | 'low';

const PRIORITY_COLORS: Record<PriorityKey, { badge: string; dot: string }> = {
  critical: { badge: 'border-red-300 bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300', dot: 'bg-red-500' },
  high: { badge: 'border-orange-300 bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300', dot: 'bg-orange-500' },
  medium: { badge: 'border-yellow-300 bg-yellow-50 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-300', dot: 'bg-yellow-400' },
  low: { badge: 'border-green-300 bg-green-50 text-green-700 dark:bg-green-900/20 dark:text-green-300', dot: 'bg-green-500' },
};

const STATUS_LABELS: Record<StatusKey, { label: string; icon: string; classes: string }> = {
  likely_non_compliant: { label: 'Non-Compliant', icon: '✗', classes: 'text-red-600 bg-red-50 border-red-200 dark:bg-red-900/10 dark:text-red-400' },
  partially_compliant: { label: 'Partial', icon: '~', classes: 'text-orange-600 bg-orange-50 border-orange-200 dark:bg-orange-900/10 dark:text-orange-400' },
  likely_compliant: { label: 'Compliant', icon: '✓', classes: 'text-green-600 bg-green-50 border-green-200 dark:bg-green-900/10 dark:text-green-400' },
  unknown: { label: 'Unknown', icon: '?', classes: 'text-gray-500 bg-gray-50 border-gray-200 dark:bg-gray-900/10' },
  not_applicable: { label: 'N/A', icon: '—', classes: 'text-gray-400 bg-gray-50 border-gray-200 dark:bg-gray-900/10' },
};

function getStatusInfo(status: StatusKey | string) {
  return STATUS_LABELS[status as StatusKey] ?? STATUS_LABELS.unknown;
}

function getPriorityStyle(priority: PriorityKey | string) {
  return PRIORITY_COLORS[priority as PriorityKey] ?? PRIORITY_COLORS.medium;
}

/**
 * Derive likelihood (1–5) from compliance status and AI confidence.
 * Higher confidence that a gap exists → higher likelihood of a risk materialising.
 */
function toLikelihood(item: ChecklistAssessment): number {
  const base: Record<string, number> = {
    likely_non_compliant: 5,
    partially_compliant: 3,
    unknown: 3,
    likely_compliant: 1,
    not_applicable: 0,
  };
  const raw = base[item.status] ?? 1;
  if (raw === 0) return 0;
  // Clamp: confident non-compliance → stay high; uncertain → pull toward middle
  if (item.status === 'likely_non_compliant') {
    return Math.max(3, Math.round(raw * item.confidence + 1 * (1 - item.confidence)));
  }
  return raw;
}

/** Derive impact (1–5) from checklist item priority. */
function toImpact(priority: string): number {
  const map: Record<string, number> = { critical: 5, high: 4, medium: 3, low: 2 };
  return map[priority] ?? 2;
}

/** Group checklist assessments by GDPR category prefix. */
function inferCategory(code: string): string {
  const categoryMap: Record<string, string> = {
    'GDPR-01': 'Lawful Basis',
    'GDPR-13': 'Lawful Basis',
    'GDPR-02': 'Documentation',
    'GDPR-03': 'Transparency',
    'GDPR-04': 'Data Subject Rights',
    'GDPR-05': 'Data Subject Rights',
    'GDPR-06': 'Data Subject Rights',
    'GDPR-07': 'Risk Assessment',
    'GDPR-08': 'Governance',
    'GDPR-09': 'Incident Response',
    'GDPR-10': 'Third Parties',
    'GDPR-11': 'Security',
    'GDPR-12': 'Security',
    'GDPR-14': 'Data Quality',
    'GDPR-15': 'Data Quality',
    'GDPR-16': 'Governance',
    'GDPR-17': 'Governance',
    'GDPR-18': 'Governance',
    'GDPR-19': 'International Transfers',
    'GDPR-20': 'Incident Response',
  };
  return categoryMap[code] ?? 'General';
}

function scoreColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  if (score >= 40) return 'text-orange-500';
  return 'text-red-600';
}

function riskLevelVariant(level: string): 'minimal' | 'low' | 'medium' | 'high' | 'critical' {
  const valid = ['minimal', 'low', 'medium', 'high', 'critical'];
  return valid.includes(level) ? (level as ReturnType<typeof riskLevelVariant>) : 'medium';
}

// ─── Page ─────────────────────────────────────────────────────

export default async function AssessmentReportPage({
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
    .select('id, name, onboarding_completed')
    .eq('user_id', user.id)
    .single();

  if (!company?.onboarding_completed) redirect('/onboarding');

  // Fetch the assessment
  const { data: assessment } = await supabase
    .from('assessments')
    .select(
      'id, created_at, completed_at, assessment_type, status, overall_score, overall_risk_level, ai_analysis, recommendations'
    )
    .eq('id', id)
    .eq('company_id', company.id)
    .single();

  if (!assessment) notFound();

  const analysis = assessment.ai_analysis as AiAnalysis | null;
  const recommendations = (assessment.recommendations ?? []) as TopRecommendation[];

  if (!analysis) notFound();

  const checklistItems = analysis.checklist_assessments ?? [];

  // ── Data Processing Inventory ────────────────────────────────
  // Group all items by their GDPR category
  const inventoryByCategory = new Map<string, ChecklistAssessment[]>();
  for (const item of checklistItems) {
    const cat = inferCategory(item.checklist_item_code);
    const list = inventoryByCategory.get(cat) ?? [];
    list.push(item);
    inventoryByCategory.set(cat, list);
  }

  // ── Risk Matrix data ─────────────────────────────────────────
  const matrixItems = checklistItems
    .filter((item) => item.status !== 'not_applicable')
    .map((item) => {
      const likelihood = toLikelihood(item);
      const impact = toImpact(item.priority);
      return {
        code: item.checklist_item_code,
        title: item.checklist_item_code, // code is the concise identifier
        likelihood,
        impact,
        status: item.status,
        priority: item.priority,
      };
    })
    .filter((item) => item.likelihood > 0);

  // Risk distribution summary
  const criticalCount = matrixItems.filter((i) => i.likelihood >= 4 && i.impact >= 4).length;
  const highCount = matrixItems.filter(
    (i) => (i.likelihood >= 3 || i.impact >= 3) && !(i.likelihood >= 4 && i.impact >= 4)
  ).length;
  const mediumCount = matrixItems.filter((i) => i.likelihood === 2 || i.impact === 2).length;
  const lowCount = matrixItems.filter((i) => i.likelihood === 1 && i.impact <= 2).length;

  // ── Gap Analysis ─────────────────────────────────────────────
  const gaps = checklistItems
    .filter(
      (item) =>
        item.status === 'likely_non_compliant' || item.status === 'partially_compliant'
    )
    .sort(
      (a, b) =>
        (PRIORITY_ORDER[a.priority] ?? 9) - (PRIORITY_ORDER[b.priority] ?? 9)
    );

  // ── Stats ────────────────────────────────────────────────────
  const compliantCount = checklistItems.filter((i) => i.status === 'likely_compliant').length;
  const partialCount = checklistItems.filter((i) => i.status === 'partially_compliant').length;
  const nonCompliantCount = checklistItems.filter((i) => i.status === 'likely_non_compliant').length;

  const reportDate = assessment.completed_at ?? assessment.created_at;

  return (
    <>
      {/* ── Print CSS ─────────────────────────────────────── */}
      <style>{`
        @media print {
          /* Hide navigation and sidebar */
          nav, aside, [data-sidebar], .no-print { display: none !important; }
          /* Reset page background */
          body { background: white !important; color: black !important; }
          /* Full-width layout */
          main, [data-main-content] { padding: 0 !important; margin: 0 !important; width: 100% !important; }
          /* Page breaks */
          .print-break-before { page-break-before: always; break-before: page; }
          .print-avoid-break { page-break-inside: avoid; break-inside: avoid; }
          /* Links */
          a[href]::after { content: " (" attr(href) ")"; font-size: 0.75em; opacity: 0.7; }
          a.no-href-print::after { content: none; }
          /* Colours for printing */
          .bg-red-600, .bg-orange-500, .bg-yellow-400, .bg-green-300 {
            print-color-adjust: exact; -webkit-print-color-adjust: exact;
          }
        }
        @page {
          margin: 1.5cm;
          @top-right { content: "EUComply — GDPR Risk Report"; font-size: 9pt; }
          @bottom-right { content: counter(page) " / " counter(pages); font-size: 9pt; }
        }
      `}</style>

      <div className="space-y-8 pb-16">

        {/* ── Breadcrumb ──────────────────────────────────── */}
        <nav className="no-print text-sm text-[var(--color-muted-foreground)]">
          <Link href="/assessments" className="hover:underline">Assessments</Link>
          <span className="mx-2">/</span>
          <span className="text-[var(--color-foreground)]">
            {analysis.regulation_name} Report
          </span>
        </nav>

        {/* ── Header Card ─────────────────────────────────── */}
        <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 print-avoid-break">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-bold tracking-tight">
                  {analysis.regulation_name} Risk Assessment Report
                </h1>
                <Badge variant={riskLevelVariant(assessment.overall_risk_level ?? 'medium')}>
                  {assessment.overall_risk_level ?? 'unknown'} risk
                </Badge>
              </div>
              <p className="text-sm text-[var(--color-muted-foreground)]">
                {company.name} &middot;{' '}
                {new Date(reportDate).toLocaleDateString('en-DK', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}
              </p>
              <p className="text-xs text-[var(--color-muted-foreground)] capitalize">
                {assessment.assessment_type === 'initial' ? 'Initial assessment' : 'Periodic review'}
                &nbsp;&middot;&nbsp;
                {checklistItems.length} items evaluated
              </p>
            </div>

            {/* Score circle */}
            <div className="flex flex-shrink-0 items-center gap-4">
              <div className="text-center">
                <p className={`text-5xl font-bold tabular-nums ${scoreColor(assessment.overall_score)}`}>
                  {assessment.overall_score}
                </p>
                <p className="text-xs text-[var(--color-muted-foreground)]">/ 100</p>
                <p className="text-xs font-medium text-[var(--color-muted-foreground)]">Compliance Score</p>
              </div>

              {/* Print button */}
              <button
                onClick={() => window.print()}
                className="no-print rounded-md border border-[var(--color-border)] px-3 py-2 text-sm hover:bg-[var(--color-muted)] transition-colors"
              >
                Export PDF
              </button>
            </div>
          </div>

          {/* Quick stats row */}
          <div className="mt-5 grid grid-cols-2 gap-3 border-t border-[var(--color-border)] pt-5 sm:grid-cols-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{compliantCount}</p>
              <p className="text-xs text-[var(--color-muted-foreground)]">Compliant</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-500">{partialCount}</p>
              <p className="text-xs text-[var(--color-muted-foreground)]">Partial</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-red-600">{nonCompliantCount}</p>
              <p className="text-xs text-[var(--color-muted-foreground)]">Non-Compliant</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold">{gaps.length}</p>
              <p className="text-xs text-[var(--color-muted-foreground)]">Gaps to Address</p>
            </div>
          </div>
        </div>

        {/* ── Executive Summary ────────────────────────────── */}
        <section className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-6 print-avoid-break">
          <h2 className="mb-4 text-lg font-semibold">Executive Summary</h2>
          <div className="space-y-3 text-sm leading-relaxed text-[var(--color-foreground)]">
            {analysis.executive_summary.split('\n\n').map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </section>

        {/* ── Data Processing Inventory ───────────────────── */}
        <section className="print-break-before">
          <h2 className="mb-4 text-lg font-semibold">Data Processing Inventory</h2>
          <p className="mb-4 text-sm text-[var(--color-muted-foreground)]">
            GDPR compliance status across all processing areas. Each area maps to one or more
            Article 30 record categories.
          </p>
          <div className="overflow-hidden rounded-xl border border-[var(--color-border)]">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-[var(--color-border)] bg-[var(--color-muted)]/40">
                  <th className="px-4 py-3 text-left font-semibold">Processing Area</th>
                  <th className="px-4 py-3 text-center font-semibold">Items</th>
                  <th className="px-4 py-3 text-center font-semibold hidden sm:table-cell">Compliant</th>
                  <th className="px-4 py-3 text-center font-semibold hidden sm:table-cell">Gaps</th>
                  <th className="px-4 py-3 text-left font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[var(--color-border)]">
                {Array.from(inventoryByCategory.entries()).map(([category, catItems]) => {
                  const catCompliant = catItems.filter((i) => i.status === 'likely_compliant').length;
                  const catGaps = catItems.filter(
                    (i) => i.status === 'likely_non_compliant' || i.status === 'partially_compliant'
                  ).length;
                  const overallStatus =
                    catGaps === 0
                      ? 'likely_compliant'
                      : catCompliant === 0
                        ? 'likely_non_compliant'
                        : 'partially_compliant';
                  const safeStatus = getStatusInfo(overallStatus);
                  return (
                    <tr key={category} className="bg-[var(--color-card)] hover:bg-[var(--color-muted)]/20">
                      <td className="px-4 py-3 font-medium">{category}</td>
                      <td className="px-4 py-3 text-center text-[var(--color-muted-foreground)]">
                        {catItems.length}
                      </td>
                      <td className="hidden px-4 py-3 text-center text-green-600 sm:table-cell">
                        {catCompliant}
                      </td>
                      <td className="hidden px-4 py-3 text-center text-red-600 sm:table-cell">
                        {catGaps}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${safeStatus.classes}`}
                        >
                          <span>{safeStatus.icon}</span>
                          {safeStatus.label}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* ── Risk Matrix ──────────────────────────────────── */}
        <section className="print-break-before">
          <h2 className="mb-4 text-lg font-semibold">Risk Matrix</h2>
          <p className="mb-4 text-sm text-[var(--color-muted-foreground)]">
            5&times;5 likelihood &times; impact matrix. Likelihood is derived from AI-assessed
            compliance status and confidence. Impact is derived from regulatory priority.
          </p>

          <div className="grid gap-6 lg:grid-cols-3">
            {/* Matrix */}
            <div className="lg:col-span-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 print-avoid-break">
              <RiskMatrix items={matrixItems} />
            </div>

            {/* Risk summary sidebar */}
            <div className="space-y-3">
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 print-avoid-break">
                <h3 className="mb-3 text-sm font-semibold">Risk Distribution</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-red-600" />
                      Critical
                    </span>
                    <span className="font-bold text-red-600">{criticalCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-orange-500" />
                      High
                    </span>
                    <span className="font-bold text-orange-500">{highCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-yellow-400" />
                      Medium
                    </span>
                    <span className="font-bold text-yellow-600">{mediumCount}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                      <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
                      Low
                    </span>
                    <span className="font-bold text-green-600">{lowCount}</span>
                  </div>
                </div>
              </div>

              {/* Risk interpretation */}
              <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 print-avoid-break">
                <h3 className="mb-2 text-sm font-semibold">Interpretation</h3>
                <p className="text-xs leading-relaxed text-[var(--color-muted-foreground)]">
                  Items in the red zone (likelihood ≥4 and impact ≥4) represent immediate regulatory
                  exposure. Address these before the next Datatilsynet inspection cycle.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ── Gap Analysis ─────────────────────────────────── */}
        <section className="print-break-before">
          <h2 className="mb-1 text-lg font-semibold">Gap Analysis</h2>
          <p className="mb-4 text-sm text-[var(--color-muted-foreground)]">
            {gaps.length} item{gaps.length !== 1 ? 's' : ''} require action, sorted by regulatory priority.
          </p>

          {gaps.length === 0 ? (
            <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-8 text-center">
              <p className="text-2xl">✓</p>
              <p className="mt-2 font-medium">No gaps identified</p>
              <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
                All checklist items are assessed as likely compliant.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {gaps.map((item) => {
                const priorityStyle = getPriorityStyle(item.priority);
                const statusInfo = getStatusInfo(item.status);
                return (
                  <div
                    key={item.checklist_item_code}
                    className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 print-avoid-break"
                  >
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <span className="rounded bg-[var(--color-muted)] px-2 py-0.5 font-mono text-xs font-bold">
                          {item.checklist_item_code}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${priorityStyle.badge}`}
                        >
                          {item.priority}
                        </span>
                        <span
                          className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${statusInfo.classes}`}
                        >
                          {statusInfo.icon} {statusInfo.label}
                        </span>
                      </div>
                      <span className="text-xs text-[var(--color-muted-foreground)]">
                        Effort: {item.effort_estimate}
                      </span>
                    </div>

                    <div className="mt-3 space-y-2">
                      <div>
                        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
                          Finding
                        </p>
                        <p className="mt-1 text-sm leading-relaxed">{item.finding}</p>
                      </div>
                      <div className="border-t border-[var(--color-border)] pt-2">
                        <p className="text-xs font-semibold uppercase tracking-wider text-[var(--color-muted-foreground)]">
                          Recommended Action
                        </p>
                        <p className="mt-1 text-sm leading-relaxed">{item.recommendation}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── Prioritised Recommendations ──────────────────── */}
        {recommendations.length > 0 && (
          <section className="print-break-before">
            <h2 className="mb-1 text-lg font-semibold">Prioritised Recommendations</h2>
            <p className="mb-4 text-sm text-[var(--color-muted-foreground)]">
              Top actions ranked by urgency and regulatory impact.
            </p>
            <div className="space-y-4">
              {recommendations.map((rec, index) => {
                const priorityStyle = getPriorityStyle(rec.priority);
                return (
                  <div
                    key={index}
                    className="flex gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 print-avoid-break"
                  >
                    {/* Number */}
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-[var(--color-muted)] text-sm font-bold">
                      {index + 1}
                    </div>
                    <div className="min-w-0 flex-1 space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-semibold">{rec.title}</h3>
                        <span
                          className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-semibold ${priorityStyle.badge}`}
                        >
                          {rec.priority}
                        </span>
                        <span className="text-xs text-[var(--color-muted-foreground)]">
                          {rec.timeline}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed text-[var(--color-muted-foreground)]">
                        {rec.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* ── Penalties & Danish Context ───────────────────── */}
        <section className="grid gap-6 lg:grid-cols-2 print-break-before">
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 print-avoid-break">
            <h2 className="mb-3 text-base font-semibold">Penalties Exposure</h2>
            <p className="text-sm leading-relaxed text-[var(--color-muted-foreground)]">
              {analysis.penalties_exposure}
            </p>
          </div>
          <div className="rounded-xl border border-[var(--color-border)] bg-[var(--color-card)] p-5 print-avoid-break">
            <h2 className="mb-3 text-base font-semibold">Danish-Specific Notes</h2>
            <p className="text-sm leading-relaxed text-[var(--color-muted-foreground)]">
              {analysis.danish_specific_notes}
            </p>
          </div>
        </section>

        {/* ── Footer actions ───────────────────────────────── */}
        <div className="no-print flex flex-wrap items-center justify-between gap-4 rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)]/30 p-5">
          <div>
            <p className="text-sm font-medium">What&apos;s next?</p>
            <p className="text-xs text-[var(--color-muted-foreground)]">
              Address high-priority gaps in the GDPR compliance checklist.
            </p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/regulations/gdpr"
              className="rounded-md border border-[var(--color-border)] bg-[var(--color-card)] px-4 py-2 text-sm font-medium hover:bg-[var(--color-muted)] transition-colors no-href-print"
            >
              Open GDPR Checklist
            </Link>
            <Link
              href="/assessments/new"
              className="rounded-md bg-[var(--color-accent)] px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition-opacity no-href-print"
            >
              Re-run Assessment
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
