'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ShieldCheck, ChevronDown, Menu } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site';
import { products } from '@/config/products';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';

export function Header() {
  const pathname = usePathname();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-border bg-white/80 backdrop-blur-md">
      <Container>
        <div className="flex items-center justify-between py-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="h-6 w-6" strokeWidth={2} />
            </div>
            <span className="text-lg font-bold text-text">{siteConfig.name}</span>
          </Link>

          <nav className="hidden items-center gap-1 sm:flex">
            {siteConfig.navLinks.map((link) => {
              if (link.href === '/insurance') {
                return (
                  <div
                    key={link.title}
                    className="relative group"
                    onMouseEnter={() => setDropdownOpen(true)}
                    onMouseLeave={() => setDropdownOpen(false)}
                  >
                    <button
                      className={cn(
                        'flex items-center gap-1 rounded-xl px-4 py-2 text-sm font-medium transition-colors',
                        isActive(link.href)
                          ? 'bg-primary/10 text-primary'
                          : 'text-text hover:bg-bg'
                      )}
                    >
                      {link.title}
                      <ChevronDown
                        className={cn(
                          'h-4 w-4 transition-transform',
                          dropdownOpen && 'rotate-180'
                        )}
                      />
                    </button>
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{
                        opacity: dropdownOpen ? 1 : 0,
                        y: dropdownOpen ? 0 : 8,
                        pointerEvents: dropdownOpen ? 'auto' : 'none',
                      }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full w-64 rounded-xl border border-border bg-white p-2 shadow-card-lg"
                    >
                      {products.map((product) => {
                        const Icon = product.icon;
                        return (
                          <Link
                            key={product.slug}
                            href={`/insurance/${product.slug}`}
                            className="flex items-start gap-3 rounded-lg p-3 transition-colors hover:bg-bg"
                          >
                            <div
                              className={cn(
                                'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg',
                                product.bgColor,
                                product.color
                              )}
                            >
                              <Icon className="h-5 w-5" />
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="truncate text-sm font-medium text-text">
                                {product.title}
                              </div>
                              <div className="truncate text-xs text-text-muted">
                                {product.description}
                              </div>
                            </div>
                          </Link>
                        );
                      })}
                    </motion.div>
                  </div>
                );
              }

              return (
                <Link
                  key={link.title}
                  href={link.href}
                  className={cn(
                    'rounded-xl px-4 py-2 text-sm font-medium transition-colors',
                    isActive(link.href)
                      ? 'bg-primary/10 text-primary'
                      : 'text-text hover:bg-bg'
                  )}
                >
                  {link.title}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <Button className="hidden sm:inline-flex" size="md">
              ورود / ثبت‌نام
            </Button>
            <button className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-white sm:hidden">
              <Menu className="h-5 w-5 text-text" />
            </button>
          </div>
        </div>
      </Container>
    </header>
  );
}
