'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Divider } from '@/components/ui/divider';
import { cn, formatIRR } from '@/lib/utils';

export interface PriceBreakdownItem {
  label: string;
  value: number;
}

export interface PriceBreakdownProps {
  amount: number;
  breakdown?: PriceBreakdownItem[];
  className?: string;
}

const defaultBreakdownLabels = [
  'حق بیمه پایه',
  'تخفیف',
  'مالیات ۹٪',
  'کارمزد',
];

export function PriceBreakdown({
  amount,
  breakdown,
  className,
}: PriceBreakdownProps) {
  const items =
    breakdown ??
    defaultBreakdownLabels.map((label, idx) => ({
      label,
      value: idx === 0 ? amount : Math.round(amount * (idx === 1 ? -0.05 : idx === 2 ? 0.09 : 0.02)),
    }));

  const computedTotal = items.reduce((sum, item) => sum + item.value, 0);
  const finalAmount = amount || computedTotal;

  return (
    <Card className={cn('rounded-2xl', className)}>
      <CardContent className="p-5 space-y-0">
        <div className="space-y-3">
          {items.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between text-sm"
            >
              <span className="text-text-muted">{item.label}</span>
              <span
                className={cn(
                  'font-medium',
                  item.value < 0 ? 'text-success' : 'text-text'
                )}
              >
                {item.value < 0 ? '− ' : ''}
                {formatIRR(Math.abs(item.value))}
              </span>
            </div>
          ))}
        </div>

        <Divider className="my-4" />

        <div className="flex items-center justify-between">
          <span className="text-base font-bold text-text">مبلغ قابل پرداخت</span>
          <span className="text-lg font-bold text-primary">
            {formatIRR(finalAmount)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

export default PriceBreakdown;
