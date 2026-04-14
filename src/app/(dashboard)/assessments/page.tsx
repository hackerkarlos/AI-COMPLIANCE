import { redirect } from 'next/navigation';
import Link from 'next/link';
import type { Route } from 'next';
import { createClient } from '@/lib/supabase/server';
import { Card } from '@/components/ui';
import { AssessmentCard } from '@/components/assessment';

interface AssessmentRow {
  id: string;
  created_at: string;
  completed_at: string | null;
  assessment_type: 'initial' | 'periodic' | 'triggered';
  status: 'draft' | 'in_progress' | 'completed' | 'archived';
  overall_score: number;
  overall_risk_level: 'minimal' | 'low' | 'medium' | 'high' | 'critical' | null;
  ai_analysis: Record<string, unknown>;
  recommendations: unknown[];
}

export default async function AssessmentsPage() {
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

  // Fetch assessments ordered by most recent first
  const { data: assessments } = await supabase
    .from('assessments')
    .select('id, created_at, completed_at, assessment_type, status, overall_score, overall_risk_level, ai_analysis, recommendations')
    .eq('company_id', company.id)
    .order('created_at', { ascending: false });

  const assessmentList = (assessments ?? []) as AssessmentRow[];

  // Stats
  const completedCount = assessmentList.filter((a) => a.status === 'completed').length;
  const latestCompleted = assessmentList.find((a) => a.status === 'completed');
  const averageScore = completedCount > 0
    ? Math.round(
        assessmentList
          .filter((a) => a.status === 'completed')
          .reduce((sum, a) => sum + a.overall_score, 0) / completedCount
      )
    : 0;

  return (
    <div className="space-y-8">
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Assessments</h1>
          <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
            AI-powered compliance assessments for {company.name}. Review past results and trigger new evaluations.
          </p>
        </div>
        <Link
          href="/assessments/new"
          className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
        >
          + New Assessment
        </Link>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-5">
          <p className="text-sm text-[var(--color-muted-foreground)]">Total Assessments</p>
          <p className="mt-1 text-3xl font-bold">{assessmentList.length}</p>
          <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
            {completedCount} completed
          </p>
        </div>
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-5">
          <p className="text-sm text-[var(--color-muted-foreground)]">Average Score</p>
          <p className="mt-1 text-3xl font-bold">
            {completedCount > 0 ? `${averageScore}%` : '—'}
          </p>
          <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
            across completed assessments
          </p>
        </div>
        <div className="rounded-lg border border-[var(--color-border)] bg-[var(--color-card)] p-5">
          <p className="text-sm text-[var(--color-muted-foreground)]">Latest Score</p>
          <p className="mt-1 text-3xl font-bold">
            {latestCompleted ? `${latestCompleted.overall_score}%` : '—'}
          </p>
          <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
            {latestCompleted
              ? new Date(latestCompleted.completed_at ?? latestCompleted.created_at).toLocaleDateString('en-DK', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })
              : 'No assessments yet'}
          </p>
        </div>
      </div>

      {/* Assessment List */}
      {assessmentList.length === 0 ? (
        <Card className="p-10 text-center">
          <p className="text-lg font-medium">No assessments yet</p>
          <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
            Run your first AI-powered compliance assessment to get a detailed analysis of your
            regulatory standing.
          </p>
          <div className="mt-4">
            <Link
              href="/assessments/new"
              className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              + First Assessment
            </Link>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Assessment History</h2>
          {assessmentList.map((assessment) => (
            <Link key={assessment.id} href={`/assessments/${assessment.id}` as Route} className="block hover:opacity-90 transition-opacity">
              <AssessmentCard assessment={assessment} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
