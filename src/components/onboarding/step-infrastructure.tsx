'use client';

import { Input } from '@/components/ui';
import type { CompanyProfile } from '@/lib/regulations/matching';

interface StepInfrastructureProps {
  data: CompanyProfile;
  onChange: (data: Partial<CompanyProfile>) => void;
}

const TOGGLE_QUESTIONS = [
  {
    key: 'is_financial_entity' as const,
    question: 'Is your company a regulated financial entity?',
    description:
      'Includes banks, insurance companies, investment firms, payment institutions, crypto-asset service providers, or other entities regulated by Finanstilsynet.',
    regulationNote: 'Triggers DORA, MiFID II / IDD obligations',
  },
  {
    key: 'has_critical_infrastructure' as const,
    question:
      'Does your company operate critical infrastructure or provide essential ICT services?',
    description:
      'Includes energy, water, transport, healthcare, digital infrastructure, cloud providers, managed service providers (MSPs), and large online marketplace or search engine operators.',
    regulationNote: 'Triggers NIS2 Directive obligations',
  },
] as const;

export function StepInfrastructure({ data, onChange }: StepInfrastructureProps) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Infrastructure & Compliance Contact</h2>
        <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
          Tell us about your infrastructure role and who manages compliance. This finalises your
          regulation profile.
        </p>
      </div>

      <div className="space-y-3">
        {TOGGLE_QUESTIONS.map((q) => {
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
                    {q.regulationNote}
                  </p>
                )}
              </div>
            </label>
          );
        })}
      </div>

      <div className="space-y-1.5">
        <label htmlFor="contact_email" className="text-sm font-medium">
          Compliance Contact Email
        </label>
        <Input
          id="contact_email"
          type="email"
          placeholder="compliance@example.com"
          value={data.contact_email}
          onChange={(e) => onChange({ contact_email: e.target.value })}
        />
        <p className="text-xs text-[var(--color-muted-foreground)]">
          Who should receive compliance alerts and deadline reminders? Optional.
        </p>
      </div>
    </div>
  );
}
