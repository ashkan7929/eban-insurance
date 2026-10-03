'use client';

import { Check, CircleDot } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ProductFeature } from '@/config/products';

interface InsuranceFeatureProps {
  feature: ProductFeature | string;
  variant?: 'check' | 'dot';
  colorClass?: string;
  bgClass?: string;
  className?: string;
}

export function InsuranceFeature({
  feature,
  variant = 'check',
  colorClass = 'text-primary',
  bgClass = 'bg-primary/10',
  className,
}: InsuranceFeatureProps) {
  const title = typeof feature === 'string' ? feature : feature.title;
  const Icon = variant === 'check' ? Check : CircleDot;

  return (
    <div className={cn('flex items-start gap-3', className)}>
      <div
        className={cn(
          'mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full',
          bgClass,
          colorClass
        )}
      >
        <Icon className="h-3.5 w-3.5" strokeWidth={variant === 'check' ? 3 : 2} />
      </div>
      <span className="text-sm leading-7 text-text">{title}</span>
    </div>
  );
}
