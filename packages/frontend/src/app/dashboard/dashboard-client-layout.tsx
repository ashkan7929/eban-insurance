'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import {
  LayoutDashboard,
  FileText,
  ShieldCheck,
  FolderOpen,
  User,
  LogOut,
  Menu,
  X,
} from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';

const navItems = [
  {
    label: 'داشبورد',
    href: '/dashboard',
    icon: LayoutDashboard,
    exact: true,
  },
  {
    label: 'سفارش‌های من',
    href: '/dashboard/orders',
    icon: FileText,
    exact: false,
  },
  {
    label: 'بیمه‌نامه‌های من',
    href: '/dashboard/policies',
    icon: ShieldCheck,
    exact: false,
  },
  {
    label: 'مدارک من',
    href: '/dashboard/documents',
    icon: FolderOpen,
    exact: false,
  },
  {
    label: 'پروفایل کاربر',
    href: '/dashboard/profile',
    icon: User,
    exact: true,
  },
];

interface DashboardClientLayoutProps {
  children: React.ReactNode;
}

export function DashboardClientLayout({ children }: DashboardClientLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { isAuthenticated, user, isLoading, logout, loadFromStorage, _hasHydrated } = useAuthStore();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    loadFromStorage();
  }, [loadFromStorage]);

  useEffect(() => {
    if (_hasHydrated && !isLoading && !isAuthenticated) {
      router.replace('/auth');
    }
  }, [_hasHydrated, isAuthenticated, isLoading, router]);

  if (!_hasHydrated || isLoading || !isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 rounded-full border-3 border-primary border-t-transparent animate-spin" />
          <p className="text-sm text-text-muted">در حال بارگذاری...</p>
        </div>
      </div>
    );
  }

  const isActive = (href: string, exact: boolean) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  const fullName =
    user.first_name && user.last_name
      ? `${user.first_name} ${user.last_name}`
      : user.first_name || user.last_name || 'کاربر گرامی';

  const handleLogout = () => {
    logout();
    router.replace('/');
  };

  return (
    <div className="flex flex-col lg:flex-row bg-bg min-h-[calc(100vh-200px)]">
      <div className="lg:hidden sticky top-[57px] z-30 bg-white border-b border-border">
        <Container>
          <div className="flex items-center justify-between py-2.5 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-1.5">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href, item.exact);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileNavOpen(false)}
                    className={cn(
                      'shrink-0 px-3 py-2 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-colors',
                      active
                        ? 'bg-primary/10 text-primary'
                        : 'text-text-muted hover:bg-bg hover:text-text'
                    )}
                  >
                    <Icon className="w-3.5 h-3.5" strokeWidth={2} />
                    <span>{item.label}</span>
                  </Link>
                );
              })}
            </div>
            <button
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
              className="shrink-0 w-9 h-9 flex items-center justify-center rounded-xl border border-border mr-2 text-text-muted"
            >
              {mobileNavOpen ? (
                <X className="w-4 h-4" strokeWidth={2} />
              ) : (
                <Menu className="w-4 h-4" strokeWidth={2} />
              )}
            </button>
          </div>
        </Container>
      </div>

      {mobileNavOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/40" onClick={() => setMobileNavOpen(false)}>
          <div
            className="absolute right-0 top-0 h-full w-72 bg-white shadow-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="p-5 border-b border-border">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                  {fullName.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-text text-sm">{fullName}</p>
                  <p className="text-xs text-text-muted" dir="ltr">
                    {user.mobile}
                  </p>
                </div>
              </div>
            </div>
            <nav className="p-3 space-y-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.href, item.exact);
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileNavOpen(false)}
                    className={cn(
                      'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                      active
                        ? 'bg-primary/10 text-primary'
                        : 'text-text hover:bg-bg'
                    )}
                  >
                    <Icon className="w-5 h-5" strokeWidth={2} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>
            <div className="p-3 mt-4 border-t border-border">
              <Button
                variant="ghost"
                className="w-full justify-start text-danger hover:bg-danger/10 hover:text-danger"
                onClick={handleLogout}
              >
                <LogOut className="w-4 h-4" strokeWidth={2} />
                خروج از حساب
              </Button>
            </div>
          </div>
        </div>
      )}

      <aside className="hidden lg:flex flex-col w-60 shrink-0 bg-card border-l border-border sticky top-[57px] h-[calc(100vh-57px)] py-5">
        <div className="px-5 pb-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
              {fullName.charAt(0)}
            </div>
            <div className="min-w-0">
              <p className="font-bold text-text text-sm truncate">{fullName}</p>
              <p className="text-xs text-text-muted truncate" dir="ltr">
                {user.mobile}
              </p>
            </div>
          </div>
        </div>

        <nav className="flex-1 p-3 space-y-1 mt-2 overflow-y-auto">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = isActive(item.href, item.exact);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  'flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary/10 text-primary shadow-sm'
                    : 'text-text hover:bg-bg'
                )}
              >
                <Icon className="w-5 h-5" strokeWidth={2} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-border mt-2">
          <Button
            variant="ghost"
            className="w-full justify-start text-danger hover:bg-danger/10 hover:text-danger"
            onClick={handleLogout}
          >
            <LogOut className="w-4 h-4" strokeWidth={2} />
            خروج از حساب
          </Button>
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <Container className="py-6 md:py-8 lg:py-8">
          {children}
        </Container>
      </div>
    </div>
  );
}

export default DashboardClientLayout;
