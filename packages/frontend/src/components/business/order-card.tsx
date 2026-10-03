'use client';

import Link from 'next/link';
import { Eye } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getProductBySlug } from '@/config/products';
import { cn, formatDate, formatIRR } from '@/lib/utils';

export type OrderStatus = 'pending' | 'paid' | 'failed' | 'processing';

export interface OrderCardProps {
  order: {
    id?: string | number;
    orderNumber: string;
    productSlug: string;
    status: OrderStatus;
    amount: number;
    createdAt: string | Date;
  };
}

const statusConfig: Record<OrderStatus, { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'outline' }> = {
  pending: { label: 'در انتظار پرداخت', variant: 'warning' },
  paid: { label: 'پرداخت شده', variant: 'success' },
  failed: { label: 'پرداخت ناموفق', variant: 'danger' },
  processing: { label: 'در حال پردازش', variant: 'default' },
};

export function OrderCard({ order }: OrderCardProps) {
  const product = getProductBySlug(order.productSlug);
  const status = statusConfig[order.status] ?? statusConfig.pending;
  const viewHref = order.id !== undefined ? `/dashboard/orders/${order.id}` : '#';

  return (
    <Card className="rounded-2xl bg-white shadow-card hover:shadow-card-hover transition-shadow border-border">
      <CardContent className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            {product?.icon ? (
              <div
                className={cn(
                  'w-12 h-12 rounded-2xl flex items-center justify-center shrink-0',
                  product.bgColor,
                  product.color
                )}
              >
                <product.icon className="w-6 h-6" strokeWidth={2} />
              </div>
            ) : (
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center shrink-0" />
            )}

            <div className="space-y-2 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-text truncate">
                  {product?.title ?? order.productSlug}
                </h3>
                <Badge variant={status.variant} size="sm">
                  {status.label}
                </Badge>
              </div>
              <div className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-text-muted">
                <span>شماره سفارش: {order.orderNumber}</span>
                <span>{formatDate(order.createdAt)}</span>
              </div>
              <p className="text-base font-bold text-text">
                {formatIRR(order.amount)}
              </p>
            </div>
          </div>

          <div className="sm:mr-4 shrink-0">
            <Link href={viewHref}>
              <Button variant="outline" size="md">
                <Eye className="w-4 h-4" strokeWidth={2} />
                مشاهده جزئیات
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default OrderCard;
