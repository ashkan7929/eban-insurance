'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { usePurchaseStore, type QuoteStep } from '@/store/purchase-store';
import { getProductBySlug } from '@/config/products';
import { Stepper } from '@/components/ui/stepper';
import { QuoteSummary } from '@/components/business/quote-summary';
import { StickyPurchaseBar } from '@/components/business/sticky-purchase-bar';
import { Step1VehicleInfo } from '@/components/quote-steps/step1-vehicle-info';
import { Step2InsuranceInfo } from '@/components/quote-steps/step2-insurance-info';
import { Step3QuoteResult } from '@/components/quote-steps/step3-quote-result';
import { Step4CustomerInfo } from '@/components/quote-steps/step4-customer-info';
import { Step5Review } from '@/components/quote-steps/step5-review';

export interface QuoteFlowClientProps {
  slug: string;
  labels: { label: string }[];
}

export function QuoteFlowClient({ slug, labels }: QuoteFlowClientProps) {
  const router = useRouter();
  const currentStep = usePurchaseStore((s) => s.currentStep);
  const setStep = usePurchaseStore((s) => s.setStep);
  const setProduct = usePurchaseStore((s) => s.setProduct);
  const quoteData = usePurchaseStore((s) => s.quoteData);
  const nextStep = usePurchaseStore((s) => s.nextStep);
  const prevStep = usePurchaseStore((s) => s.prevStep);

  const product = getProductBySlug(slug);
  const amount = quoteData.amount ?? 0;
  const breakdown = quoteData.breakdown;

  useEffect(() => {
    setProduct(slug);
  }, [slug, setProduct]);

  const renderStep = () => {
    switch (currentStep as QuoteStep) {
      case 0:
        return <Step1VehicleInfo slug={slug} />;
      case 1:
        return <Step2InsuranceInfo slug={slug} />;
      case 2:
        return <Step3QuoteResult />;
      case 3:
        return <Step4CustomerInfo />;
      case 4:
        return <Step5Review slug={slug} />;
      default:
        return null;
    }
  };

  const handleSummaryClick = () => {
    if (currentStep < 4) {
      nextStep();
    }
  };

  const stickyButtonText = currentStep === 4 ? 'تأیید و ادامه به پرداخت' : currentStep === 2 ? 'ادامه و تکمیل اطلاعات' : 'ادامه فرایند خرید';

  const stickyAmount = currentStep >= 2 ? amount : 0;

  return (
    <>
      <div className="mb-8 max-w-4xl mx-auto hidden sm:block">
        <Stepper steps={labels} currentStep={currentStep} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 order-2 lg:order-1">
          {renderStep()}
        </div>

        <div className="lg:col-span-4 order-1 lg:order-2">
          {product && (
            <QuoteSummary
              productTitle={product.title}
              amount={stickyAmount}
              breakdown={breakdown}
              currentStep={currentStep + 1}
              totalSteps={5}
              buttonText={stickyButtonText}
              onButtonClick={handleSummaryClick}
            />
          )}
        </div>
      </div>

      {product && (
        <div className="sm:hidden">
          <StickyPurchaseBar
            title={product.title}
            amount={stickyAmount}
            buttonText={stickyButtonText}
            onButtonClick={handleSummaryClick}
            visible
          />
        </div>
      )}
    </>
  );
}

export default QuoteFlowClient;
