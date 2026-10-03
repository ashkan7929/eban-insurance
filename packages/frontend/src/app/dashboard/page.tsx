'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import {
  FileText,
  ShieldCheck,
  FileWarning,
  Wallet,
  ArrowLeft,
  RefreshCw,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { OrderCard, type OrderStatus } from '@/components/business/order-card';
import { PolicyCard, type PolicyStatus } from '@/components/business/policy-card';
import { cn, formatIRR } from '@/lib/utils';
import { useAuthStore } from '@/store/auth-store';

const mockStats = {
  activeOrders: 3,
  totalPolicies: 5,
  pendingDocs: 2,
  totalPaid: 12500000,
};

const mockRecentOrders = [
  {
    id: 1,
    orderNumber: 'INS-14020001',
    productSlug: 'third-party',
    status: 'processing' as OrderStatus,
    amount: 4500000,
    createdAt: '2025-09-28T10:30:00Z',
  },
  {
    id: 2,
    orderNumber: 'INS-14020002',
    productSlug: 'body',
    status: 'paid' as OrderStatus,
    amount: 8200000,
    createdAt: '2025-09-25T14:15:00Z',
  },
  {
    id: 3,
    orderNumber: 'INS-14020003',
    productSlug: 'life',
    status: 'pending' as OrderStatus,
    amount: 2100000,
    createdAt: '2025-09-30T09:00:00Z',
  },
  {
    id: 4,
    orderNumber: 'INS-14020004',
    productSlug: 'travel',
    status: 'paid' as OrderStatus,
    amount: 950000,
    createdAt: '2025-09-20T16:45:00Z',
  },
  {
    id: 5,
    orderNumber: 'INS-14020005',
    productSlug: 'third-party',
    status: 'failed' as OrderStatus,
    amount: 4300000,
    createdAt: '2025-09-15T11:20:00Z',
  },
];

const mockUpcomingRenewals = [
  {
    id: 101,
    policyNumber: 'EBAN-TP-1402-0001',
    productSlug: 'third-party',
    startDate: '2024-10-01',
    endDate: '2025-10-20',
    status: 'expiring-soon' as PolicyStatus,
    amount: 4500000,
  },
  {
    id: 102,
    policyNumber: 'EBAN-LF-1402-0002',
    productSlug: 'life',
    startDate: '2024-12-15',
    endDate: '2025-12-15',
    status: 'active' as PolicyStatus,
    amount: 12000000,
  },
  {
    id: 103,
    policyNumber: 'EBAN-BD-1402-0003',
    productSlug: 'body',
    startDate: '2025-01-10',
    endDate: '2026-01-10',
    status: 'active' as PolicyStatus,
    amount: 9800000,
  },
];

interface StatCardProps {
  icon: typeof FileText;
  label: string;
  value: string | number;
  suffix?: string;
  color: string;
  bgColor: string;
  href?: string;
}

function StatCard({ icon: Icon, label, value, suffix, color, bgColor, href }: StatCardProps) {
  const content = (
    <Card className="rounded-2xl hover:shadow-card-hover transition-shadow">
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1">
            <p className="text-sm text-text-muted mb-1.5">{label}</p>
            <p className="text-2xl font-bold text-text leading-tight">
              {typeof value === 'number' ? new Intl.NumberFormat('fa-IR').format(value) : value}
              {suffix && <span className="text-base font-medium text-text-muted mr-1">{suffix}</span>}
            </p>
          </div>
          <div
            className={cn(
              'w-11 h-11 rounded-2xl flex items-center justify-center shrink-0',
              bgColor,
              color
            )}
          >
            <Icon className="w-5 h-5" strokeWidth={2} />
          </div>
        </div>
      </CardContent>
    </Card>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }
  return content;
}

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 400);
    return () => clearTimeout(timer);
  }, []);

  const fullName =
    user?.first_name && user?.last_name
      ? `${user.first_name} ${user.last_name}`
      : user?.first_name || user?.last_name || 'کاربر گرامی';

  return (
    <div className="space-y-6 md:space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-text">
            {loading ? '...' : `سلام ${fullName} عزیز`}
          </h1>
          <p className="text-sm text-text-muted mt-1">
            آخرین وضعیت سفارش‌ها و بیمه‌نامه‌های شما
          </p>
        </div>
        <Button variant="outline" size="md">
          <RefreshCw className="w-4 h-4" strokeWidth={2} />
          به‌روزرسانی
        </Button>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
        <StatCard
          icon={FileText}
          label="سفارش‌های فعال"
          value={mockStats.activeOrders}
          suffix="عدد"
          color="text-primary"
          bgColor="bg-primary/10"
          href="/dashboard/orders"
        />
        <StatCard
          icon={ShieldCheck}
          label="بیمه‌نامه‌های من"
          value={mockStats.totalPolicies}
          suffix="عدد"
          color="text-success"
          bgColor="bg-success/10"
          href="/dashboard/policies"
        />
        <StatCard
          icon={FileWarning}
          label="مدارک در انتظار"
          value={mockStats.pendingDocs}
          suffix="فایل"
          color="text-warning"
          bgColor="bg-warning/10"
          href="/dashboard/documents"
        />
        <StatCard
          icon={Wallet}
          label="مبلغ کل پرداختی"
          value={formatIRR(mockStats.totalPaid)}
          color="text-secondary"
          bgColor="bg-secondary/10"
        />
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-8">
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-text">آخرین سفارش‌ها</h2>
            <Link
              href="/dashboard/orders"
              className="flex items-center gap-1 text-sm text-primary font-medium hover:underline"
            >
              مشاهده همه
              <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2.5} />
            </Link>
          </div>
          <div className="space-y-3">
            {mockRecentOrders.slice(0, 5).map((order) => (
              <OrderCard key={order.id} order={order} />
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-text">بیمه‌نامه‌های در حال تمدید</h2>
            <Link
              href="/dashboard/policies"
              className="flex items-center gap-1 text-sm text-primary font-medium hover:underline"
            >
              مشاهده همه
              <ArrowLeft className="w-3.5 h-3.5" strokeWidth={2.5} />
            </Link>
          </div>
          <div className="space-y-3">
            {mockUpcomingRenewals.map((policy) => (
              <PolicyCard key={policy.id} policy={policy} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
