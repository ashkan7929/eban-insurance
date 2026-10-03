'use client';

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { OrderCard, type OrderStatus } from '@/components/business/order-card';
import { cn } from '@/lib/utils';

type FilterKey = 'all' | 'pending' | 'paid' | 'processing' | 'cancelled';

interface FilterChip {
  key: FilterKey;
  label: string;
  count: number;
  match: OrderStatus[];
}

const mockOrders = [
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
  {
    id: 6,
    orderNumber: 'INS-14020006',
    productSlug: 'body',
    status: 'paid' as OrderStatus,
    amount: 10500000,
    createdAt: '2025-08-10T08:40:00Z',
  },
  {
    id: 7,
    orderNumber: 'INS-14020007',
    productSlug: 'life',
    status: 'processing' as OrderStatus,
    amount: 5600000,
    createdAt: '2025-09-29T13:20:00Z',
  },
  {
    id: 8,
    orderNumber: 'INS-14020008',
    productSlug: 'travel',
    status: 'pending' as OrderStatus,
    amount: 1250000,
    createdAt: '2025-09-29T19:00:00Z',
  },
];

export default function OrdersPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeFilter, setActiveFilter] = useState<FilterKey>('all');

  const filters: FilterChip[] = useMemo(
    () => [
      {
        key: 'all',
        label: 'همه',
        count: mockOrders.length,
        match: [],
      },
      {
        key: 'pending',
        label: 'در انتظار پرداخت',
        count: mockOrders.filter((o) => o.status === 'pending').length,
        match: ['pending'],
      },
      {
        key: 'paid',
        label: 'پرداخت شده',
        count: mockOrders.filter((o) => o.status === 'paid').length,
        match: ['paid'],
      },
      {
        key: 'processing',
        label: 'در حال پردازش',
        count: mockOrders.filter((o) => o.status === 'processing').length,
        match: ['processing'],
      },
      {
        key: 'cancelled',
        label: 'لغو شده',
        count: mockOrders.filter((o) => o.status === 'failed').length,
        match: ['failed'],
      },
    ],
    []
  );

  const filteredOrders = useMemo(() => {
    let list = mockOrders;

    if (activeFilter !== 'all') {
      const chip = filters.find((f) => f.key === activeFilter);
      if (chip && chip.match.length) {
        list = list.filter((o) => chip.match.includes(o.status));
      }
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim().toLowerCase();
      list = list.filter((o) => o.orderNumber.toLowerCase().includes(q));
    }

    return list;
  }, [searchQuery, activeFilter, filters]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-text">سفارش‌های من</h1>
          <p className="text-sm text-text-muted mt-1">
            در این بخش می‌توانید وضعیت تمام سفارش‌های خود را مشاهده کنید
          </p>
        </div>
      </div>

      <Card className="rounded-2xl">
        <CardContent className="p-4 md:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="w-full sm:w-72">
              <Input
                placeholder="جستجو بر اساس شماره سفارش"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-4 h-4" strokeWidth={2} />}
              />
            </div>
            <div className="text-sm text-text-muted">
              تعداد نتایج: <span className="font-bold text-text">{filteredOrders.length}</span>
            </div>
          </div>

          <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
            {filters.map((chip) => {
              const active = activeFilter === chip.key;
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
                    className={cn(
                      active && 'bg-white/20 text-white border-white/30'
                    )}
                  >
                    {chip.count}
                  </Badge>
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {filteredOrders.length === 0 ? (
        <Card className="rounded-2xl">
          <CardContent className="py-16 text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-bg flex items-center justify-center">
              <Search className="w-8 h-8 text-text-muted" strokeWidth={1.5} />
            </div>
            <h3 className="text-base font-bold text-text mb-2">سفارشی یافت نشد</h3>
            <p className="text-sm text-text-muted max-w-sm mx-auto">
              سفارشی با معیارهای جستجوی شما یافت نشد. لطفا فیلترها را تغییر دهید یا شماره سفارش دیگری را جستجو کنید.
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
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-4">
          {filteredOrders.map((order) => (
            <OrderCard key={order.id} order={order} />
          ))}
        </div>
      )}
    </div>
  );
}
