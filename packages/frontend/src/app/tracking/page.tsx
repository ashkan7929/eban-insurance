'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import { PageHeader } from '@/components/layout/page-header';
import { Container } from '@/components/ui/container';
import { TrackingClient } from './tracking-client';


export default function TrackingPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <Header />
      <PageHeader
        title="پیگیری خرید بیمه"
        subtitle="برای پیگیری سفارش فقط کافیست شماره موبایل و شماره سفارش را وارد کنید"
        breadcrumb={[
          { label: 'خانه', href: '/' },
          { label: 'پیگیری سفارش' },
        ]}
      />
      <Container>
        <TrackingClient />
      </Container>
      <Footer />
      <MobileBottomNav />
    </main>
  );
}
