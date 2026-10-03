'use client';

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { PolicyCard, type PolicyStatus } from '@/components/business/policy-card';
import { cn } from '@/lib/utils';

type FilterKey = 'all' | PolicyStatus;

interface FilterChip {
  key: FilterKey;
  label: string;
}

const filters: FilterChip[] = [
  { key: 'all', label: 'همه' },
  { key: 'active', label: 'فعال' },
  { key: 'expiring-soon', label: 'در حال اتمام' },
  { key: 'pending', label: 'در انتظار فعال‌سازی' },
  { key: 'expired', label: 'منقضی شده' },
];

const mockPolicies = [
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
  {
    id: 104,
    policyNumber: 'EBAN-TR-1402-0004',
    productSlug: 'travel',
    startDate: '2025-07-01',
    endDate: '2025-07-15',
    status: 'expired' as PolicyStatus,
    amount: 950000,
  },
  {
    id: 105,
    policyNumber: 'EBAN-TP-1402-0005',
    productSlug: 'third-party',
    startDate: undefined,
    endDate: undefined,
    status: 'pending' as PolicyStatus,
    amount: 4600000,
  },
  {
    id: 106,
    policyNumber: 'EBAN-TR-1402-0006',
    productSlug: 'travel',
    startDate: '2025-11-01',
    endDate: '2025-11-10',
    status: 'active' as PolicyStatus,
    amount: 1850000,
  },
];

export default function PoliciesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  const filteredPolicies = useMemo(() => {
    let list = mockPolicies;

    if (activeFilter !== 'all') {
      list = list.filter((p) => p.status === activeFilter);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter(
        (p) =>
          (p.policyNumber || '').toLowerCase().includes(q) ||
          p.productSlug.toLowerCase().includes(q)
      );
    }

    return list;
  }, [searchQuery, activeFilter]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-text">بیمه‌نامه‌های من</h1>
          <p className="text-sm text-text-muted mt-1">
            لیست تمام بیمه‌نامه‌های فعال و منقضی شما
          </p>
        </div>
      </div>

      <Card className="rounded-2xl">
        <CardContent className="p-4 md:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="w-full sm:w-72">
              <Input
                placeholder="جستجو بر اساس شماره بیمه‌نامه"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4" strokeWidth={2} />}
              />
            </div>
            <div className="text-sm text-text-muted">
              تعداد: <span className="font-bold text-text">{filteredPolicies.length}</span>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {filters.map((chip) => {
              const active = activeFilter === chip.key;
              const count =
                chip.key === 'all'
                  ? mockPolicies.length
                  : mockPolicies.filter((p) => p.status === chip.key).length;
              return (
                <button
                  key={chip.key}
                  type="button"
                  onClick={() => setActiveFilter(chip.key)}
                  className={cn(
                    'shrink-0 inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all',
                    active
                      ? 'bg-primary text-white shadow-sm'
                      : 'bg-bg text-text-muted hover:bg-border/60 hover:text-text'
                  )}
                >
                  {chip.label}
                  <Badge
                    variant={active ? 'outline' : 'default'}
                    size="sm"
                    className={cn(active && 'bg-white/20 text-white border-white/30')}
                  >
                    {count}
                  </Badge>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {filteredPolicies.length === 0 ? (
        <Card className="rounded-2xl">
          <CardContent className="py-16 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-bg flex items-center justify-center">
              <Search className="w-8 h-8 text-text-muted" strokeWidth={1.5} />
            </div>
            <h3 className="text-base font-bold text-text mb-2">بیمه‌نامه‌ای یافت نشد</h3>
            <p className="text-sm text-text-muted max-w-sm mx-auto">
              بیمه‌نامه‌ای با معیارهای جستجوی شما یافت نشد. لطفا فیلترها را تغییر دهید.
            </p>
            <div className="mt-5 flex justify-center">
              <Button
                variant="outline"
                size="md"
                onClick={() => {
                  setActiveFilter('all');
                  setSearchQuery('');
                }}
              >
                پاک کردن فیلترها
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-3 md:gap-4">
          {filteredPolicies.map((policy) => (
            <PolicyCard key={policy.id} policy={policy} />
          ))}
        </div>
      )}
    </div>
  );
}
