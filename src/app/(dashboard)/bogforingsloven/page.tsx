'use client';

import { useState, useCallback } from 'react';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  Button,
  Select,
  Input,
  Badge,
  Progress,
} from '@/components/ui';
import { cn } from '@/lib/utils';
import {
  checkApplicability,
  analyzeReadiness,
  type BogforingslovenAnswers,
  type ActionItem,
  type ReadinessReport,
  type ComplianceGap,
} from '@/lib/bogforingsloven/assessment';
import { bogfoeringsloven } from '@/lib/ai/prompts/bogfoeringsloven';

// ─── Initial default answers ────────────────────────────────────

const defaultAnswers: BogforingslovenAnswers = {
  cvrRegistered: false,
  companyType: 'enkeltmandsvirksomhed',
  annualRevenue: 'under_100k',
  revenueInDKK: true,
  employeeCount: 'none',
  currentBookkeepingTool: 'none',
  hasDigitalBackup: false,
  hasDigitalVouchers: false,
  usesStandardKontoplan: false,
  recordsTransactionsMonthly: false,
  retainsRecords5Years: false,
  hasVATReporting: false,
  hasAccountant: false,
  registeredAfter2024: false,
};

// ─── Questionnaire Step Definitions ────────────────────────────

type QuestionField = {
  key: keyof BogforingslovenAnswers;
  label: string;
  description?: string;
  type: 'boolean' | 'select' | 'text';
  options?: { value: string; label: string }[];
};

const stepQuestions: Record<number, QuestionField[]> = {
  1: [
    {
      key: 'cvrRegistered',
      label: 'Is your company registered in the Danish CVR register?',
      description: 'The Danish Business Authority (Erhvervsstyrelsen) CVR register is the central company registry.',
      type: 'boolean',
    },
    {
      key: 'registeredAfter2024',
      label: 'Was your company registered after January 2024?',
      description: 'Companies registered after 1 January 2024 fall into an earlier compliance phase.',
      type: 'boolean',
    },
  ],
  2: [
    {
      key: 'companyType',
      label: 'What type of entity is your company?',
      type: 'select',
      options: [
        { value: 'enkeltmandsvirksomhed', label: 'Sole trader (enkeltmandsvirksomhed)' },
        { value: 'aps', label: 'Anpartsselskab (ApS)' },
        { value: 'as', label: 'Aktieselskab (A/S)' },
        { value: 'is_ks', label: 'Partnership (I/S or K/S)' },
        { value: 'branch', label: 'Branch of foreign company' },
        { value: 'other', label: 'Other' },
      ],
    },
    {
      key: 'employeeCount',
      label: 'How many employees does your company have?',
      type: 'select',
      options: [
        { value: 'none', label: 'No employees' },
        { value: '1_5', label: '1-5 employees' },
        { value: '6_20', label: '6-20 employees' },
        { value: '21_50', label: '21-50 employees' },
        { value: 'over_50', label: 'Over 50 employees' },
      ],
    },
    {
      key: 'annualRevenue',
      label: 'What is your company\'s approximate annual revenue?',
      type: 'select',
      options: [
        { value: 'under_100k', label: 'Under DKK 100,000' },
        { value: '100k_300k', label: 'DKK 100,000 – 300,000' },
        { value: '300k_1m', label: 'DKK 300,000 – 1,000,000' },
        { value: '1m_5m', label: 'DKK 1,000,000 – 5,000,000' },
        { value: 'over_5m', label: 'Over DKK 5,000,000' },
      ],
    },
  ],
  3: [
    {
      key: 'currentBookkeepingTool',
      label: 'What bookkeeping tool or system do you currently use?',
      type: 'select',
      options: [
        { value: 'none', label: 'None / No system' },
        { value: 'excel', label: 'Excel / Spreadsheets' },
        { value: 'paper', label: 'Paper-based records' },
        { value: 'approved_cloud', label: 'Approved cloud system (e-conomic, Billy, Dinero, etc.)' },
        { value: 'foreign_tool', label: 'Foreign / Uncertain tool' },
        { value: 'dont_know', label: 'I don\'t know' },
      ],
    },
    {
      key: 'hasDigitalVouchers',
      label: 'Do you store digital vouchers (bilag) for all transactions?',
      description: 'Every transaction must be supported by a digital receipt, invoice, or contract.',
      type: 'boolean',
    },
    {
      key: 'hasDigitalBackup',
      label: 'Does your system have automatic backup?',
      description: 'Backup must store data to a secure, independent location (not just local disk).',
      type: 'boolean',
    },
  ],
  4: [
    {
      key: 'recordsTransactionsMonthly',
      label: 'Do you record financial transactions within the same calendar month?',
      description: '§7 requires all transactions to be recorded promptly — within the month they occur.',
      type: 'boolean',
    },
    {
      key: 'usesStandardKontoplan',
      label: 'Do you use the Danish standard chart of accounts (kontoplan)?',
      description: 'Your chart must follow the Danish standard or be mappable to it.',
      type: 'boolean',
    },
    {
      key: 'retainsRecords5Years',
      label: 'Do you retain bookkeeping records for at least 5 years?',
      description: '§10 requires retaining all records and vouchers for 5 years from the end of the financial year.',
      type: 'boolean',
    },
    {
      key: 'hasVATReporting',
      label: 'Does your bookkeeping support VAT (moms) reporting?',
      description: 'Your system should support quarterly or monthly VAT reporting.',
      type: 'boolean',
    },
    {
      key: 'hasAccountant',
      label: 'Do you have a professional accountant (revisor)?',
      description: 'For ApS/A/S companies, annual accounts must be filed with Erhvervsstyrelsen.',
      type: 'boolean',
    },
  ],
};

// ─── Page Component ────────────────────────────────────────────

export default function BogforingslovenPage() {
  const [answers, setAnswers] = useState<BogforingslovenAnswers>({ ...defaultAnswers });
  const [currentStep, setCurrentStep] = useState(1);
  const [showReport, setShowReport] = useState(false);
  const [actionItems, setActionItems] = useState<ActionItem[]>([]);

  const totalSteps = Object.keys(stepQuestions).length;

  const updateAnswer = useCallback(
    (key: keyof BogforingslovenAnswers, value: string | boolean) => {
      setAnswers((prev) => ({ ...prev, [key]: value }));
    },
    []
  );

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep((s) => s + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((s) => s - 1);
    }
  };

  const handleGenerateReport = () => {
    const report = analyzeReadiness(answers);
    setShowReport(true);
    setActionItems(report.actionItems);
  };

  const handleReset = () => {
    setAnswers({ ...defaultAnswers });
    setCurrentStep(1);
    setShowReport(false);
    setActionItems([]);
  };

  const handleToggleAction = (index: number) => {
    setActionItems((prev) => {
      const copy = [...prev];
      const item = copy[index];
      if (!item) return prev;
      copy[index] = { ...item, done: !item.done };
      return copy;
    });
  };

  const progressPercent = showReport
    ? 100
    : Math.round((currentStep / totalSteps) * 100);

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Bogføringsloven Readiness Checker</h1>
        <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
          Danish Bookkeeping Act (lov nr. 700 af 24/05/2022) compliance assessment
        </p>
      </div>

      {/* Legal Context Card */}
      <Card>
        <CardHeader>
          <CardTitle>Digital Bookkeeping Mandate</CardTitle>
          <CardDescription>
            All companies registered in the Danish CVR register are required to use an approved digital bookkeeping system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm text-[var(--color-muted-foreground)]">
            <p>The 2022 reform of Bogføringsloven introduced mandatory digital bookkeeping with a phased timeline:</p>
            <ul className="ml-5 list-disc space-y-1">
              <li><strong>1 Jan 2024</strong> — Newly registered companies must use approved digital systems</li>
              <li><strong>1 Jan 2025</strong> — Companies with annual revenue &gt; DKK 300,000 must comply</li>
              <li><strong>1 Jan 2026</strong> — <span className="text-[var(--color-risk-high)] font-medium">ALL remaining companies must comply — no exceptions</span></li>
            </ul>
            <p>Approved systems include e-conomic (Visma), Billy, Dinero, Uniconta, and Debitoor.</p>
          </div>
        </CardContent>
      </Card>

      {/* Progress Bar */}
      {!showReport && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--color-muted-foreground)]">
              Step {currentStep} of {totalSteps}
            </span>
            <span className="text-[var(--color-muted-foreground)]">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} />
        </div>
      )}

      {/* Questionnaire Steps */}
      {!showReport && (
        <Card>
          <CardHeader>
            <CardTitle>
              {currentStep === 1 && 'Company Registration'}
              {currentStep === 2 && 'Company Profile'}
              {currentStep === 3 && 'Bookkeeping System'}
              {currentStep === 4 && 'Compliance Practices'}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {stepQuestions[currentStep]?.map((q) => (
              <QuestionField
                key={q.key}
                question={q}
                value={answers[q.key]}
                onChange={(v) => updateAnswer(q.key, v)}
              />
            ))}
          </CardContent>
          <CardFooter className="flex justify-between border-t border-[var(--color-border)] px-6 py-4">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
            >
              ← Back
            </Button>
            <div className="flex gap-3">
              {currentStep < totalSteps ? (
                <Button onClick={handleNext}>
                  Next →
                </Button>
              ) : (
                <Button onClick={handleGenerateReport}>
                  Generate Readiness Report
                </Button>
              )}
            </div>
          </CardFooter>
        </Card>
      )}

      {/* Readiness Report */}
      {showReport && <ReadinessSection answers={answers} actionItems={actionItems} onToggleAction={handleToggleAction} onReset={handleReset} />}
    </div>
  );
}

// ─── Questionnaire Field ──────────────────────────────────────

function QuestionField({
  question,
  value,
  onChange,
}: {
  question: QuestionField;
  value: BogforingslovenAnswers[keyof BogforingslovenAnswers];
  onChange: (value: string | boolean) => void;
}) {
  if (question.type === 'boolean') {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium">{question.label}</label>
        {question.description && (
          <p className="text-xs text-[var(--color-muted-foreground)]">{question.description}</p>
        )}
        <div className="flex gap-3 pt-1">
          <button
            onClick={() => onChange(true)}
            className={cn(
              'px-4 py-2 rounded-md text-sm font-medium transition-colors',
              value === true
                ? 'bg-[var(--color-accent)] text-[var(--color-accent-foreground)]'
                : 'border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)]'
            )}
          >
            ✅ Yes
          </button>
          <button
            onClick={() => onChange(false)}
            className={cn(
              'px-4 py-2 rounded-md text-sm font-medium transition-colors',
              value === false
                ? 'bg-[var(--color-risk-high)] text-white'
                : 'border border-[var(--color-border)] bg-[var(--color-background)] text-[var(--color-muted-foreground)] hover:bg-[var(--color-muted)]'
            )}
          >
            ❌ No
          </button>
        </div>
      </div>
    );
  }

  if (question.type === 'select') {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium">{question.label}</label>
        {question.description && (
          <p className="text-xs text-[var(--color-muted-foreground)]">{question.description}</p>
        )}
        <Select
          className="max-w-md"
          value={value as string}
          onChange={(e) => onChange(e.target.value)}
        >
          {question.options?.map((o) => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </Select>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{question.label}</label>
      {question.description && (
        <p className="text-xs text-[var(--color-muted-foreground)]">{question.description}</p>
      )}
      <Input
        className="max-w-md"
        value={value as string}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

// ─── Readiness Report Section ──────────────────────────────────

function ReadinessSection({
  answers,
  actionItems,
  onToggleAction,
  onReset,
}: {
  answers: BogforingslovenAnswers;
  actionItems: ActionItem[];
  onToggleAction: (index: number) => void;
  onReset: () => void;
}) {
  const report: ReadinessReport = analyzeReadiness(answers);
  const completedActions = actionItems.filter((a) => a.done).length;
  const actionProgressPercent =
    actionItems.length > 0
      ? Math.round((completedActions / actionItems.length) * 100)
      : 100;

  const scoreColor = getScoreColor(report.readinessScore);

  return (
    <div className="space-y-8">
      {/* Score Card */}
      <Card>
        <CardHeader>
          <CardTitle>Readiness Score</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col items-center space-y-3">
          <div
            className={cn(
              'flex h-32 w-32 items-center justify-center rounded-full text-4xl font-bold',
              scoreColor.color
            )}
          >
            {report.readinessScore}%
          </div>
          <Badge variant={riskVariant(report.riskLevel)}>
            {report.riskLevel.toUpperCase()} RISK
          </Badge>
          <p className="text-sm text-[var(--color-muted-foreground)]">
            {report.applicable
              ? `Bogføringsloven applies to your company.`
              : 'Your company is not currently subject to Bogføringsloven.'}
          </p>
        </CardContent>
      </Card>

      {/* Applicability */}
      {report.applicable && (
        <Card>
          <CardHeader>
            <CardTitle>Applicability</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-relaxed">{report.applicabilityReason}</p>
            <div className="rounded-md border border-[var(--color-risk-high)]/30 bg-[var(--color-risk-high)]/5 px-4 py-3">
              <p className="text-sm font-medium text-[var(--color-risk-high)]">
                Deadline: {report.deadline}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Compliance Gaps */}
      {report.gaps.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Compliance Gaps</CardTitle>
            <CardDescription>
              {report.gaps.length} gap{report.gaps.length > 1 ? 's' : ''} identified
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {report.gaps.map((gap, i) => (
                <li
                  key={i}
                  className="rounded-md border border-[var(--color-border)] bg-[var(--color-card)] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <Badge variant={severityVariant(gap.severity)}>{gap.severity}</Badge>
                        <p className="text-sm font-medium">{gap.title}</p>
                      </div>
                      <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
                        {gap.description}
                      </p>
                      <p className="mt-1 text-xs font-mono text-[var(--color-muted-foreground)]">
                        {gap.legalBasis}
                      </p>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Action Items Checklist */}
      {actionItems.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Action Items</CardTitle>
              <span className="text-sm text-[var(--color-muted-foreground)]">
                {completedActions}/{actionItems.length} completed
              </span>
            </div>
            <div className="mt-3">
              <Progress value={actionProgressPercent} />
            </div>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {actionItems.map((item, i) => (
                <li
                  key={item.id}
                  className={cn(
                    'flex items-start gap-3 rounded-md border px-4 py-3 transition-colors',
                    item.done && 'bg-[var(--color-muted)]/50 opacity-60'
                  )}
                >
                  <button
                    onClick={() => onToggleAction(i)}
                    className={cn(
                      'mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded border text-xs transition-colors',
                      item.done
                        ? 'border-[var(--color-accent)] bg-[var(--color-accent)] text-white'
                        : 'border-[var(--color-border)] bg-[var(--color-background)] hover:bg-[var(--color-muted)]'
                    )}
                    aria-label={item.done ? 'Mark as not done' : 'Mark as done'}
                  >
                    {item.done ? '✓' : ''}
                  </button>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p
                        className={cn(
                          'text-sm font-medium',
                          item.done && 'line-through text-[var(--color-muted-foreground)]'
                        )}
                      >
                        {item.title}
                      </p>
                      <Badge variant={priorityVariant(item.priority)}>{item.priority}</Badge>
                    </div>
                    <p className="mt-0.5 text-xs text-[var(--color-muted-foreground)]">
                      {item.description}
                    </p>
                    <div className="mt-1 flex gap-2 text-xs text-[var(--color-muted-foreground)]">
                      <span>Effort: {item.estimatedEffort}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter className="border-t border-[var(--color-border)] px-6 py-4">
            <Button variant="outline" onClick={onReset}>
              ← Retake Assessment
            </Button>
          </CardFooter>
        </Card>
      )}

      {/* AI Analysis Card */}
      <Card>
        <CardHeader>
          <CardTitle>AI Analysis Available</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="text-sm text-[var(--color-muted-foreground)]">
            The Bogføringsloven readiness checker can optionally generate an AI-powered analysis
            that provides detailed guidance tailored to your company profile.
          </p>
          <div className="rounded-md border border-[var(--color-border)] bg-[var(--color-muted)]/30 p-3">
            <p className="text-xs text-[var(--color-muted-foreground)] font-mono leading-relaxed line-clamp-4">
              {bogfoeringsloven.slice(0, 300)}...
            </p>
          </div>
          <p className="text-xs text-[var(--color-muted-foreground)]">
            AI analysis runs server-side using our prompt context from{' '}
            <code className="text-xs">src/lib/ai/prompts/bogfoeringsloven.ts</code>.
          </p>
        </CardContent>
      </Card>

      {/* No gaps found */}
      {report.gaps.length === 0 && report.applicable && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-lg font-semibold text-[var(--color-risk-minimal)]">
              ✅ No compliance gaps found!
            </p>
            <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
              Your company appears to be fully aligned with Bogføringsloven requirements.
              Keep maintaining your digital bookkeeping practices.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

// ─── Style Helpers ──────────────────────────────────────────────

function getScoreColor(score: number): { color: string } {
  if (score >= 90) return { color: 'text-[var(--color-risk-minimal)] bg-[var(--color-risk-minimal)]/10' };
  if (score >= 70) return { color: 'text-[var(--color-risk-low)] bg-[var(--color-risk-low)]/10' };
  if (score >= 50) return { color: 'text-[var(--color-risk-medium)] bg-[var(--color-risk-medium)]/10' };
  return { color: 'text-[var(--color-risk-high)] bg-[var(--color-risk-high)]/10' };
}

function severityVariant(sev: ComplianceGap['severity']): 'critical' | 'high' | 'medium' | 'low' {
  return sev;
}

function priorityVariant(pri: ActionItem['priority']): 'critical' | 'high' | 'medium' | 'low' {
  return pri;
}

function riskVariant(risk: ReadinessReport['riskLevel']): 'critical' | 'high' | 'medium' | 'low' {
  switch (risk) {
    case 'critical': return 'critical';
    case 'high': return 'high';
    case 'medium': return 'medium';
    case 'low': return 'low';
  }
}
