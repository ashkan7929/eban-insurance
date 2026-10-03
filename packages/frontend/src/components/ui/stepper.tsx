'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

export interface Step {
  label?: string;
}

export interface StepperProps extends React.HTMLAttributes<HTMLDivElement> {
  steps: Step[];
  currentStep: number;
}

export const Stepper = React.forwardRef<HTMLDivElement, StepperProps>(
  ({ className, steps, currentStep, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn('flex w-full items-center', className)}
        {...props}
      >
        {steps.map((step, index) => {
          const isCompleted = index < currentStep;
          const isCurrent = index === currentStep;
          const isLast = index === steps.length - 1;

          return (
            <React.Fragment key={index}>
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    'flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-sm font-medium transition-all duration-300',
                    isCompleted &&
                      'bg-primary text-white',
                    isCurrent &&
                      'bg-primary text-white ring-4 ring-primary/20',
                    !isCompleted &&
                      !isCurrent &&
                      'bg-border text-text-muted'
                  )}
                  aria-current={isCurrent ? 'step' : undefined}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" strokeWidth={3} />
                  ) : (
                    index + 1
                  )}
                </div>
                {step.label && (
                  <span
                    className={cn(
                      'mt-2 text-xs font-medium whitespace-nowrap transition-colors duration-300',
                      isCurrent || isCompleted
                        ? 'text-text'
                        : 'text-text-muted'
                    )}
                  >
                    {step.label}
                  </span>
                )}
              </div>
              {!isLast && (
                <div className="mx-2 flex-1 h-1 rounded-full overflow-hidden bg-border">
                  <div
                    className={cn(
                      'h-full rounded-full bg-primary transition-all duration-500 ease-out',
                      isCompleted ? 'w-full' : isCurrent ? 'w-1/2' : 'w-0'
                    )}
                  />
                </div>
              )}
            </React.Fragment>
          );
        })}
      </div>
    );
  }
);

Stepper.displayName = 'Stepper';

export default Stepper;
