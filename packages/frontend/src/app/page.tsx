'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import { HeroSection } from '@/components/sections/hero-section';
import { CategorySelectorSection } from '@/components/sections/category-selector-section';
import { PopularProductsSection } from '@/components/sections/popular-products-section';
import { WhyUsSection } from '@/components/sections/why-us-section';
import { HowItWorksSection } from '@/components/sections/how-it-works-section';
import { CompaniesSection } from '@/components/sections/companies-section';
import { FaqSection } from '@/components/sections/faq-section';
import { CTASection } from '@/components/sections/cta-section';

export default function HomePage() {
  return (
    <main className="flex flex-col min-h-screen">
      <Header />
      <HeroSection />
      <CategorySelectorSection />
      <PopularProductsSection />
      <WhyUsSection />
      <HowItWorksSection />
      <CompaniesSection />
      <FaqSection />
      <CTASection />
      <Footer />
      <MobileBottomNav />
    </main>
  );
}
