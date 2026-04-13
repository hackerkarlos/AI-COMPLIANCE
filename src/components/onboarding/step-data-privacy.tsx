'use client';

import type { CompanyProfile } from '@/lib/regulations/matching';

interface StepDataPrivacyProps {
  data: CompanyProfile;
  onChange: (data: Partial<CompanyProfile>) => void;
}

const QUESTIONS = [
  {
    key: 'processes_personal_data' as const,
    title: 'Personal Data Processing',
    question:
      'Does your business collect or process personal data of customers, employees, or others?',
    description:
      'Personal data includes names, email addresses, phone numbers, CPR numbers, location data, and any information that identifies or can identify a person.',
    gdprNote: 'Triggers GDPR obligations',
  },
  {
    key: 'processes_special_categories' as const,
    title: 'Special Categories of Data',
    question:
      'Do you process special categories of personal data?',
    description:
      'Special categories include health/medical data, biometric data, genetic data, racial or ethnic origin, political opinions, religious beliefs, trade union membership, or data about sexual orientation.',
    gdprNote: 'Triggers GDPR Art. 9 — stricter obligations',
  },
  {
    key: 'uses_ai_systems' as const,
    title: 'AI & Automated Decision-Making',
    question:
      'Does your company use AI systems or automated decision-making?',
    description:
      'This includes machine learning models, chatbots, recommendation engines, automated scoring or profiling, CV screening tools, or any system that makes or assists in decisions about people.',
    gdprNote: 'Triggers EU AI Act obligations',
  },
] as const;

export function StepDataPrivacy({ data, onChange }: StepDataPrivacyProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Data & Privacy</h2>
        <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
          Tell us how your business handles personal data. This determines your GDPR and EU AI Act
          obligations.
        </p>
      </div>

      <div className="space-y-3">
        {QUESTIONS.map((q) => {
          const checked = data[q.key];
          return (
            <label
              key={q.key}
              className={`flex cursor-pointer gap-4 rounded-lg border p-4 transition-colors ${
                checked
                  ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/5'
                  : 'border-[var(--color-border)] hover:border-[var(--color-accent)]/50'
              }`}
            >
              <div className="pt-0.5">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded accent-[var(--color-accent)]"
                  checked={checked}
                  onChange={(e) => onChange({ [q.key]: e.target.checked })}
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">{q.question}</p>
                <p className="mt-1 text-xs text-[var(--color-muted-foreground)]">
                  {q.description}
                </p>
                {checked && (
                  <p className="mt-1.5 text-xs font-medium text-[var(--color-accent)]">
                    {q.gdprNote}
                  </p>
                )}
              </div>
            </label>
          );
        })}
      </div>

      <p className="text-xs text-[var(--color-muted-foreground)]">
        Not sure? Check the &ldquo;yes&rdquo; box — it&apos;s better to over-prepare than to miss
        an obligation.
      </p>
    </div>
  );
}
