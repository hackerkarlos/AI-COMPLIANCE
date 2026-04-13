'use client';

import { useState } from 'react';
import { Input, Select } from '@/components/ui';
import type { CompanyProfile } from '@/lib/regulations/matching';

interface StepCompanyBasicsProps {
  data: CompanyProfile;
  onChange: (data: Partial<CompanyProfile>) => void;
}

const INDUSTRY_SECTORS = [
  { value: '', label: 'Select an industry...' },
  { value: 'technology', label: 'Technology / Software' },
  { value: 'digital_providers', label: 'Digital Service Providers' },
  { value: 'digital_infrastructure', label: 'Digital Infrastructure' },
  { value: 'ict_services', label: 'ICT Services / Managed Services' },
  { value: 'finance', label: 'Finance / Banking' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'fintech', label: 'Fintech / Payments' },
  { value: 'health', label: 'Healthcare' },
  { value: 'energy', label: 'Energy' },
  { value: 'transport', label: 'Transport / Logistics' },
  { value: 'manufacturing', label: 'Manufacturing' },
  { value: 'food', label: 'Food Production / Distribution' },
  { value: 'retail', label: 'Retail / E-Commerce' },
  { value: 'real_estate', label: 'Real Estate' },
  { value: 'legal', label: 'Legal Services' },
  { value: 'accounting', label: 'Accounting / Audit' },
  { value: 'consulting', label: 'Consulting / Professional Services' },
  { value: 'education', label: 'Education' },
  { value: 'media', label: 'Media / Entertainment' },
  { value: 'public_admin', label: 'Public Administration' },
  { value: 'water', label: 'Water Supply / Waste Management' },
  { value: 'chemicals', label: 'Chemicals' },
  { value: 'postal', label: 'Postal / Courier Services' },
  { value: 'gambling', label: 'Gambling / Gaming' },
  { value: 'other', label: 'Other' },
];

export function StepCompanyBasics({ data, onChange }: StepCompanyBasicsProps) {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (field: string, value: string | number) => {
    const newErrors = { ...errors };
    if (field === 'name' && !value) {
      newErrors.name = 'Company name is required';
    } else {
      delete newErrors[field];
    }
    setErrors(newErrors);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold">Company Basics</h2>
        <p className="mt-1 text-sm text-[var(--color-muted-foreground)]">
          Tell us about your company so we can determine which regulations apply.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-1.5 sm:col-span-2">
          <label htmlFor="name" className="text-sm font-medium">
            Company Name <span className="text-[var(--color-risk-critical)]">*</span>
          </label>
          <Input
            id="name"
            placeholder="Acme ApS"
            value={data.name}
            onChange={(e) => {
              onChange({ name: e.target.value });
              validate('name', e.target.value);
            }}
          />
          {errors.name && (
            <p className="text-xs text-[var(--color-risk-critical)]">{errors.name}</p>
          )}
        </div>

        <div className="space-y-1.5">
          <label htmlFor="cvr" className="text-sm font-medium">
            CVR Number
          </label>
          <Input
            id="cvr"
            placeholder="12345678"
            maxLength={8}
            value={data.cvr_number}
            onChange={(e) => {
              const val = e.target.value.replace(/\D/g, '').slice(0, 8);
              onChange({ cvr_number: val });
            }}
          />
          <p className="text-xs text-[var(--color-muted-foreground)]">
            8-digit Danish company registration number
          </p>
        </div>

        <div className="space-y-1.5">
          <label htmlFor="employees" className="text-sm font-medium">
            Number of Employees
          </label>
          <Input
            id="employees"
            type="number"
            min={0}
            placeholder="10"
            value={data.employee_count || ''}
            onChange={(e) =>
              onChange({ employee_count: parseInt(e.target.value) || 0 })
            }
          />
        </div>

        <div className="space-y-1.5 sm:col-span-2">
          <label htmlFor="sector" className="text-sm font-medium">
            Industry Sector <span className="text-[var(--color-risk-critical)]">*</span>
          </label>
          <Select
            id="sector"
            value={data.industry_sector}
            onChange={(e) => onChange({ industry_sector: e.target.value })}
          >
            {INDUSTRY_SECTORS.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </Select>
        </div>
      </div>
    </div>
  );
}
