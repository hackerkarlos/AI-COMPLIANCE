'use client';

import type { CompanyProfile } from '@/lib/regulations/matching';

interface StepActivitiesProps {
  data: CompanyProfile;
  onChange: (data: Partial<CompanyProfile>) => void;
}

const ACTIVITIES = [
  {
    key: 'processes_personal_data' as const,
    emoji: '🔒',
    title: 'Processes Personal Data',
    description:
      'Collects, stores, or processes personal data of customers, employees, or others (names, emails, CPR numbers, etc.)',
  },
  {
    key: 'uses_ai_systems' as const,
    emoji: '🤖',
    title: 'Uses AI Systems',
    description:
      'Develops, deploys, or uses AI/machine learning systems — chatbots, recommendation engines, automated decision-making, etc.',
  },
  {
    key: 'operates_online' as const,
    emoji: '🌐',
    title: 'Provides Digital Services',
    description:
      'Operates a website, mobile app, SaaS platform, or other online/digital service.',
  },
  {
    key: 'processes_payments' as const,
    emoji: '💳',
    title: 'Handles Payments',
    description:
      'Processes, initiates, or facilitates payment transactions (payment provider, PSP, acquirer, etc.)',
  },
  {
    key: 'is_financial_entity' as const,
    emoji: '🏦',
    title: 'Is a Financial Entity',
    description:
      'Bank, insurer, investment firm, payment institution, or other regulated financial entity.',
  },
  {
    key: 'has_critical_infrastructure' as const,
    emoji: '⚡',
    title: 'Critical Infrastructure',
    description:
      'Operates essential infrastructure: energy, water, transport, healthcare, digital infrastructure, etc.',
  },
] as const;

export function StepActivities({ data, onChange }: StepActivitiesProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Business Activities</h2>
        <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
          Select all that apply to your business. This determines which EU and Danish
          regulations are relevant.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        {ACTIVITIES.map((activity) => {
          const checked = data[activity.key];
          return (
            <label
              key={activity.key}
              className={`flex cursor-pointer gap-3 rounded-lg border p-4 transition-colors ${
                checked
                  ? 'border-[var(--color-accent)] bg-[var(--color-accent)]/5'
                  : 'border-[var(--color-border)] hover:border-[var(--color-accent)]/50'
              }`}
            >
              <input
                type="checkbox"
                className="mt-0.5 h-4 w-4 rounded accent-[var(--color-accent)]"
                checked={checked}
                onChange={(e) => onChange({ [activity.key]: e.target.checked })}
              />
              <div className="min-w-0 flex-1">
                <p className="text-sm font-medium">
                  {activity.emoji} {activity.title}
                </p>
                <p className="mt-0.5 text-xs text-[var(--color-muted-foreground)]">
                  {activity.description}
                </p>
              </div>
            </label>
          );
        })}
      </div>
    </div>
  );
}
