'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import { Container } from '@/components/ui/container';
import { PageHeader } from '@/components/layout/page-header';
import { CheckoutClient } from './checkout-client';


interface PageProps {
  params: { orderId: string };
}

export default function CheckoutPage({ params }: PageProps) {
  const { orderId } = params;

  return (
    <main className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 bg-bg/30">
        <PageHeader
          title="پرداخت سفارش"
          subtitle="اطلاعات سفارش را بررسی کنید و از طریق درگاه بانکی امن پرداخت کنید"
          breadcrumb={[
            { label: 'خانه', href: '/' },
            { label: 'بیمه‌ها', href: '/insurance' },
            { label: 'پرداخت سفارش', href: '#' },
          ]}
        />
        <Container className="py-10">
          <CheckoutClient orderId={orderId} />
        </Container>
      </div>
      <Footer />
      <MobileBottomNav />
    </main>
  );
}
