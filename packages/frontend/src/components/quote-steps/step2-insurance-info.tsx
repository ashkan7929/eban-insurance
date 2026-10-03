'use client';

import { useState } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { usePurchaseStore } from '@/store/purchase-store';
import { Shield, ShieldPlus, Heart, Plane, ArrowLeft, ArrowRight, Calculator, Users, Calendar, CheckCircle2 } from 'lucide-react';

const insuranceCompanies = [
  'ایران', 'آسیا', 'پاسارگاد', 'ملت', 'دی', 'سامان', 'سینا', 'تجارت', 'کارآفرین', 'معلم', 'مهر', 'رازی', 'عصر', 'تامین'
];

const coverageYearOptions = [
  { value: '5', label: '۵ سال' },
  { value: '10', label: '۱۰ سال' },
  { value: '15', label: '۱۵ سال' },
  { value: '20', label: '۲۰ سال' },
];

const travelPlanOptions = [
  { value: 'basic', label: 'پایه' },
  { value: 'standard', label: 'استاندارد' },
  { value: 'premium', label: 'ویژه (Premium)' },
];

const carSchema = z.object({
  hasPreviousInsurance: z.boolean().default(false),
  previousCompany: z.string().optional(),
  previousExpiry: z.string().optional(),
  discountPercent: z.string()
    .regex(/^\d+$/, 'درصد تخفیف باید عددی باشد')
    .refine((v) => {
      const n = parseInt(v, 10);
      return n >= 0 && n <= 70;
    }, 'درصد تخفیف باید بین ۰ تا ۷۰ باشد'),
}).refine((data) => {
  if (data.hasPreviousInsurance) {
    return !!data.previousCompany && !!data.previousExpiry;
  }
  return true;
}, {
  message: 'اطلاعات بیمه قبلی را تکمیل کنید',
  path: ['previousCompany'],
});

const lifeSchema = z.object({
  coverageAmount: z.string()
    .min(1, 'سقف پوشش را وارد کنید')
    .regex(/^\d+$/, 'مبلغ باید عددی باشد'),
  coverageYears: z.string().min(1, 'دوره پوشش را انتخاب کنید'),
});

const travelSchema = z.object({
  travelersCount: z.string()
    .min(1, 'تعداد مسافران را وارد کنید')
    .regex(/^\d+$/, 'تعداد باید عددی باشد')
    .refine((v) => {
      const n = parseInt(v, 10);
      return n >= 1 && n <= 20;
    }, 'تعداد مسافران باید بین ۱ تا ۲۰ نفر باشد'),
  plan: z.string().min(1, 'طرح را انتخاب کنید'),
});

export interface Step2InsuranceInfoProps {
  slug: string;
}

export function Step2InsuranceInfo({ slug }: Step2InsuranceInfoProps) {
  const isCar = slug === 'third-party' || slug === 'body';
  const isLife = slug === 'life';
  const isTravel = slug === 'travel';
  const [calcError, setCalcError] = useState<string | null>(null);

  const schema = isCar ? carSchema : isLife ? lifeSchema : travelSchema;
  const store = usePurchaseStore();
  const existing = store.quoteData.insurance;

  const methods = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: existing ? {
      ...existing,
    } : isCar ? {
      hasPreviousInsurance: false,
      previousCompany: '',
      previousExpiry: '',
      discountPercent: '0',
    } : isLife ? {
      coverageAmount: '',
      coverageYears: '',
    } : {
      travelersCount: '1',
      plan: '',
    },
    mode: 'onChange',
  });

  const {
    handleSubmit,
    watch,
    formState: { errors, isSubmitting },
  } = methods;

  const hasPreviousInsurance = watch('hasPreviousInsurance');

  const Icon = isCar ? (slug === 'body' ? ShieldPlus : Shield) : isLife ? Heart : Plane;
  const title = isCar ? 'اطلاعات بیمه' : isLife ? 'اطلاعات پوشش' : 'اطلاعات پوشش مسافرت';
  const subtitle = isCar
    ? 'جزئیات بیمه فعلی و درصدهای تخفیف خود را وارد کنید'
    : isLife
    ? 'سقف و دوره پوشش موردنظر را مشخص کنید'
    : 'تعداد مسافران و نوع طرح را انتخاب کنید';

  const onSubmit = async (values: any) => {
    setCalcError(null);
    store.setInsuranceData(values);
    const ok = await store.calculateQuote();
    if (!ok) {
      setCalcError('در محاسبه قیمت مشکلی پیش آمد. لطفاً اطلاعات را بررسی کرده و دوباره تلاش کنید.');
      return;
    }
  };

  return (
    <Card className="rounded-2xl shadow-card border-border">
      <CardContent className="p-6 sm:p-8">
        <div className="flex items-start gap-4 mb-8">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-secondary/10 text-secondary">
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text mb-1">۲. {title}</h2>
            <p className="text-sm text-text-muted">{subtitle}</p>
          </div>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {isCar && (
              <>
                <div className="flex items-start gap-3 p-4 rounded-xl bg-bg border border-border">
                  <input
                    type="checkbox"
                    id="hasPreviousInsurance"
                    className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary"
                    {...methods.register('hasPreviousInsurance')}
                  />
                  <div className="flex-1 min-w-0">
                    <Label htmlFor="hasPreviousInsurance" className="cursor-pointer font-semibold text-text">
                      بیمه قبلی دارم
                    </Label>
                    <p className="text-xs text-text-muted mt-1">
                      در صورت داشتن بیمه معتبر، درصدهای تخفیف نوبه اعمال می‌شود
                    </p>
                  </div>
                </div>

                {hasPreviousInsurance && (
                  <div className="space-y-5 p-5 rounded-xl border border-secondary/20 bg-secondary/5 animate-in fade-in duration-300">
                    <Select
                      label="شرکت بیمه قبلی"
                      error={!!errors.previousCompany}
                      errorMessage={errors.previousCompany?.message as string}
                      {...methods.register('previousCompany')}
                    >
                      <option value="">انتخاب شرکت بیمه</option>
                      {insuranceCompanies.map((c) => (
                        <option key={c} value={c}>{c}</option>
                      ))}
                    </Select>

                    <Input
                      label="تاریخ انقضای بیمه قبلی"
                      type="date"
                      error={!!errors.previousExpiry}
                      errorMessage={errors.previousExpiry?.message as string}
                      {...methods.register('previousExpiry')}
                    />
                  </div>
                )}

                <Input
                  label="درصد تخفیف بیمه (۰ تا ۷۰)"
                  type="number"
                  placeholder="مثال: ۵۰"
                  helperText="بر اساس نوبه و سوابق بیمه‌ای شما"
                  error={!!errors.discountPercent}
                  errorMessage={errors.discountPercent?.message as string}
                  {...methods.register('discountPercent')}
                />
              </>
            )}

            {isLife && (
              <>
                <Input
                  label="سقف پوشش (تومان)"
                  type="number"
                  placeholder="مثال: 2000000000"
                  helperText="مبلغ موردنظر را به تومان وارد کنید"
                  leftIcon={<Shield className="h-4 w-4" />}
                  error={!!errors.coverageAmount}
                  errorMessage={errors.coverageAmount?.message as string}
                  {...methods.register('coverageAmount')}
                />

                <Select
                  label="دوره پوشش"
                  icon={<Calendar className="h-4 w-4" />}
                  error={!!errors.coverageYears}
                  errorMessage={errors.coverageYears?.message as string}
                  {...methods.register('coverageYears')}
                >
                  <option value="">انتخاب دوره پوشش</option>
                  {coverageYearOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </Select>
              </>
            )}

            {isTravel && (
              <>
                <Input
                  label="تعداد مسافران"
                  type="number"
                  placeholder="مثال: ۲"
                  leftIcon={<Users className="h-4 w-4" />}
                  helperText="بین ۱ تا ۲۰ نفر"
                  error={!!errors.travelersCount}
                  errorMessage={errors.travelersCount?.message as string}
                  {...methods.register('travelersCount')}
                />

                <Select
                  label="نوع طرح مسافرت"
                  error={!!errors.plan}
                  errorMessage={errors.plan?.message as string}
                  {...methods.register('plan')}
                >
                  <option value="">انتخاب طرح</option>
                  {travelPlanOptions.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </Select>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
                  {travelPlanOptions.map((opt) => (
                    <div
                      key={opt.value}
                      className="p-3 rounded-xl border border-border text-center text-xs"
                    >
                      <div className="font-bold text-text mb-1">{opt.label}</div>
                      <div className="text-text-muted text-[11px] leading-6">
                        {opt.value === 'basic' && 'پوشش درمانی پایه + چمدان'}
                        {opt.value === 'standard' && 'پوشش کامل درمانی + لغو سفر'}
                        {opt.value === 'premium' && 'بالاترین سقف پوشش + خدمات VIP'}
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}

            {calcError && (
              <Alert variant="danger" title="خطا در محاسبه قیمت" description={calcError} />
            )}

            <div className="pt-6 flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => store.prevStep()}
              >
                <ArrowRight className="h-4 w-4" />
                بازگشت
              </Button>

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="gap-2"
              >
                <Calculator className="h-4 w-4" />
                {isSubmitting ? 'در حال محاسبه...' : 'محاسبه قیمت'}
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}

export default Step2InsuranceInfo;
