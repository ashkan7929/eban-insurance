'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import { Container } from '@/components/ui/container';
import { PaymentFailedClient } from './failed-client';


interface PageProps {
  searchParams?: {
    orderId?: string;
    reason?: string;
  };
}

export default function PaymentFailedPage({ searchParams }: PageProps) {
  const orderId = searchParams?.orderId;

  return (
    <main className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 bg-bg/40">
        <Container>
          <PaymentFailedClient orderId={orderId} />
        </Container>
      </div>
      <Footer />
      <MobileBottomNav />
    </main>
  );
}
