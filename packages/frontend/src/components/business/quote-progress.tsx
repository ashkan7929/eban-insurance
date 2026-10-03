'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface QuoteProgressProps {
  current: number;
  total: number;
  className?: string;
}

export function QuoteProgress({
  current,
  total,
  className,
}: QuoteProgressProps) {
  const safeCurrent = Math.max(1, Math.min(current, total));
  const percentage = (safeCurrent / total) * 100;

  return (
    <div className={cn('w-full space-y-2', className)}>
      <div className="flex items-center justify-between">
        <span className="text-sm text-text-muted">
          مرحله {safeCurrent} از {total}
        </span>
        <span className="text-sm font-medium text-primary">
          {Math.round(percentage)}٪
        </span>
      </div>
      <div className="w-full h-2 rounded-full bg-border overflow-hidden">
        <motion.div
          className="h-full bg-primary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

export default QuoteProgress;
