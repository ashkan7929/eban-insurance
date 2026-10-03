'use client';

import Link from 'next/link';
import {
  ShieldCheck,
  Phone,
  Mail,
  MapPin,
  Instagram,
  Twitter,
  Send,
  MessageCircle,
  CreditCard,
  Shield,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site';
import { products } from '@/config/products';
import { Container } from '@/components/ui/container';

const quickLinks = [
  { title: 'خانه', href: '/' },
  { title: 'بیمه‌ها', href: '/insurance' },
  { title: 'پیگیری', href: '/tracking' },
  { title: 'راهنما', href: '/faq' },
  { title: 'تماس', href: '/contact' },
];

export function Footer() {
  return (
    <footer className="mt-10 border-t border-border bg-card">
      <Container>
        <div className="grid grid-cols-1 gap-8 py-12 md:grid-cols-2 lg:grid-cols-4">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                <ShieldCheck className="h-6 w-6" strokeWidth={2} />
              </div>
              <span className="text-lg font-bold text-text">{siteConfig.name}</span>
            </Link>
            <p className="text-sm leading-7 text-text-muted">
              {siteConfig.slogan}
              <br />
              <span className="mt-1 block">
                پلتفرم جامع خرید و مدیریت بیمه‌های آنلاین با بالاترین سطح امنیت و اعتماد.
              </span>
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-bold text-text">دسترسی سریع</h3>
            <ul className="space-y-2.5">
              {quickLinks.map((link) => (
                <li key={link.title}>
                  <Link
                    href={link.href}
                    className="text-sm text-text-muted transition-colors hover:text-primary"
                  >
                    {link.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-bold text-text">محصولات بیمه</h3>
            <ul className="space-y-2.5">
              {products.map((product) => (
                <li key={product.slug}>
                  <Link
                    href={`/insurance/${product.slug}`}
                    className="text-sm text-text-muted transition-colors hover:text-primary"
                  >
                    {product.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-4">
            <h3 className="text-base font-bold text-text">اطلاعات تماس</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <Phone className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <div>
                  <div className="text-sm font-medium text-text">
                    {siteConfig.phoneFormatted}
                  </div>
                  <div className="text-xs text-text-muted">خط پشتیبانی</div>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="text-sm text-text-muted transition-colors hover:text-primary"
                >
                  {siteConfig.email}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                <span className="text-sm text-text-muted">{siteConfig.address}</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border py-6">
          <div className="flex flex-col items-center justify-between gap-6 lg:flex-row">
            <p className="text-center text-sm text-text-muted lg:text-right">
              © ۱۴۰۵ «{siteConfig.name}» — تمامی حقوق محفوظ است.
            </p>

            <div className="flex items-center gap-3">
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white transition-colors hover:border-primary hover:text-primary"
                aria-label="اینستاگرام"
              >
                <Instagram className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white transition-colors hover:border-primary hover:text-primary"
                aria-label="توییتر"
              >
                <Twitter className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white transition-colors hover:border-primary hover:text-primary"
                aria-label="واتساپ"
              >
                <MessageCircle className="h-4 w-4" />
              </Link>
              <Link
                href="#"
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-border bg-white transition-colors hover:border-primary hover:text-primary"
                aria-label="تلگرام"
              >
                <Send className="h-4 w-4" />
              </Link>
            </div>

            <div className="flex items-center gap-3">
              <div
                className={cn(
                  'flex h-9 items-center gap-2 rounded-lg border border-border bg-white px-3',
                  'text-xs font-medium text-text-muted'
                )}
                title="پرداخت امن"
              >
                <CreditCard className="h-4 w-4 text-success" />
                پرداخت امن
              </div>
              <div
                className={cn(
                  'flex h-9 items-center gap-2 rounded-lg border border-border bg-white px-3',
                  'text-xs font-medium text-text-muted'
                )}
                title="SSL"
              >
                <Shield className="h-4 w-4 text-primary" />
                SSL
              </div>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  );
}
