'use client';

import { type ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Button } from './button';

export interface WizardStep {
  id: string;
  title: string;
  description?: string;
}

interface WizardProps {
  steps: WizardStep[];
  currentStep: number;
  children: ReactNode;
  onNext?: () => void;
  onBack?: () => void;
  onComplete?: () => void;
  isNextDisabled?: boolean;
  isCompleting?: boolean;
  className?: string;
}

function Wizard({
  steps,
  currentStep,
  children,
  onNext,
  onBack,
  onComplete,
  isNextDisabled = false,
  isCompleting = false,
  className,
}: WizardProps) {
  const isLastStep = currentStep === steps.length - 1;

  return (
    <div className={cn('flex flex-col gap-8', className)}>
      {/* Step indicator */}
      <nav aria-label="Progress">
        <ol className="flex items-center gap-2">
          {steps.map((step, index) => {
            const status =
              index < currentStep
                ? 'complete'
                : index === currentStep
                  ? 'current'
                  : 'upcoming';

            return (
              <li key={step.id} className="flex items-center gap-2">
                {index > 0 && (
                  <div
                    className={cn(
                      'h-px w-8 sm:w-12',
                      status === 'upcoming' ? 'bg-border' : 'bg-accent'
                    )}
                  />
                )}
                <div className="flex items-center gap-2">
                  <div
                    className={cn(
                      'flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold',
                      status === 'complete' &&
                        'bg-accent text-accent-foreground',
                      status === 'current' &&
                        'border-2 border-accent text-accent',
                      status === 'upcoming' &&
                        'border border-border text-muted-foreground'
                    )}
                  >
                    {status === 'complete' ? '✓' : index + 1}
                  </div>
                  <span
                    className={cn(
                      'hidden text-sm font-medium sm:block',
                      status === 'upcoming'
                        ? 'text-muted-foreground'
                        : 'text-foreground'
                    )}
                  >
                    {step.title}
                  </span>
                </div>
              </li>
            );
          })}
        </ol>
      </nav>

      {/* Step content */}
      <div className="min-h-0 flex-1">{children}</div>

      {/* Navigation */}
      <div className="flex items-center justify-between border-t border-border pt-4">
        <Button
          variant="ghost"
          onClick={onBack}
          disabled={currentStep === 0}
        >
          Back
        </Button>

        {isLastStep ? (
          <Button
            onClick={onComplete}
            disabled={isNextDisabled || isCompleting}
          >
            {isCompleting ? 'Completing…' : 'Complete'}
          </Button>
        ) : (
          <Button onClick={onNext} disabled={isNextDisabled}>
            Continue
          </Button>
        )}
      </div>
    </div>
  );
}

export { Wizard };
