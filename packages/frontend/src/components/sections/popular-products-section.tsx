'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Check, ArrowLeft } from 'lucide-react';
import { Section } from '@/components/ui/section';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { products, getProductBySlug, ProductConfig } from '@/config/products';

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const productSlugs = ['third-party', 'body', 'life', 'travel'];

const priceMap: Record<string, string> = {
  'third-party': 'از ۱,۲۵۰,۰۰۰ تومان',
  body: 'از ۵,۸۰۰,۰۰۰ تومان',
  life: 'از ۸۵۰,۰۰۰ تومان',
  travel: 'از ۳۲۰,۰۰۰ تومان',
};

interface ProductCardProps {
  product: ProductConfig;
  index: number;
}

function ProductCard({ product, index }: ProductCardProps) {
  const Icon = product.icon;
  const popular = index === 0;

  return (
    <motion.div
      variants={itemVariants}
      className="relative h-full"
    >
      {popular && (
        <div className="absolute -top-3 right-6 z-10">
          <Badge variant="warning" size="sm" className="shadow-card-lg">
            پرطرفدار
          </Badge>
        </div>
      )}

      <Card className="h-full flex flex-col transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 overflow-hidden">
        <CardHeader className="pb-4">
          <div className="flex items-start justify-between mb-4">
            <div
              className={cn(
                'flex h-12 w-12 items-center justify-center rounded-2xl',
                product.bgColor,
                product.color
              )}
            >
              <Icon className="h-6 w-6" strokeWidth={2} />
            </div>
            <Badge variant="outline" size="sm">
              {product.shortTitle}
            </Badge>
          </div>
          <CardTitle>{product.title}</CardTitle>
          <CardDescription>{product.description}</CardDescription>
        </CardHeader>

        <CardContent className="pb-4 flex-1">
          <ul className="space-y-2.5 mb-5">
            {product.features.slice(0, 3).map((feature) => (
              <li key={feature.title} className="flex items-start gap-2">
                <Check
                  className={cn('h-4 w-4 mt-0.5 shrink-0', product.color)}
                  strokeWidth={2.5}
                />
                <span className="text-sm text-text-muted leading-relaxed">
                  {feature.title}
                </span>
              </li>
            ))}
          </ul>

          <div className="pt-4 border-t border-border">
            <div className="text-xs text-text-muted mb-1">قیمت شروع از</div>
            <div className={cn('text-lg font-black', product.color)}>
              {priceMap[product.slug]}
            </div>
          </div>
        </CardContent>

        <CardFooter>
          <Link href={`/insurance/${product.slug}`} className="w-full">
            <Button variant="primary" size="md" className="w-full gap-1.5">
              خرید و مشاوره
              <ArrowLeft className="h-4 w-4" strokeWidth={2} />
            </Button>
          </Link>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

export function PopularProductsSection() {
  const popularProducts = productSlugs
    .map((slug) => getProductBySlug(slug))
    .filter((p): p is ProductConfig => p !== undefined);

  return (
    <Section
      eyebrow="محصولات محبوب"
      title="بیمه‌های پرطرفدار ما"
      description="محصولاتی که بیشترین انتخاب کاربران را داشته‌اند"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        className="grid gap-6 md:grid-cols-2 xl:grid-cols-4 mt-10"
      >
        {popularProducts.map((product, i) => (
          <ProductCard key={product.slug} product={product} index={i} />
        ))}
      </motion.div>
    </Section>
  );
}

export default PopularProductsSection;
