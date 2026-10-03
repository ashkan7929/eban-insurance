'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { PriceBreakdown } from '@/components/business/price-breakdown';
import { usePurchaseStore } from '@/store/purchase-store';
import { CheckCircle2, Sparkles, ArrowLeft, ArrowRight, Calculator, ShieldCheck, Clock } from 'lucide-react';
import { formatIRR, cn } from '@/lib/utils';

const estimatedFallbackAmounts: Record<string, number> = {
  'third-party': 1850000,
  body: 4500000,
  life: 2800000,
  travel: 980000,
};

export function Step3QuoteResult() {
  const store = usePurchaseStore();
  const quoteData = store.quoteData;
  const slug = quoteData.productSlug || 'third-party';
  const [recalculating, setRecalculating] = useState(false);

  const amount = quoteData.amount ?? estimatedFallbackAmounts[slug] ?? 0;
  const breakdown = quoteData.breakdown;

  const handleRecalculate = async () => {
    setRecalculating(true);
    await store.calculateQuote();
    setRecalculating(false);
  };

  const planOptions = [
    { name: 'پایه', priceOffset: 0, badge: 'پیشنهادی', recommended: false },
    { name: 'استاندارد', priceOffset: 0.3, badge: '', recommended: true },
    { name: 'کامل', priceOffset: 0.6, badge: 'بالاترین پوشش', recommended: false },
  ];

  return (
    <div className="space-y-6">
      <Alert
        variant="success"
        title="قیمت بیمه شما محاسبه شد"
        description="براساس اطلاعات وارد شده، بهترین قیمت محاسبه و آماده خرید است."
        icon={<CheckCircle2 className="h-5 w-5" />}
      />

      <Card className="rounded-2xl shadow-card border-border overflow-hidden border-0 bg-gradient-to-br from-primary/5 via-white to-secondary/5">
        <CardContent className="p-0">
          <div className="px-6 sm:px-8 pt-6 sm:pt-8 pb-6 text-center border-b border-border/60 bg-white/60 backdrop-blur">
            <div className="inline-flex items-center gap-2 mb-4 px-3 py-1 rounded-full bg-success/10 text-success text-xs font-medium">
              <Sparkles className="h-3.5 w-3.5" />
              قیمت محاسبه‌شده شما
            </div>

            <div className="mb-2 text-xs text-text-muted font-medium tracking-tight">
              مبلغ قابل پرداخت (یک‌ساله)
            </div>

            <div className="flex items-baseline justify-center gap-3">
              <div className="text-4xl sm:text-5xl font-black text-primary tabular-nums leading-none">
                {formatIRR(amount)}
              </div>
            </div>

            <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
              <Badge variant="success" className="gap-1.5">
                <ShieldCheck className="h-3.5 w-3.5" />
                معتبر برای یک سال
              </Badge>
              <Badge variant="default" className="bg-primary/10 text-primary border-0 gap-1.5">
                <Clock className="h-3.5 w-3.5" />
                صدور فوری پس از پرداخت
              </Badge>
            </div>
          </div>

          <div className="p-6 sm:p-8">
            <div className="mb-6">
              <h4 className="font-bold text-text mb-4 flex items-center gap-2">
                <Calculator className="h-4 w-4 text-primary" />
                تفکیک قیمت
              </h4>
              <PriceBreakdown amount={amount} breakdown={breakdown} />
            </div>

            <div className="mb-6">
              <h4 className="font-bold text-text mb-4">مقایسه سطوح پوشش</h4>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {planOptions.map((opt, idx) => (
                  <div
                    key={idx}
                    className={cn(
                      'rounded-2xl border p-4 text-center transition-all duration-300',
                      opt.recommended
                        ? 'border-primary bg-primary/5 ring-2 ring-primary/20 shadow-card'
                        : 'border-border bg-white hover:border-primary/40'
                    )}
                  >
                    {opt.badge && (
                      <div className="inline-block mb-2">
                        <Badge variant="default" className={cn(
                          'text-[10px] px-2 py-0.5',
                          opt.recommended ? 'bg-primary text-white' : 'bg-bg text-text-muted border-border'
                        )}>
                          {opt.badge}
                        </Badge>
                      </div>
                    )}
                    <div className="font-bold text-text text-base mb-1">{opt.name}</div>
                    <div className="text-lg font-black text-primary mb-3 tabular-nums">
                      {formatIRR(Math.round(amount * (1 + opt.priceOffset)))}
                    </div>
                    <ul className="text-[11px] text-text-muted space-y-1.5 mb-4 text-right">
                      <li className="flex items-center gap-1.5 justify-center">
                        <CheckCircle2 className="h-3 w-3 text-success shrink-0" />
                        پوشش‌های پایه
                      </li>
                      {idx >= 1 && (
                        <li className="flex items-center gap-1.5 justify-center">
                          <CheckCircle2 className="h-3 w-3 text-success shrink-0" />
                          پوشش‌های تکمیلی
                        </li>
                      )}
                      {idx >= 2 && (
                        <li className="flex items-center gap-1.5 justify-center">
                          <CheckCircle2 className="h-3 w-3 text-success shrink-0" />
                          تمامی پوشش‌ها
                        </li>
                      )}
                    </ul>
                    <Button
                      size="sm"
                      variant={opt.recommended ? 'primary' : 'outline'}
                      className="w-full text-xs h-9"
                      onClick={() => {}}
                    >
                      انتخاب این طرح
                    </Button>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center justify-between gap-3 pt-3">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => store.prevStep()}
              >
                <ArrowRight className="h-4 w-4" />
                بازگشت و ویرایش
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="ghost"
                  size="md"
                  onClick={handleRecalculate}
                  disabled={recalculating}
                  className="hidden sm:inline-flex"
                >
                  <Calculator className={cn('h-4 w-4', recalculating && 'animate-spin')} />
                  <span className="text-xs">{recalculating ? 'در حال محاسبه...' : 'بازمحاسبه'}</span>
                </Button>

                <Button
                  type="button"
                  size="lg"
                  onClick={() => store.nextStep()}
                >
                  ادامه و تکمیل خرید
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default Step3QuoteResult;
