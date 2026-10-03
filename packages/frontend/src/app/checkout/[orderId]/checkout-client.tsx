'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';
import { OtpLoginModal } from '@/components/auth/otp-login-modal';
import { useAuthStore } from '@/store/auth-store';
import { usePurchaseStore } from '@/store/purchase-store';
import { products } from '@/config/products';
import api from '@/lib/api';
import {
  CreditCard,
  Shield,
  CheckCircle2,
  Building2,
  Landmark,
  Banknote,
  FileText,
  Package,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface CheckoutClientProps {
  orderId: string;
}

const gateways = [
  {
    id: 'zarinpal',
    name: 'زرین‌پال',
    description: 'درگاه پرداخت امن زرین‌پال',
    icon: Building2,
  },
  {
    id: 'mellat',
    name: 'بانک ملت',
    description: 'درگاه پرداخت بانک ملت (به‌پرداخت)',
    icon: Landmark,
  },
  {
    id: 'saman',
    name: 'بانک سامان',
    description: 'درگاه پرداخت بانک سامان (سپهر)',
    icon: Banknote,
  },
];

function formatRial(amount: number) {
  return new Intl.NumberFormat('fa-IR').format(amount);
}

export function CheckoutClient({ orderId }: CheckoutClientProps) {
  const router = useRouter();
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const quoteData = usePurchaseStore((s) => s.quoteData);
  const orderNumber = usePurchaseStore((s) => s.orderNumber);
  const purchaseOrderId = usePurchaseStore((s) => s.orderId);
  const resetPurchase = usePurchaseStore((s) => s.resetPurchase);

  const [selectedGateway, setSelectedGateway] = React.useState('zarinpal');
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [error, setError] = React.useState('');
  const [loginModalOpen, setLoginModalOpen] = React.useState(false);

  const effectiveOrderId = orderId || purchaseOrderId || '';

  const product = React.useMemo(() => {
    const slug = quoteData.productSlug;
    return slug ? products.find((p) => p.slug === slug) : undefined;
  }, [quoteData.productSlug]);

  const amount = quoteData.amount || 0;

  const handlePayment = async () => {
    setError('');

    if (!isAuthenticated) {
      setLoginModalOpen(true);
      return;
    }

    if (!effectiveOrderId) {
      setError('شماره سفارش یافت نشد');
      return;
    }

    setIsProcessing(true);
    try {
      const createPaymentRes = await api.post(`/orders/${effectiveOrderId}/payment`, {
        gateway: selectedGateway.toUpperCase(),
      });
      const paymentId = createPaymentRes.data?.paymentId;

      if (!paymentId) {
        throw new Error('شناسه پرداخت دریافت نشد');
      }

      try {
        await api.get(`/payments/callback?paymentId=${encodeURIComponent(paymentId)}`);
      } catch (_callbackErr) {
      }

      const finalOrderNumber = orderNumber || effectiveOrderId;
      const redirectUrl = `/payment/success?orderId=${encodeURIComponent(effectiveOrderId)}&status=success&orderNo=${encodeURIComponent(finalOrderNumber)}&paymentId=${encodeURIComponent(paymentId)}`;

      setTimeout(() => {
        resetPurchase();
        router.push(redirectUrl);
      }, 300);
    } catch (e: any) {
      const msg =
        e?.response?.data?.message ||
        e?.message ||
        'در اتصال به درگاه پرداخت مشکلی پیش آمد';
      setError(msg);
      const failUrl = `/payment/failed?orderId=${encodeURIComponent(effectiveOrderId)}`;
      setTimeout(() => router.push(failUrl), 1200);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5 text-primary" strokeWidth={2} />
                انتخاب درگاه پرداخت
              </CardTitle>
              <CardDescription>
                پرداخت امن از طریق درگاه بانکی مورد نظر خود
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {gateways.map((gw) => {
                const Icon = gw.icon;
                const selected = selectedGateway === gw.id;
                return (
                  <label
                    key={gw.id}
                    className={cn(
                      'flex items-center gap-4 p-4 rounded-xl border-2 cursor-pointer transition-all',
                      selected
                        ? 'border-primary bg-primary/5'
                        : 'border-border bg-white hover:border-primary/40 hover:bg-bg/40'
                    )}
                  >
                    <input
                      type="radio"
                      name="gateway"
                      value={gw.id}
                      checked={selected}
                      onChange={() => setSelectedGateway(gw.id)}
                      className="sr-only"
                    />
                    <div
                      className={cn(
                        'flex h-11 w-11 shrink-0 items-center justify-center rounded-xl',
                        selected
                          ? 'bg-primary text-white'
                          : 'bg-bg text-text-muted'
                      )}
                    >
                      <Icon className="h-5 w-5" strokeWidth={2} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-text">{gw.name}</span>
                        {selected && (
                          <CheckCircle2 className="h-4 w-4 text-primary" strokeWidth={2.25} />
                        )}
                      </div>
                      <p className="text-sm text-text-muted mt-0.5">{gw.description}</p>
                    </div>
                  </label>
                );
              })}
            </CardContent>
          </Card>

          <Alert
            variant="info"
            icon={<Shield className="h-5 w-5" strokeWidth={2} />}
            title="پرداخت امن"
            description="تمامی تراکنش‌ها با بالاترین سطح رمزنگاری SSL و از طریق درگاه‌های بانکی معتبر انجام می‌شود. هیچ اطلاعات کارت بانکی شما در سرورهای ما ذخیره نمی‌گردد."
          />
        </div>

        <div className="lg:col-span-4">
          <div className="lg:sticky lg:top-24 space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" strokeWidth={2} />
                  خلاصه سفارش
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="flex items-start gap-3 p-3 rounded-xl bg-bg/60">
                  <div
                    className={cn(
                      'flex h-12 w-12 shrink-0 items-center justify-center rounded-xl',
                      product?.bgColor || 'bg-primary/10',
                      product?.color || 'text-primary'
                    )}
                  >
                    {product?.icon ? (
                      <product.icon className="h-6 w-6" strokeWidth={2} />
                    ) : (
                      <FileText className="h-6 w-6" strokeWidth={2} />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-semibold text-text truncate">
                      {product?.title || 'بیمه انتخابی شما'}
                    </h4>
                    <p className="text-sm text-text-muted mt-0.5 line-clamp-2">
                      {product?.description || 'محصول بیمه درخواستی'}
                    </p>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-muted">شماره سفارش</span>
                    <span className="font-medium text-text font-mono">
                      {orderNumber || effectiveOrderId || '—'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-muted">شناسه درگاه</span>
                    <span className="font-medium text-text">
                      {gateways.find((g) => g.id === selectedGateway)?.name || '—'}
                    </span>
                  </div>
                </div>

                <div className="h-px bg-border" />

                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-muted">مبلغ پایه</span>
                    <span className="text-text">
                      {amount ? `${formatRial(amount)} ریال` : '—'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-text-muted">مالیات ارزش افزوده</span>
                    <span className="text-text">
                      {amount ? `${formatRial(Math.round(amount * 0.09))} ریال` : '—'}
                    </span>
                  </div>
                </div>

                <div className="rounded-xl border border-primary/20 bg-primary/5 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-text">مبلغ قابل پرداخت</span>
                    <div className="text-left">
                      <div className="text-lg font-bold text-primary">
                        {amount ? `${formatRial(Math.round(amount * 1.09))}` : '—'}
                      </div>
                      <div className="text-xs text-text-muted">ریال</div>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-3">
                {error && (
                  <Alert variant="danger" description={error} className="w-full" />
                )}
                <Button
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={handlePayment}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <Spinner size="sm" />
                      در حال انتقال به درگاه...
                    </>
                  ) : (
                    <>
                      <CreditCard className="h-4 w-4" strokeWidth={2} />
                      پرداخت آنلاین {amount ? formatRial(Math.round(amount * 1.09)) : ''}
                    </>
                  )}
                </Button>
                {!isAuthenticated && (
                  <p className="text-xs text-center text-text-muted leading-relaxed">
                    برای ادامه پرداخت، نیاز به{' '}
                    <button
                      type="button"
                      onClick={() => setLoginModalOpen(true)}
                      className="text-primary hover:underline font-medium"
                    >
                      ورود یا ثبت نام
                    </button>{' '}
                    دارید.
                  </p>
                )}
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>

      <OtpLoginModal
        open={loginModalOpen}
        onOpenChange={setLoginModalOpen}
        redirectTo={`/checkout/${effectiveOrderId}`}
      />
    </>
  );
}

export default CheckoutClient;
