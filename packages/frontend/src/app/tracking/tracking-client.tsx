'use client';

import { useState } from 'react';
import { Phone, FileSearch, CircleCheck, CircleDashed, Loader2, Search } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Spinner } from '@/components/ui/spinner';
import { Alert } from '@/components/ui/alert';
import { cn, formatDate, formatDateTime, formatIRR, isValidMobile, normalizeMobile } from '@/lib/utils';
import api from '@/lib/api';
import { getProductBySlug } from '@/config/products';

type TrackingStatus = 'PENDING' | 'PAID' | 'PROCESSING' | 'COMPLETED' | 'CANCELLED';

interface TimelineStep {
  label: string;
  status: 'done' | 'current' | 'pending';
  date?: string;
}

interface TrackingResult {
  orderNumber: string;
  productSlug: string;
  status: TrackingStatus;
  amount: number;
  createdAt: string;
  steps: TimelineStep[];
  customerMobile: string;
}

const statusConfig: Record<TrackingStatus, { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'outline' }> = {
  PENDING: { label: 'در انتظار پرداخت', variant: 'warning' },
  PAID: { label: 'پرداخت شده', variant: 'success' },
  PROCESSING: { label: 'در حال پردازش', variant: 'default' },
  COMPLETED: { label: 'تکمیل شده', variant: 'success' },
  CANCELLED: { label: 'لغو شده', variant: 'danger' },
};

const defaultSteps: TimelineStep[] = [
  { label: 'ثبت درخواست', status: 'done' },
  { label: 'تکمیل اطلاعات', status: 'done' },
  { label: 'پرداخت', status: 'done' },
  { label: 'صدور بیمه‌نامه', status: 'current' },
  { label: 'تحویل', status: 'pending' },
];

export function TrackingClient() {
  const [mobile, setMobile] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<TrackingResult | null>(null);
  const [mobileError, setMobileError] = useState<string | null>(null);

  const validateMobile = (value: string) => {
    if (!value) {
      setMobileError('شماره موبایل الزامی است');
      return false;
    }
    if (!isValidMobile(value)) {
      setMobileError('شماره موبایل وارد شده معتبر نیست');
      return false;
    }
    setMobileError(null);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);

    const isMobileValid = validateMobile(mobile);
    if (!isMobileValid || !orderNumber.trim()) {
      if (!orderNumber.trim()) {
        setError('لطفا شماره سفارش را وارد کنید');
      }
      return;
    }

    setIsLoading(true);
    try {
      const normalizedMobile = normalizeMobile(mobile);
      const response = await api.post('/tracking', {
        mobile: normalizedMobile,
        orderNumber: orderNumber.trim(),
      });

      const data = response.data?.data ?? response.data;

      if (data) {
        const stepsFromStatus = getStepsForStatus(data.status as TrackingStatus);
        const createdAt = data.createdAt || new Date().toISOString();

        setResult({
          orderNumber: data.orderNumber || orderNumber.trim(),
          productSlug: data.productSlug || 'third-party',
          status: (data.status as TrackingStatus) || 'PROCESSING',
          amount: data.amount || 0,
          createdAt,
          customerMobile: normalizedMobile,
          steps: data.steps || stepsFromStatus.map((s, i) => ({
            ...s,
            date: i < 3 ? createdAt : undefined,
          })),
        });
      } else {
        setError('سفارشی با این اطلاعات یافت نشد. لطفا اطلاعات را بررسی کنید.');
      }
    } catch (err: any) {
      const message =
        err.response?.data?.message ||
        err.response?.data?.error ||
        err.message ||
        'خطا در برقراری ارتباط با سرور. لطفا دوباره تلاش کنید.';
      setError(message);
    } finally {
      setIsLoading(false);
    }
  };

  function getStepsForStatus(status: TrackingStatus): TimelineStep[] {
    switch (status) {
      case 'PENDING':
        return [
          { label: 'ثبت درخواست', status: 'done' },
          { label: 'تکمیل اطلاعات', status: 'current' },
          { label: 'پرداخت', status: 'pending' },
          { label: 'صدور بیمه‌نامه', status: 'pending' },
          { label: 'تحویل', status: 'pending' },
        ];
      case 'PAID':
        return [
          { label: 'ثبت درخواست', status: 'done' },
          { label: 'تکمیل اطلاعات', status: 'done' },
          { label: 'پرداخت', status: 'done' },
          { label: 'صدور بیمه‌نامه', status: 'current' },
          { label: 'تحویل', status: 'pending' },
        ];
      case 'PROCESSING':
        return [
          { label: 'ثبت درخواست', status: 'done' },
          { label: 'تکمیل اطلاعات', status: 'done' },
          { label: 'پرداخت', status: 'done' },
          { label: 'صدور بیمه‌نامه', status: 'current' },
          { label: 'تحویل', status: 'pending' },
        ];
      case 'COMPLETED':
        return [
          { label: 'ثبت درخواست', status: 'done' },
          { label: 'تکمیل اطلاعات', status: 'done' },
          { label: 'پرداخت', status: 'done' },
          { label: 'صدور بیمه‌نامه', status: 'done' },
          { label: 'تحویل', status: 'done' },
        ];
      case 'CANCELLED':
        return [
          { label: 'ثبت درخواست', status: 'done' },
          { label: 'تکمیل اطلاعات', status: 'done' },
          { label: 'پرداخت', status: 'pending' },
          { label: 'صدور بیمه‌نامه', status: 'pending' },
          { label: 'تحویل', status: 'pending' },
        ];
      default:
        return defaultSteps;
    }
  }

  const StepIcon = ({ status }: { status: TimelineStep['status'] }) => {
    if (status === 'done') {
      return <CircleCheck className="w-6 h-6 text-success" strokeWidth={2} />;
    }
    if (status === 'current') {
      return (
        <div className="relative">
          <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
            <Loader2 className="w-4 h-4 text-primary animate-spin" strokeWidth={2.5} />
          </div>
        </div>
      );
    }
    return <CircleDashed className="w-6 h-6 text-text-muted" strokeWidth={2} />;
  };

  return (
    <div className="py-8 md:py-12">
      <div className="mx-auto max-w-xl">
        <Card className="rounded-2xl shadow-card-lg">
          <CardHeader className="pb-4">
            <CardTitle className="text-xl flex items-center gap-2">
              <FileSearch className="w-5 h-5 text-primary" strokeWidth={2} />
              اطلاعات سفارش را وارد کنید
            </CardTitle>
            <p className="text-sm text-text-muted mt-1">
              برای پیگیری سفارش فقط کافیست شماره موبایل و شماره سفارش را وارد کنید
            </p>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-5">
              <Input
                label="شماره موبایل"
                type="tel"
                placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
                value={mobile}
                onChange={(e) => {
                  setMobile(e.target.value);
                  if (mobileError) validateMobile(e.target.value);
                }}
                onBlur={() => validateMobile(mobile)}
                error={!!mobileError}
                errorMessage={mobileError || undefined}
                leftIcon={<Phone className="w-4 h-4" strokeWidth={2} />}
                dir="ltr"
                inputMode="tel"
              />

              <Input
                label="شماره سفارش"
                placeholder="مثال: INS-12345"
                value={orderNumber}
                onChange={(e) => setOrderNumber(e.target.value)}
                leftIcon={<FileSearch className="w-4 h-4" strokeWidth={2} />}
              />

              {error && (
                <Alert variant="danger" className="text-sm">
                  {error}
                </Alert>
              )}

              <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Spinner size="sm" />
                    در حال پیگیری...
                  </>
                ) : (
                  <>
                    <Search className="w-4 h-4" strokeWidth={2} />
                    پیگیری سفارش
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {result && (
        <div className="mx-auto max-w-2xl mt-10">
          <Card className="rounded-2xl shadow-card-lg">
            <CardHeader className="pb-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <CardTitle className="text-xl">نتیجه پیگیری سفارش</CardTitle>
                  <p className="text-sm text-text-muted mt-1">
                    شماره سفارش: {result.orderNumber}
                  </p>
                </div>
                <Badge
                  variant={statusConfig[result.status]?.variant || 'default'}
                  size="md"
                >
                  {statusConfig[result.status]?.label || result.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pt-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6 p-4 rounded-xl bg-bg border border-border">
                <div>
                  <p className="text-xs text-text-muted mb-1">نوع بیمه</p>
                  <p className="text-sm font-bold text-text">
                    {getProductBySlug(result.productSlug)?.title || result.productSlug}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-1">مبلغ کل</p>
                  <p className="text-sm font-bold text-primary">
                    {formatIRR(result.amount)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-1">شماره موبایل</p>
                  <p className="text-sm font-medium text-text" dir="ltr">
                    {result.customerMobile}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-1">تاریخ ثبت</p>
                  <p className="text-sm font-medium text-text">
                    {formatDate(result.createdAt)}
                  </p>
                </div>
              </div>

              <div>
                <h4 className="text-base font-bold text-text mb-5">مراحل پردازش سفارش</h4>
                <div className="relative pr-2">
                  <div
                    className="absolute right-[11px] top-6 bottom-6 w-0.5 bg-border"
                    aria-hidden="true"
                  />
                  <ol className="space-y-5">
                    {result.steps.map((step, idx) => (
                      <li key={idx} className="relative flex items-start gap-4">
                        <div
                          className={cn(
                            'relative z-10 shrink-0 w-6 h-6 flex items-center justify-center',
                            step.status === 'done' && 'text-success',
                            step.status === 'current' && 'text-primary'
                          )}
                        >
                          <StepIcon status={step.status} />
                        </div>
                        <div className="flex-1 pt-0.5 pb-1">
                          <div className="flex flex-wrap items-center gap-2">
                            <p
                              className={cn(
                                'text-sm font-semibold',
                                step.status === 'done' && 'text-text',
                                step.status === 'current' && 'text-text',
                                step.status === 'pending' && 'text-text-muted'
                              )}
                            >
                              {step.label}
                            </p>
                            {step.status === 'current' && (
                              <Badge variant="default" size="sm">
                                در حال انجام
                              </Badge>
                            )}
                          </div>
                          {step.date && (
                            <p className="text-xs text-text-muted mt-1">
                              {formatDateTime(step.date)}
                            </p>
                          )}
                        </div>
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}

export default TrackingClient;
