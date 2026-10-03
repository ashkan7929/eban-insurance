'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import { Container } from '@/components/ui/container';
import { PaymentSuccessClient } from './success-client';


interface PageProps {
  searchParams?: {
    orderId?: string;
    status?: string;
    orderNo?: string;
  };
}

export default function PaymentSuccessPage({ searchParams }: PageProps) {
  const orderId = searchParams?.orderId;
  const orderNo = searchParams?.orderNo;

  return (
    <main className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 bg-bg/40">
        <Container>
          <PaymentSuccessClient orderId={orderId} orderNo={orderNo} />
        </Container>
      </div>
      <Footer />
      <MobileBottomNav />
    </main>
  );
}
