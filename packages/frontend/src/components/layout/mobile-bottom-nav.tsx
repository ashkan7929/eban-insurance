'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Grid3x3, FileText, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const items = [
  {
    label: 'خانه',
    href: '/',
    icon: Home,
  },
  {
    label: 'بیمه‌ها',
    href: '/insurance',
    icon: Grid3x3,
  },
  {
    label: 'سفارش‌ها',
    href: '/dashboard/orders',
    icon: FileText,
  },
  {
    label: 'حساب',
    href: '/dashboard/profile',
    icon: User,
  },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/';
    return pathname.startsWith(href);
  };

  return (
    <nav className="fixed bottom-0 z-40 w-full border-t border-border bg-white/90 backdrop-blur px-2 py-2 sm:hidden">
      <div className="grid grid-cols-4">
        {items.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center gap-1 py-1.5 text-[11px] transition-colors',
                active
                  ? 'font-medium text-primary'
                  : 'text-text-muted hover:text-text'
              )}
            >
              <Icon
                className={cn(
                  'h-5 w-5 transition-colors',
                  active ? 'text-primary' : 'text-text-muted'
                )}
                strokeWidth={active ? 2.25 : 1.75}
              />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
