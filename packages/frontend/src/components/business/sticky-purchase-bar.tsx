'use client';

import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn, formatIRR } from '@/lib/utils';
import type { ProductConfig } from '@/config/products';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck } from 'lucide-react';

const estimatedPrices: Record<string, number> = {
  'third-party': 1850000,
  body: 4500000,
  life: 2800000,
  travel: 980000,
};

export interface StickyPurchaseBarProps {
  title?: string;
  amount?: number;
  buttonText?: string;
  onButtonClick?: () => void;
  href?: string;
  visible?: boolean;
  className?: string;
  product?: ProductConfig;
}

export function StickyPurchaseBar({
  title,
  amount,
  buttonText = 'ادامه و پرداخت',
  onButtonClick,
  href,
  visible = true,
  className,
  product,
}: StickyPurchaseBarProps) {
  let finalTitle = title ?? '';
  let finalAmount = amount ?? 0;
  let finalHref = href;

  if (product) {
    const ProductIcon = product.icon;
    finalTitle = product.title;
    finalAmount = amount ?? estimatedPrices[product.slug] ?? 0;
    finalHref = href ?? `/quote/${product.slug}`;

    const renderProductContent = () => (
      <AnimatePresence>
        {visible ? (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            className={cn(
              'fixed bottom-16 inset-x-0 z-40 sm:bottom-0 border-t border-border bg-white/95 backdrop-blur shadow-card-lg',
              className
            )}
          >
            <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between gap-4 py-3 sm:py-4">
                <div className="flex items-center gap-3 min-w-0">
                  <div
                    className={cn(
                      'flex h-10 w-10 shrink-0 sm:h-12 sm:w-12 items-center justify-center rounded-xl',
                      product.bgColor,
                      product.color
                    )}
                  >
                    <ProductIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                  </div>
                  <div className="min-w-0 hidden sm:block">
                    <div className="font-bold text-text truncate">
                      {finalTitle}
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="success" size="sm">
                        شروع از
                      </Badge>
                      <span className="text-sm font-bold text-primary">
                        {formatIRR(finalAmount)}
                      </span>
                    </div>
                  </div>
                  <div className="sm:hidden">
                    <div className="text-xs text-text-muted">شروع از</div>
                    <div className="text-sm font-bold text-primary">
                      {formatIRR(finalAmount)}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {finalHref ? (
                    <Link href={finalHref}>
                      <Button size="md" className="gap-1.5 sm:h-12 sm:px-8 sm:text-base">
                        <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5" />
                        <span className="sm:hidden">خرید</span>
                        <span className="hidden sm:inline">
                          {buttonText === 'ادامه و پرداخت'
                            ? 'محاسبه قیمت و شروع خرید'
                            : buttonText}
                        </span>
                        <ArrowLeft className="h-4 w-4 hidden sm:block" />
                      </Button>
                    </Link>
                  ) : (
                    <Button
                      size="md"
                      onClick={onButtonClick}
                      className="gap-1.5 sm:h-12 sm:px-8 sm:text-base shrink-0"
                    >
                      <ShieldCheck className="h-4 w-4 sm:h-5 sm:w-5" />
                      <span className="sm:hidden">خرید</span>
                      <span className="hidden sm:inline">
                        {buttonText === 'ادامه و پرداخت'
                          ? 'محاسبه قیمت و شروع خرید'
                          : buttonText}
                      </span>
                      <ArrowLeft className="h-4 w-4 hidden sm:block" />
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    );

    return renderProductContent();
  }

  const button = onButtonClick ? (
    <Button
      size="md"
      onClick={onButtonClick}
      className="shrink-0"
    >
      {buttonText}
    </Button>
  ) : finalHref ? (
    <Link href={finalHref} className="shrink-0">
      <Button size="md">
        {buttonText}
      </Button>
    </Link>
  ) : (
    <Button size="md" className="shrink-0">
      {buttonText}
    </Button>
  );

  return (
    <AnimatePresence>
      {visible ? (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 30 }}
          className={cn(
            'fixed bottom-[72px] right-0 left-0 z-40 sm:hidden',
            'border-t border-border bg-white/95 backdrop-blur shadow-card-lg',
            className
          )}
        >
          <div className="px-4 py-3 flex items-center justify-between gap-3 max-w-lg mx-auto">
            <div className="min-w-0 flex-1">
              <p className="text-xs text-text-muted truncate">{finalTitle}</p>
              <p className="text-base font-bold text-primary truncate">
                {formatIRR(finalAmount)}
              </p>
            </div>
            {button}
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}

export default StickyPurchaseBar;
