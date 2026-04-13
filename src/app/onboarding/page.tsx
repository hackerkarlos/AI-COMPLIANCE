import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { OnboardingWizard } from '@/components/onboarding/onboarding-wizard';

export default async function OnboardingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect('/login');

  // If already onboarded, go to dashboard
  const { data: company } = await supabase
    .from('companies')
    .select('onboarding_completed')
    .eq('user_id', user.id)
    .single();

  if (company?.onboarding_completed) {
    redirect('/dashboard');
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-6 py-12">
      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold tracking-tight">Welcome to EUComply</h1>
        <p className="mt-2 text-sm text-[var(--color-muted-foreground)]">
          Set up your company profile to get started with compliance tracking.
        </p>
      </div>
      <OnboardingWizard />
    </div>
  );
}
