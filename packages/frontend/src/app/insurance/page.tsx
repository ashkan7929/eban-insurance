'use client';

import { Gauge, Calculator, FileCheck2, Zap } from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import { PageHeader } from '@/components/layout/page-header';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { products } from '@/config/products';
import { ProductCard } from '@/components/business/product-card';

const estimatedPrices: Record<string, number> = {
  'third-party': 1850000,
  body: 4500000,
  life: 2800000,
  travel: 980000,
};

const whyUsFeatures = [
  {
    icon: Gauge,
    title: 'مقایسه سریع',
    description: 'در چند ثانیه بهترین بیمه‌ها را با هم مقایسه کنید و مناسب‌ترین گزینه را انتخاب نمایید.',
    color: 'text-primary',
    bgColor: 'bg-primary/10',
  },
  {
    icon: Calculator,
    title: 'محاسبه فوری قیمت',
    description: 'بدون نیاز به مراجعه حضوری، قیمت دقیق بیمه خود را فوراً محاسبه و مشاهده کنید.',
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
  },
  {
    icon: FileCheck2,
    title: 'صدور آنلاین',
    description: 'پس از انتخاب و پرداخت، بیمه‌نامه شما به صورت فوری و آنلاین صادر و ارسال می‌شود.',
    color: 'text-accent',
    bgColor: 'bg-accent/10',
  },
];

export default function InsuranceListPage() {
  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      <main className="flex-1 pb-16 sm:pb-10">
        <PageHeader
          title="محصولات بیمه"
          subtitle="راحت و سریع بهترین گزینه رو انتخاب کن"
          breadcrumb={[
            { label: 'خانه', href: '/' },
            { label: 'بیمه‌ها' },
          ]}
        />

        <Section>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
            {products.map((product) => (
              <ProductCard
                key={product.slug}
                product={{
                  ...product,
                  estimatedPriceFrom: estimatedPrices[product.slug],
                }}
                href={`/insurance/${product.slug}`}
              />
            ))}
          </div>
        </Section>

        <Section className="bg-card border-t border-border" eyebrow="چرا ابان؟" title="چرا باید از ما بیمه بخرید؟">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {whyUsFeatures.map((feature, idx) => {
              const Icon = feature.icon;
              return (
                <Card
                  key={idx}
                  className="h-full transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5"
                >
                  <CardContent className="p-6">
                    <div
                      className={`mb-5 flex h-14 w-14 items-center justify-center rounded-2xl ${feature.bgColor} ${feature.color}`}
                    >
                      <Icon className="h-7 w-7" strokeWidth={2} />
                    </div>
                    <h3 className="text-lg font-bold text-text mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-sm leading-7 text-text-muted">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </Section>

        <Section className="pt-0">
          <Card className="overflow-hidden border-0 bg-gradient-to-l from-primary via-primary/90 to-primary-light text-white shadow-card-lg">
            <CardContent className="p-8 md:p-10">
              <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:text-right text-center">
                <div className="md:max-w-xl">
                  <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-1.5 text-xs font-medium text-white">
                    <Zap className="h-3.5 w-3.5" />
                    خرید آنلاین و فوری
                  </div>
                  <h3 className="text-2xl font-bold mb-3 md:text-3xl">
                    آماده شروع خرید هستید؟
                  </h3>
                  <p className="text-white/80 text-sm md:text-base leading-8">
                    محصول مورد نظر خود را انتخاب کنید، در چند مرحله ساده اطلاعات را وارد نمایید و بلافاصله بیمه‌نامه خود را دریافت کنید.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </Section>
      </main>

      <Footer />
      <MobileBottomNav />
    </div>
  );
}
