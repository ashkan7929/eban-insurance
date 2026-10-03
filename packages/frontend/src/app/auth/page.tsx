'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import { Container } from '@/components/ui/container';
import { AuthClient } from './auth-client';


export default function AuthPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <Header />
      <div className="flex-1 bg-bg/50">
        <Container className="max-w-md mx-auto py-16">
          <AuthClient />
        </Container>
      </div>
      <Footer />
      <MobileBottomNav />
    </main>
  );
}
