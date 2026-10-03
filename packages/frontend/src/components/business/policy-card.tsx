'use client';

import { Download, Eye, Calendar, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { getProductBySlug } from '@/config/products';
import { cn, formatDate, formatIRR } from '@/lib/utils';

export type PolicyStatus = 'active' | 'expired' | 'expiring-soon' | 'pending';

export interface PolicyCardProps {
  policy: {
    id?: string | number;
    policyNumber?: string;
    productSlug: string;
    startDate?: string | Date;
    endDate?: string | Date;
    status: PolicyStatus;
    amount: number;
  };
}

const statusConfig: Record<PolicyStatus, { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'outline'; icon: typeof Calendar }> = {
  active: { label: 'فعال', variant: 'success', icon: CheckCircle2 },
  'expiring-soon': { label: 'در حال اتمام', variant: 'warning', icon: Clock },
  expired: { label: 'منقضی شده', variant: 'danger', icon: AlertCircle },
  pending: { label: 'در انتظار فعال‌سازی', variant: 'default', icon: Clock },
};

function calculateDaysRemaining(endDate?: string | Date): number | null {
  if (!endDate) return null;
  const end = typeof endDate === 'object' ? endDate : new Date(endDate);
  const now = new Date();
  const diff = Math.ceil((end.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

export function PolicyCard({ policy }: PolicyCardProps) {
  const product = getProductBySlug(policy.productSlug);
  const status = statusConfig[policy.status] ?? statusConfig.pending;
  const StatusIcon = status.icon;
  const daysRemaining = calculateDaysRemaining(policy.endDate);

  return (
    <Card className="rounded-2xl bg-white shadow-card hover:shadow-card-hover transition-shadow border-border">
      <CardContent className="p-5">
        <div className="flex flex-col lg:flex-row lg:items-center gap-5">
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

            <div className="space-y-3 flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="font-bold text-text truncate">
                  {product?.title ?? policy.productSlug}
                </h3>
                <Badge variant={status.variant} size="sm">
                  <StatusIcon className="w-3.5 h-3.5 ml-1" strokeWidth={2} />
                  {status.label}
                </Badge>
                {daysRemaining !== null && daysRemaining > 0 && daysRemaining <= 30 ? (
                  <Badge variant="warning" size="sm">
                    {daysRemaining} روز باقی مانده
                  </Badge>
                ) : null}
              </div>

              {policy.policyNumber ? (
                <p className="text-sm text-text-muted">
                  شماره بیمه‌نامه:{' '}
                  <span className="font-medium text-text">{policy.policyNumber}</span>
                </p>
              ) : null}

              <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                {policy.startDate ? (
                  <div className="flex items-center gap-1.5 text-text-muted">
                    <Calendar className="w-4 h-4" strokeWidth={2} />
                    <span>شروع: {formatDate(policy.startDate)}</span>
                  </div>
                ) : null}
                {policy.endDate ? (
                  <div className="flex items-center gap-1.5 text-text-muted">
                    <Calendar className="w-4 h-4" strokeWidth={2} />
                    <span>پایان: {formatDate(policy.endDate)}</span>
                  </div>
                ) : null}
              </div>

              <p className="text-base font-bold text-text pt-1">
                {formatIRR(policy.amount)}
              </p>
            </div>
          </div>

          <div className="flex flex-row lg:flex-col gap-2 shrink-0">
            <Button variant="outline" size="md" className="flex-1 lg:flex-none">
              <Eye className="w-4 h-4" strokeWidth={2} />
              مشاهده
            </Button>
            <Button variant="ghost" size="md" className="flex-1 lg:flex-none text-primary hover:bg-primary/10 hover:text-primary">
              <Download className="w-4 h-4" strokeWidth={2} />
              دانلود
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export default PolicyCard;
