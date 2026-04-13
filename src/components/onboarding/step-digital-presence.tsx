'use client';

import { Select } from '@/components/ui';
import type { CompanyProfile } from '@/lib/regulations/matching';

interface StepDigitalPresenceProps {
  data: CompanyProfile;
  onChange: (data: Partial<CompanyProfile>) => void;
}

// Map select values to numeric EUR amounts (lower bound of each bracket)
const REVENUE_OPTIONS = [
  { value: '', label: 'Select approximate revenue...' },
  { value: '0', label: 'Under €500,000' },
  { value: '500000', label: '€500,000 – €2,000,000' },
  { value: '2000000', label: '€2,000,000 – €10,000,000' },
  { value: '10000000', label: 'Over €10,000,000' },
];

const TOGGLE_QUESTIONS = [
  {
    key: 'operates_online' as const,
    question: 'Does your business operate online or provide digital services?',
    description:
      'Includes websites, mobile apps, SaaS platforms, online stores, APIs, or any service delivered digitally to users.',
    regulationNote: 'Relevant for ePrivacy, NIS2 Digital Services',
  },
  {
    key: 'processes_payments' as const,
    question: 'Does your business process payment transactions?',
    description:
      'Includes accepting card payments, acting as a payment service provider (PSP), facilitating transfers, or operating a payment gateway.',
    regulationNote: 'Relevant for PSD2 / DORA',
  },
] as const;

export function StepDigitalPresence({ data, onChange }: StepDigitalPresenceProps) {
  // Convert stored numeric value back to select string
  const revenueSelectValue =
    data.annual_turnover_eur === null || data.annual_turnover_eur === undefined
      ? ''
      : String(data.annual_turnover_eur);

  function handleRevenueChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const val = e.target.value;
    onChange({ annual_turnover_eur: val === '' ? null : parseInt(val, 10) });
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Digital Presence</h2>
        <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
          Tell us how your business operates digitally. This shapes your obligations under ePrivacy,
          NIS2, and payment regulations.
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
        <label htmlFor="revenue" className="text-sm font-medium">
          Approximate Annual Revenue
        </label>
        <Select id="revenue" value={revenueSelectValue} onChange={handleRevenueChange}>
          {REVENUE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </Select>
        <p className="text-xs text-[var(--color-muted-foreground)]">
          Used to determine Bogføringsloven (digital bookkeeping) thresholds. Optional.
        </p>
      </div>
    </div>
  );
}
