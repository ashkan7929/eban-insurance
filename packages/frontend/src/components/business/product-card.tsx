'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { cn, formatIRR } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

export interface ProductCardProps {
  product: {
    slug: string;
    title: string;
    description: string;
    icon: LucideIcon;
    color: string;
    bgColor?: string;
    estimatedPriceFrom?: number;
    features: { title: string }[];
  };
  href?: string;
  className?: string;
}

export function ProductCard({ product, href, className }: ProductCardProps) {
  const Icon = product.icon;
  const linkHref = href ?? `/quote/${product.slug}`;

  const bgColorFallback = (colorClass: string) => {
    if (product.bgColor) return product.bgColor;
    const colorMap: Record<string, string> = {
      'text-primary': 'bg-primary/10',
      'text-secondary': 'bg-secondary/10',
      'text-danger': 'bg-danger/10',
      'text-accent': 'bg-accent/10',
      'text-success': 'bg-success/10',
      'text-warning': 'bg-warning/10',
    };
    return colorMap[colorClass] ?? 'bg-primary/10';
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
      className={cn('h-full', className)}
    >
      <Card className="rounded-3xl bg-white shadow-card hover:shadow-card-hover transition-shadow border border-border h-full">
        <CardContent className="p-6 flex flex-col h-full gap-5">
          <div
            className={cn(
              'w-12 h-12 rounded-2xl flex items-center justify-center',
              bgColorFallback(product.color),
              product.color
            )}
          >
            <Icon className="w-6 h-6" strokeWidth={2} />
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-bold text-text">{product.title}</h3>
            <p className="text-sm text-text-muted leading-relaxed">
              {product.description}
            </p>
          </div>

          <ul className="space-y-2.5 flex-1">
            {product.features.slice(0, 3).map((feature, idx) => (
              <li key={idx} className="flex items-center gap-2 text-sm text-text">
                <span className="w-4 h-4 rounded-full bg-success/15 flex items-center justify-center shrink-0">
                  <Check className="w-3 h-3 text-success" strokeWidth={3} />
                </span>
                <span>{feature.title}</span>
              </li>
            ))}
          </ul>

          <div className="pt-3 border-t border-border space-y-4">
            {product.estimatedPriceFrom ? (
              <div className="text-right">
                <span className="font-bold text-text">
                  از {formatIRR(product.estimatedPriceFrom)}
                </span>
              </div>
            ) : null}
            <Link href={linkHref} className="block">
              <Button className="w-full" size="md">
                محاسبه قیمت
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default ProductCard;
