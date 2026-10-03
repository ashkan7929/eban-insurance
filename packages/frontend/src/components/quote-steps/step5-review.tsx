'use client';

import * as React from 'react';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Divider } from '@/components/ui/divider';
import { PriceBreakdown } from '@/components/business/price-breakdown';
import { usePurchaseStore, type QuoteStep } from '@/store/purchase-store';
import { useAuthStore } from '@/store/auth-store';
import { OtpModal } from './otp-modal';
import { getProductBySlug } from '@/config/products';
import { formatIRR, formatMobile, cn } from '@/lib/utils';
import {
  Car, Shield, ShieldPlus, Heart, Plane,
  ArrowLeft, ArrowRight, Pencil, FileCheck2,
  CreditCard, CheckCircle2, AlertTriangle, User,
  Info, Send, Loader2
} from 'lucide-react';

export interface Step5ReviewProps {
  slug: string;
}

interface SectionProps {
  title: string;
  icon: React.ReactNode;
  step: QuoteStep;
  onEdit: (step: QuoteStep) => void;
  children: React.ReactNode;
}

function ReviewSection({ title, icon, step, onEdit, children }: SectionProps) {
  return (
    <div className="rounded-2xl border border-border bg-white overflow-hidden">
      <div className="flex items-center justify-between gap-3 px-5 py-4 bg-bg/60 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            {icon}
          </div>
          <div>
            <h3 className="text-sm font-bold text-text">{title}</h3>
          </div>
        </div>
        <Button
          type="button"
          variant="ghost"
          size="sm"
          className="gap-1.5 h-8 text-xs text-text-muted hover:text-primary shrink-0"
          onClick={() => onEdit(step)}
        >
          <Pencil className="h-3.5 w-3.5" />
          ویرایش
        </Button>
      </div>
      <div className="p-5 space-y-3">
        {children}
      </div>
    </div>
  );
}

function InfoRow({ label, value, valueClass }: { label: string; value: React.ReactNode; valueClass?: string }) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div className="text-xs sm:text-sm text-text-muted shrink-0 min-w-[100px]">{label}</div>
      <div className={cn('text-xs sm:text-sm font-medium text-text text-left', valueClass)}>
        {value || '—'}
      </div>
    </div>
  );
}

export function Step5Review({ slug }: Step5ReviewProps) {
  const router = useRouter();
  const store = usePurchaseStore();
  const authStore = useAuthStore();
  const product = getProductBySlug(slug);

  const quoteData = store.quoteData;
  const vehicle = quoteData.vehicle || {};
  const insurance = quoteData.insurance || {};
  const customer = quoteData.customer || {};
  const amount = quoteData.amount ?? 0;
  const breakdown = quoteData.breakdown;

  const isCar = slug === 'third-party' || slug === 'body';
  const isLife = slug === 'life';
  const isTravel = slug === 'travel';

  const [termsAccepted, setTermsAccepted] = useState(false);
  const [otpOpen, setOtpOpen] = useState(false);
  const [otpMobile, setOtpMobile] = useState('');
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const step1Icon = isCar ? (slug === 'body' ? ShieldPlus : Car) : isLife ? Heart : Plane;
  const step1Title = isCar ? 'اطلاعات خودرو' : isLife ? 'اطلاعات بیمه‌شده' : 'اطلاعات سفر';
  const step2Icon = isCar ? Shield : isLife ? Heart : Plane;
  const step2Title = isCar ? 'اطلاعات بیمه' : isLife ? 'اطلاعات پوشش' : 'اطلاعات پوشش مسافرت';

  const handleEdit = (step: QuoteStep) => {
    store.setStep(step);
  };

  const runPurchaseFlow = async (userId?: string) => {
    const quoteCreated = await store.createQuote(userId);
    if (!quoteCreated) {
      setError('در ایجاد پیش‌فاکتور مشکلی پیش آمد. لطفاً دوباره تلاش کنید.');
      return false;
    }

    const orderId = await store.createOrder();
    if (!orderId) {
      setError('در ایجاد سفارش مشکلی پیش آمد. لطفاً دوباره تلاش کنید.');
      return false;
    }

    router.push(`/checkout/${orderId}`);
    return true;
  };

  const handleSubmit = async () => {
    setError(null);

    if (!termsAccepted) {
      setError('برای ادامه باید با قوانین و مقررات موافقت کنید.');
      return;
    }

    if (!customer.mobile) {
      setError('لطفاً ابتدا اطلاعات خود را تکمیل کنید.');
      store.setStep(3);
      return;
    }

    setProcessing(true);

    if (authStore.isAuthenticated) {
      const ok = await runPurchaseFlow(authStore.user?.id);
      setProcessing(false);
      if (!ok) return;
      return;
    }

    const mobile = customer.mobile;
    setOtpMobile(mobile);

    if (!authStore.otpPendingMobile || authStore.otpPendingMobile !== mobile) {
      const sendResult = await authStore.sendOtp(mobile);
      if (!sendResult.success) {
        setError(sendResult.error || 'ارسال کد تأیید ناموفق بود.');
        setProcessing(false);
        return;
      }
    }

    setProcessing(false);
    setOtpOpen(true);
  };

  const handleOtpSuccess = async () => {
    setOtpOpen(false);
    setProcessing(true);

    const userId = authStore.user?.id;
    await runPurchaseFlow(userId);
    setProcessing(false);
  };

  const step1Content = isCar ? (
    <>
      <InfoRow label="شماره پلاک" value={vehicle.plate} />
      <InfoRow label="برند" value={vehicle.brand} />
      <InfoRow label="مدل" value={vehicle.model} />
      <InfoRow label="سال ساخت" value={vehicle.year} />
    </>
  ) : isLife ? (
    <>
      <InfoRow label="سن" value={vehicle.age ? `${vehicle.age} سال` : '—'} />
      <InfoRow label="جنسیت" value={
        vehicle.gender === 'male' ? 'مرد' : vehicle.gender === 'female' ? 'زن' : '—'
      } />
      <InfoRow label="شغل" value={vehicle.occupation} />
    </>
  ) : (
    <>
      <InfoRow label="مقصد سفر" value={vehicle.destination} />
      <InfoRow label="تاریخ رفت" value={vehicle.departureDate} />
      <InfoRow label="تاریخ برگشت" value={vehicle.returnDate} />
    </>
  );

  const step2Content = isCar ? (
    <>
      <InfoRow label="بیمه قبلی" value={
        insurance.hasPreviousInsurance ? (
          <Badge variant="success" size="sm">دارد</Badge>
        ) : (
          <Badge variant="default" size="sm" className="bg-border text-text-muted border-0">ندارد</Badge>
        )
      } />
      {insurance.hasPreviousInsurance && (
        <>
          <InfoRow label="شرکت بیمه قبلی" value={insurance.previousCompany} />
          <InfoRow label="تاریخ انقضا قبلی" value={insurance.previousExpiry} />
        </>
      )}
      <InfoRow label="درصد تخفیف" value={insurance.discountPercent ? `${insurance.discountPercent}٪` : '—'} />
    </>
  ) : isLife ? (
    <>
      <InfoRow label="سقف پوشش" value={insurance.coverageAmount ? formatIRR(insurance.coverageAmount) : '—'} />
      <InfoRow label="دوره پوشش" value={
        insurance.coverageYears ? `${insurance.coverageYears} سال` : '—'
      } />
    </>
  ) : (
    <>
      <InfoRow label="تعداد مسافران" value={insurance.travelersCount ? `${insurance.travelersCount} نفر` : '—'} />
      <InfoRow label="طرح انتخابی" value={
        insurance.plan === 'basic' ? 'پایه' :
        insurance.plan === 'standard' ? 'استاندارد' :
        insurance.plan === 'premium' ? 'ویژه' : '—'
      } />
    </>
  );

  return (
    <div className="space-y-6">
      <Alert
        variant="info"
        title="بازبینی نهایی"
        description="لطفاً اطلاعات وارد شده را بررسی کنید. پس از تأیید، به صفحه پرداخت هدایت می‌شوید."
        icon={<FileCheck2 className="h-5 w-5" />}
      />

      <div className="space-y-4">
        <ReviewSection
          title={step1Title}
          icon={<span className="h-4 w-4 flex items-center justify-center">{React.createElement(step1Icon as any, { className: 'h-4 w-4' })}</span>}
          step={0}
          onEdit={handleEdit}
        >
          {step1Content}
        </ReviewSection>

        <ReviewSection
          title={step2Title}
          icon={<span className="h-4 w-4 flex items-center justify-center">{React.createElement(step2Icon as any, { className: 'h-4 w-4' })}</span>}
          step={1}
          onEdit={handleEdit}
        >
          {step2Content}
        </ReviewSection>

        <ReviewSection
          title="اطلاعات شما"
          icon={<User className="h-4 w-4" />}
          step={3}
          onEdit={handleEdit}
        >
          <InfoRow label="نام کامل" value={`${customer.firstName || ''} ${customer.lastName || ''}`.trim() || '—'} />
          <InfoRow label="کد ملی" value={customer.nationalCode} />
          <InfoRow label="تاریخ تولد" value={customer.birthDate} />
          <InfoRow label="شماره موبایل" value={customer.mobile ? formatMobile(customer.mobile) : '—'} />
          <InfoRow label="ایمیل" value={customer.email} />
        </ReviewSection>
      </div>

      <Card className="rounded-2xl shadow-card border-border overflow-hidden">
        <CardContent className="p-5 sm:p-6">
          <h3 className="text-sm font-bold text-text mb-4 flex items-center gap-2">
            <CreditCard className="h-4 w-4 text-primary" />
            خلاصه مبلغ قابل پرداخت
          </h3>
          <PriceBreakdown amount={amount} breakdown={breakdown} />
        </CardContent>
      </Card>

      <div className="rounded-2xl border border-border bg-white p-5 sm:p-6">
        <div className="flex items-start gap-3">
          <input
            type="checkbox"
            id="terms"
            checked={termsAccepted}
            onChange={(e) => setTermsAccepted(e.target.checked)}
            className="mt-1 h-4 w-4 rounded border-border text-primary focus:ring-primary cursor-pointer"
          />
          <div className="min-w-0 flex-1">
            <Label htmlFor="terms" className="cursor-pointer font-semibold text-text text-sm">
              قوانین و مقررات را مطالعه کرده و با آن‌ها موافقم
            </Label>
            <p className="text-xs text-text-muted mt-1 leading-6">
              با تأیید این مورد، کلیه شرایط بیمه‌نامه، تعرفه‌ها، محدودیت‌های پوشش،
              رویه‌های ثبت خسارت و حریم خصوصی ابان بیمه را پذیرفته‌اید.
            </p>
          </div>
        </div>
      </div>

      {error && (
        <Alert variant="danger" description={error} icon={<AlertTriangle className="h-5 w-5" />} />
      )}

      <div className="pt-2 flex items-center justify-between gap-3">
        <Button
          type="button"
          variant="outline"
          size="lg"
          onClick={() => store.prevStep()}
          disabled={processing}
        >
          <ArrowRight className="h-4 w-4" />
          بازگشت
        </Button>

        <Button
          type="button"
          size="lg"
          onClick={handleSubmit}
          disabled={processing}
          className="gap-2"
        >
          {processing ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              در حال پردازش...
            </>
          ) : (
            <>
              <CheckCircle2 className="h-4 w-4" />
              تأیید و ادامه به پرداخت
              <ArrowLeft className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>

      <OtpModal
        open={otpOpen}
        onOpenChange={setOtpOpen}
        mobile={otpMobile}
        onSuccess={handleOtpSuccess}
      />
    </div>
  );
}

export default Step5Review;
