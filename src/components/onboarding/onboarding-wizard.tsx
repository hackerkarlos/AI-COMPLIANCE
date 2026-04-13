'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { Wizard, type WizardStep } from '@/components/ui/wizard';
import { StepCompanyBasics } from '@/components/onboarding/step-company-basics';
import { StepDataPrivacy } from '@/components/onboarding/step-data-privacy';
import { StepDigitalPresence } from '@/components/onboarding/step-digital-presence';
import { StepInfrastructure } from '@/components/onboarding/step-infrastructure';
import { ComplianceLoading } from '@/components/onboarding/compliance-loading';
import type { CompanyProfile } from '@/lib/regulations/matching';

const WIZARD_STEPS: WizardStep[] = [
  { id: 'basics', title: 'Company Basics', description: 'Basic company info' },
  { id: 'data-privacy', title: 'Data & Privacy', description: 'Data handling' },
  { id: 'digital-presence', title: 'Digital Presence', description: 'Online operations' },
  { id: 'infrastructure', title: 'Infrastructure', description: 'Critical systems' },
];

const DEFAULT_PROFILE: CompanyProfile = {
  name: '',
  cvr_number: '',
  industry_sector: '',
  employee_count: 0,
  processes_personal_data: true,
  processes_special_categories: false,
  uses_ai_systems: false,
  operates_online: true,
  processes_payments: false,
  annual_turnover_eur: null,
  is_financial_entity: false,
  has_critical_infrastructure: false,
  contact_email: '',
};

export function OnboardingWizard() {
  const router = useRouter();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState<CompanyProfile>(DEFAULT_PROFILE);
  const [error, setError] = useState<string | null>(null);
  // isLoading: true once the user clicks Complete — shows the loading screen
  const [isLoading, setIsLoading] = useState(false);
  // apiDone: true once the POST /api/onboarding call resolves successfully
  const [apiDone, setApiDone] = useState(false);

  const updateProfile = useCallback((patch: Partial<CompanyProfile>) => {
    setProfile((prev) => ({ ...prev, ...patch }));
  }, []);

  const handleNext = useCallback(() => {
    if (step === 0) {
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
    setStep((s) => Math.min(s + 1, WIZARD_STEPS.length - 1));
  }, [step, profile]);

  const handleBack = useCallback(() => {
    setError(null);
    setStep((s) => Math.max(s - 1, 0));
  }, []);

  const handleComplete = useCallback(async () => {
    // Switch to loading screen immediately — UX feels responsive
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/onboarding', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(profile),
      });

      const data = await res.json();

      if (!res.ok) {
        setIsLoading(false);
        setError(data.error || 'Something went wrong. Please try again.');
        return;
      }

      // Signal the loading screen: API is done, redirect when animation finishes
      setApiDone(true);
    } catch {
      setIsLoading(false);
      setError('Network error. Please try again.');
    }
  }, [profile]);

  // Called by ComplianceLoading once min display time + API are both done
  const handleLoadingReady = useCallback(() => {
    router.push('/dashboard');
  }, [router]);

  // Show loading screen after submit
  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-2xl">
        <ComplianceLoading apiDone={apiDone} onReady={handleLoadingReady} />
      </div>
    );
  }

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
        isNextDisabled={false}
        isCompleting={false}
      >
        {step === 0 && <StepCompanyBasics data={profile} onChange={updateProfile} />}
        {step === 1 && <StepDataPrivacy data={profile} onChange={updateProfile} />}
        {step === 2 && <StepDigitalPresence data={profile} onChange={updateProfile} />}
        {step === 3 && <StepInfrastructure data={profile} onChange={updateProfile} />}
      </Wizard>
    </div>
  );
}
