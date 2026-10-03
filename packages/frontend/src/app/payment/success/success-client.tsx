'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import SuccessState from '@/components/business/success-state';
import { usePurchaseStore } from '@/store/purchase-store';

export interface PaymentSuccessClientProps {
  orderId?: string;
  orderNo?: string;
}

export function PaymentSuccessClient({ orderId, orderNo }: PaymentSuccessClientProps) {
  const router = useRouter();
  const storedOrderNumber = usePurchaseStore((s) => s.orderNumber);
  const storedOrderId = usePurchaseStore((s) => s.orderId);
  const resetPurchase = usePurchaseStore((s) => s.resetPurchase);

  const effectiveOrderId = orderId || storedOrderId || undefined;
  const effectiveOrderNumber = orderNo || storedOrderNumber || effectiveOrderId || undefined;

  const handleDownload = React.useCallback(() => {
    // TODO: Implement download policy PDF
    alert('دانلود بیمه‌نامه به زودی فعال خواهد شد');
  }, []);

  const handleSendMobile = React.useCallback(() => {
    // TODO: Implement send policy to mobile
    alert('بیمه‌نامه به شماره موبایل شما ارسال خواهد شد');
  }, []);

  const handleHome = React.useCallback(() => {
    resetPurchase();
    router.push('/');
  }, [router, resetPurchase]);

  const handleTrack = React.useCallback(() => {
    if (effectiveOrderId) {
      router.push(`/dashboard/orders/${effectiveOrderId}`);
    } else {
      router.push('/dashboard/orders');
    }
  }, [router, effectiveOrderId]);

  return (
    <div className="py-8 md:py-12 max-w-3xl mx-auto">
      <SuccessState
        orderId={effectiveOrderId}
        orderNumber={effectiveOrderNumber}
        description="پرداخت شما با موفقیت انجام شد. بیمه‌نامه شما به زودی به شماره موبایل و ایمیل شما ارسال خواهد شد."
        onDownload={handleDownload}
        onSendMobile={handleSendMobile}
        onTrackOrder={handleTrack}
      />
    </div>
  );
}

export default PaymentSuccessClient;
