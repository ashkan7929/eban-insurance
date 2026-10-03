'use client';

import Link from 'next/link';
import { ShieldX, Home, ArrowLeft, Search } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import { Container } from '@/components/ui/container';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config/site';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 flex items-center justify-center py-16 sm:py-20">
        <Container>
          <div className="flex flex-col items-center justify-center text-center mx-auto max-w-xl">
            <div className="relative mb-8">
              <div className="absolute inset-0 rounded-full bg-primary/10 blur-3xl opacity-60 scale-150" />
              <div className="relative flex h-28 w-28 sm:h-32 sm:w-32 items-center justify-center rounded-3xl bg-gradient-to-br from-primary/15 via-primary/5 to-transparent border border-primary/20 shadow-card-lg">
                <ShieldX className="h-14 w-14 sm:h-16 sm:w-16 text-primary" strokeWidth={1.5} />
              </div>
            </div>

            <div className="mb-2">
              <span className="text-[110px] sm:text-[140px] font-black leading-none bg-gradient-to-l from-primary via-primary-light to-primary/40 bg-clip-text text-transparent select-none">
                ۴۰۴
              </span>
            </div>

            <h1 className="text-2xl font-bold text-text mb-3 sm:text-3xl">
              صفحه‌ای که دنبالش هستی پیدا نشد
            </h1>
            <p className="text-sm leading-8 text-text-muted mb-8 sm:text-base">
              ممکن است آدرس را اشتباه وارد کرده باشید یا صفحه مورد نظر حذف شده باشد.
              می‌توانید به صفحه اصلی بازگردید و از منو محصولات دیگر را مشاهده کنید.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full sm:w-auto">
              <Link href="/" className="w-full sm:w-auto">
                <Button size="lg" className="gap-2 w-full sm:w-auto">
                  <Home className="h-5 w-5" />
                  بازگشت به خانه
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/insurance" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="gap-2 w-full sm:w-auto">
                  <Search className="h-5 w-5" />
                  مشاهده بیمه‌ها
                </Button>
              </Link>
            </div>

            <div className="mt-10 pt-8 border-t border-border w-full">
              <p className="text-xs text-text-muted mb-4">
                یا از لینک‌های سریع زیر استفاده کنید:
              </p>
              <div className="flex flex-wrap items-center justify-center gap-2">
                {siteConfig.navLinks.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-xl border border-border bg-white px-4 py-2 text-xs font-medium text-text-muted transition-colors hover:border-primary hover:text-primary hover:bg-primary/5"
                  >
                    {link.title}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
