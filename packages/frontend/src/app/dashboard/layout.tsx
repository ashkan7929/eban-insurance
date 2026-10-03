'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import { DashboardClientLayout } from './dashboard-client-layout';


export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="flex flex-col min-h-screen">
      <Header />
      <DashboardClientLayout>{children}</DashboardClientLayout>
      <Footer />
      <MobileBottomNav />
    </main>
  );
}
