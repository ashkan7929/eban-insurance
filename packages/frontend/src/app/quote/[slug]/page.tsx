'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import { PageHeader } from '@/components/layout/page-header';
import { Container } from '@/components/ui/container';
import { Stepper } from '@/components/ui/stepper';
import { Button } from '@/components/ui/button';
import { QuoteFlowClient } from './quote-flow-client';
import { QuoteSummary } from '@/components/business/quote-summary';
import { StickyPurchaseBar } from '@/components/business/sticky-purchase-bar';
import { products, getProductBySlug, productSlugs } from '@/config/products';
import type { QuoteStep } from '@/store/purchase-store';

const pageTitles: Record<string, string> = {
  'third-party': 'خرید بیمه شخص ثالث',
  body: 'خرید بیمه بدنه خودرو',
  life: 'خرید بیمه عمر و حوادث',
  travel: 'خرید بیمه مسافرت',
};

const stepperLabels: Record<string, { label: string }[]> = {
  'third-party': [
    { label: 'اطلاعات خودرو' },
    { label: 'اطلاعات بیمه' },
    { label: 'قیمت بیمه' },
    { label: 'اطلاعات شما' },
    { label: 'بازبینی نهایی' },
  ],
  body: [
    { label: 'اطلاعات خودرو' },
    { label: 'اطلاعات بیمه' },
    { label: 'قیمت بیمه' },
    { label: 'اطلاعات شما' },
    { label: 'بازبینی نهایی' },
  ],
  life: [
    { label: 'اطلاعات بیمه‌شده' },
    { label: 'اطلاعات پوشش' },
    { label: 'قیمت بیمه' },
    { label: 'اطلاعات شما' },
    { label: 'بازبینی نهایی' },
  ],
  travel: [
    { label: 'اطلاعات سفر' },
    { label: 'اطلاعات پوشش' },
    { label: 'قیمت بیمه' },
    { label: 'اطلاعات شما' },
    { label: 'بازبینی نهایی' },
  ],
};

export default function QuotePage() {
  const params = useParams<{ slug: string }>();
  const product = getProductBySlug(params.slug);

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg text-center p-10">
        <h1 className="text-2xl font-bold">محصول پیدا نشد</h1>
        <Link href="/insurance">
          <Button variant="primary">بازگشت به لیست بیمه‌ها</Button>
        </Link>
      </div>
    );
  }

  const pageTitle = pageTitles[product.slug] ?? `خرید ${product.title}`;
  const labels = (stepperLabels[product.slug] ?? stepperLabels['third-party']) as { label: string }[];

  return (
    <div className="flex min-h-screen flex-col pb-24 sm:pb-10">
      <Header />

      <main className="flex-1">
        <PageHeader
          title={pageTitle}
          subtitle="در چند دقیقه اطلاعات رو وارد کن و بیمه‌ات رو بخر"
          breadcrumb={[
            { label: 'خانه', href: '/' },
            { label: 'بیمه‌ها', href: '/insurance' },
            { label: product.title, href: `/insurance/${product.slug}` },
            { label: 'خرید' },
          ]}
        />

        <Container className="py-10">
          <div className="mb-8 max-w-4xl mx-auto">
            <Stepper steps={labels} currentStep={0} />
          </div>

          <QuoteFlowClient slug={product.slug} labels={labels} />
        </Container>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
