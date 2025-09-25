import { OnboardingWizard } from './_components/onboarding-wizard';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Onboarding',
  description: 'Set up your Lions of Zion account.',
};

export default function OnboardingPage() {
  return (
    <div className="container flex min-h-screen flex-col items-center justify-center py-12">
      <div className="mx-auto flex w-full flex-col justify-center space-y-6 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Account Setup</h1>
        <p className="text-muted-foreground">
          Just a few more steps to get you started.
        </p>
      </div>
      <div className="mt-8">
        <OnboardingWizard />
      </div>
    </div>
  );
}
