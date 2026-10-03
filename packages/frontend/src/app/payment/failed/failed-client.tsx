'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import FailureState from '@/components/business/failure-state';
import { usePurchaseStore } from '@/store/purchase-store';

export interface PaymentFailedClientProps {
  orderId?: string;
}

export function PaymentFailedClient({ orderId }: PaymentFailedClientProps) {
  const router = useRouter();
  const storedOrderId = usePurchaseStore((s) => s.orderId);
  const effectiveOrderId = orderId || storedOrderId;

  const handleRetry = React.useCallback(() => {
    if (effectiveOrderId) {
      router.push(`/checkout/${effectiveOrderId}`);
    } else {
      router.push('/insurance');
    }
  }, [router, effectiveOrderId]);

  const handleContactSupport = React.useCallback(() => {
    // TODO: Implement contact support modal or navigate to contact
    router.push('/contact');
  }, [router]);

  return (
    <div className="py-8 md:py-12 max-w-2xl mx-auto">
      <FailureState
        description="متاسفانه در هنگام پرداخت مشکلی پیش آمد. ممکن است از سمت بانک خطایی رخ داده یا کد تایید را اشتباه وارد کرده باشید. می‌توانید مجدداً تلاش کنید یا در صورت نیاز با پشتیبانی تماس بگیرید."
        onRetry={handleRetry}
        onContactSupport={handleContactSupport}
        supportHref="/contact"
      />
    </div>
  );
}

export default PaymentFailedClient;
