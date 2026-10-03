'use client';

import { Button } from '@/components/ui/button';
import { PriceBreakdown, type PriceBreakdownItem } from './price-breakdown';
import { QuoteProgress } from './quote-progress';
import { cn } from '@/lib/utils';

export interface QuoteSummaryProps {
  productTitle: string;
  amount: number;
  breakdown?: PriceBreakdownItem[];
  currentStep?: number;
  totalSteps?: number;
  buttonText?: string;
  onButtonClick?: () => void;
  className?: string;
  showProgress?: boolean;
}

export function QuoteSummary({
  productTitle,
  amount,
  breakdown,
  currentStep = 1,
  totalSteps = 4,
  buttonText,
  onButtonClick,
  className,
  showProgress = true,
}: QuoteSummaryProps) {
  const isLastStep = currentStep >= totalSteps;
  const defaultButtonText = isLastStep ? 'پرداخت' : 'ادامه فرایند خرید';

  return (
    <div
      className={cn(
        'hidden lg:block sticky top-24 self-start w-full',
        className
      )}
    >
      <div className="space-y-5">
        <div className="rounded-2xl border border-border bg-white p-5 shadow-card">
          <div className="space-y-1 pb-4 border-b border-border">
            <p className="text-sm text-text-muted">محصول انتخابی</p>
            <h3 className="text-lg font-bold text-text">{productTitle}</h3>
          </div>

          {showProgress ? (
            <div className="pt-4">
              <QuoteProgress current={currentStep} total={totalSteps} />
            </div>
          ) : null}
        </div>

        <PriceBreakdown amount={amount} breakdown={breakdown} />

        <Button
          className="w-full"
          size="lg"
          onClick={onButtonClick}
        >
          {buttonText ?? defaultButtonText}
        </Button>
      </div>
    </div>
  );
}

export default QuoteSummary;
