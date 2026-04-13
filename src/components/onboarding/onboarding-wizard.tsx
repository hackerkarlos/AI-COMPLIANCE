'use client';

import { useState, useCallback, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Wizard, type WizardStep } from '@/components/ui/wizard';
import { StepCompanyBasics } from '@/components/onboarding/step-company-basics';
import { StepActivities } from '@/components/onboarding/step-activities';
import { StepReview } from '@/components/onboarding/step-review';
import { StepConfirm } from '@/components/onboarding/step-confirm';
import {
  matchRegulations,
  type CompanyProfile,
  type MatchResult,
} from '@/lib/regulations/matching';
import { createClient } from '@/lib/supabase/browser';
import type { Regulation } from '@/types/assessment';

const WIZARD_STEPS: WizardStep[] = [
  { id: 'basics', title: 'Company', description: 'Basic company info' },
  { id: 'activities', title: 'Activities', description: 'Business activities' },
  { id: 'review', title: 'Review', description: 'Applicable regulations' },
  { id: 'confirm', title: 'Complete', description: 'Confirm & finish' },
];

const DEFAULT_PROFILE: CompanyProfile = {
  name: '',
  cvr_number: '',
  industry_sector: '',
  employee_count: 0,
  processes_personal_data: true,
  uses_ai_systems: false,
  operates_online: true,
  processes_payments: false,
  is_financial_entity: false,
  has_critical_infrastructure: false,
};

export function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<CompanyProfile>(DEFAULT_PROFILE);
  const [regulations, setRegulations] = useState<Regulation[]>([]);
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [isCompleting, setIsCompleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load regulations on mount
  useEffect(() => {
    async function loadRegulations() {
      const supabase = createClient();
      const { data } = await supabase
        .from('regulations')
        .select('*')
        .eq('is_active', true)
        .order('display_order');
      if (data) setRegulations(data as unknown as Regulation[]);
    }
    loadRegulations();
  }, []);

  const updateProfile = useCallback((patch: Partial<CompanyProfile>) => {
    setProfile((prev) => ({ ...prev, ...patch }));
  }, []);

  // Recalculate matches when moving to review step
  const handleNext = useCallback(() => {
    if (step === 0) {
      // Validate basics
      if (!profile.name.trim()) {
        setError('Please enter a company name');
        return;
      }
      if (!profile.industry_sector) {
        setError('Please select an industry sector');
        return;
      }
    }

    setError(null);

    if (step === 1) {
      // Moving to review — recalculate matches
      const results = matchRegulations(profile, regulations);
      setMatches(results);
    }

    setStep((s) => Math.min(s + 1, WIZARD_STEPS.length - 1));
  }, [step, profile, regulations]);

  const handleBack = useCallback(() => {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  }, []);

  const handleComplete = useCallback(async () => {
    setIsCompleting(true);
    setError(null);

    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Something went wrong');
        setIsCompleting(false);
        return;
      }

      router.push('/dashboard');
    } catch {
      setError('Network error. Please try again.');
      setIsCompleting(false);
    }
  }, [profile, router]);

  return (
    <div className="mx-auto w-full max-w-2xl">
      {error && (
        <div className="mb-4 rounded-lg border border-[var(--color-risk-critical)]/30 bg-[var(--color-risk-critical)]/5 px-4 py-3 text-sm text-[var(--color-risk-critical)]">
          {error}
        </div>
      )}

      <Wizard
        steps={WIZARD_STEPS}
        currentStep={step}
        onNext={handleNext}
        onBack={handleBack}
        onComplete={handleComplete}
        isNextDisabled={isCompleting}
        isCompleting={isCompleting}
      >
        {step === 0 && (
          <StepCompanyBasics data={profile} onChange={updateProfile} />
        )}
        {step === 1 && (
          <StepActivities data={profile} onChange={updateProfile} />
        )}
        {step === 2 && <StepReview matches={matches} />}
        {step === 3 && (
          <StepConfirm companyName={profile.name} matches={matches} />
        )}
      </Wizard>
    </div>
  );
}
