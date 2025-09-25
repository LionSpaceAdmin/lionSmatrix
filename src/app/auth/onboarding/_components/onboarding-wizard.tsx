"use client";

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';

const steps = [
  { id: 1, title: 'Select Your Interests' },
  { id: 2, title: 'Choose Your Language' },
  { id: 3, title: 'Notification Preferences' },
];

export function OnboardingWizard() {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    interests: [],
    locale: 'en',
    notifications: false,
  });
  const router = useRouter();

  const handleNext = () => {
    if (step < steps.length) {
      setStep(step + 1);
    } else {
      // Finish onboarding
      console.log('Onboarding complete (mock):', formData);
      router.push('/dashboard');
    }
  };

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const progressValue = (step / steps.length) * 100;

  return (
    <div className="w-full max-w-md space-y-8">
      <div>
        <p className="text-sm text-muted-foreground">Step {step} of {steps.length}</p>
        <h2 className="text-2xl font-bold">{steps[step - 1].title}</h2>
        <Progress value={progressValue} className="mt-2" />
      </div>

      {step === 1 && (
        <div className="space-y-4">
          <p>Help us personalize your experience.</p>
          {/* Placeholder for interests checkboxes */}
        </div>
      )}
      {step === 2 && (
        <div className="space-y-4">
          <p>We support multiple languages.</p>
          {/* Placeholder for locale radio group */}
        </div>
      )}
      {step === 3 && (
        <div className="flex items-center space-x-2">
          <Checkbox id="notifications" onCheckedChange={(checked) => setFormData(d => ({ ...d, notifications: !!checked }))} />
          <Label htmlFor="notifications">Receive email notifications for critical alerts.</Label>
        </div>
      )}

      <div className="flex justify-between">
        <Button variant="ghost" onClick={handleBack} disabled={step === 1}>
          Back
        </Button>
        <Button onClick={handleNext}>
          {step === steps.length ? 'Finish' : 'Next'}
        </Button>
      </div>
    </div>
  );
}
