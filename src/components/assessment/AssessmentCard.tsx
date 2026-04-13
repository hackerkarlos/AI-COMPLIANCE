import { Card, CardHeader, CardTitle, CardContent, Badge } from '@/components/ui';

interface AssessmentData {
  id: string;
  created_at: string;
  completed_at: string | null;
  assessment_type: 'initial' | 'periodic' | 'triggered';
  status: 'draft' | 'in_progress' | 'completed' | 'archived';
  overall_score: number;
  overall_risk_level: 'minimal' | 'low' | 'medium' | 'high' | 'critical' | null;
  ai_analysis: Record<string, unknown>;
  recommendations: unknown[];
  regulation_name?: string;
}

interface AssessmentCardProps {
  assessment: AssessmentData;
}

const statusLabels: Record<string, { label: string; classes: string }> = {
  draft: { label: 'Draft', classes: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' },
  in_progress: { label: 'In Progress', classes: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300' },
  completed: { label: 'Completed', classes: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' },
  archived: { label: 'Archived', classes: 'bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400' },
};

const typeLabels: Record<string, string> = {
  initial: 'Initial Assessment',
  periodic: 'Periodic Review',
  triggered: 'Triggered Assessment',
};

function getScoreColor(score: number): string {
  if (score >= 80) return 'text-green-600';
  if (score >= 60) return 'text-yellow-600';
  if (score >= 40) return 'text-orange-500';
  return 'text-red-600';
}

export function AssessmentCard({ assessment }: AssessmentCardProps) {
  const statusConfig = statusLabels[assessment.status] ?? { label: 'Draft', classes: 'bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400' };
  const analysis = assessment.ai_analysis as Record<string, unknown> | null;
  const findings = analysis?.key_findings as string[] | undefined;
  const summary = analysis?.summary as string | undefined;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base">
                {typeLabels[assessment.assessment_type] ?? 'Assessment'}
              </CardTitle>
              <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${statusConfig.classes}`}>
                {statusConfig.label}
              </span>
            </div>
            <p className="text-xs text-[var(--color-muted-foreground)]">
              {new Date(assessment.created_at).toLocaleDateString('en-DK', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
              {assessment.completed_at && (
                <> · Completed {new Date(assessment.completed_at).toLocaleDateString('en-DK', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}</>
              )}
            </p>
            {assessment.regulation_name && (
              <p className="text-xs text-[var(--color-muted-foreground)]">
                Regulation: {assessment.regulation_name}
              </p>
            )}
          </div>
          <div className="text-right">
            <p className={`text-2xl font-bold ${getScoreColor(assessment.overall_score)}`}>
              {assessment.overall_score}%
            </p>
            {assessment.overall_risk_level && (
              <Badge variant={assessment.overall_risk_level as 'low' | 'medium' | 'high' | 'critical'}>
                {assessment.overall_risk_level} risk
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      {(summary || (findings && findings.length > 0)) && (
        <CardContent>
          {summary && (
            <p className="text-sm text-[var(--color-muted-foreground)] mb-3">{summary}</p>
          )}
          {findings && findings.length > 0 && (
            <div>
              <p className="text-xs font-medium text-[var(--color-foreground)] mb-1">Key Findings:</p>
              <ul className="space-y-1">
                {findings.slice(0, 4).map((finding, i) => (
                  <li key={i} className="text-xs text-[var(--color-muted-foreground)] flex items-start gap-1.5">
                    <span className="mt-0.5 flex-shrink-0">•</span>
                    <span>{finding}</span>
                  </li>
                ))}
                {findings.length > 4 && (
                  <li className="text-xs text-[var(--color-accent)]">
                    +{findings.length - 4} more findings
                  </li>
                )}
              </ul>
            </div>
          )}
        </CardContent>
      )}
    </Card>
  );
}
