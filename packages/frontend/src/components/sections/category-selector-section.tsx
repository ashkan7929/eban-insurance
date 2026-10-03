'use client';

import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { Car, Home as HomeIcon, Heart, Plane, type LucideIcon } from 'lucide-react';
import { Section } from '@/components/ui/section';
import { cn } from '@/lib/utils';

interface CategoryCardProps {
  title: string;
  slug: string;
  icon: LucideIcon;
  colorClass: string;
  bgClass: string;
  borderClass: string;
  delay: number;
}

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

function CategoryCard({
  title,
  slug,
  icon: Icon,
  colorClass,
  bgClass,
  borderClass,
  delay,
}: CategoryCardProps) {
  const router = useRouter();

  return (
    <motion.button
      variants={itemVariants}
      custom={delay}
      onClick={() => router.push(`/insurance/${slug}`)}
      className={cn(
        'group relative w-full rounded-2xl border bg-card p-6 text-right transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1',
        'border-border hover:border-primary/30'
      )}
    >
      <div
        className={cn(
          'mb-5 flex h-14 w-14 items-center justify-center rounded-2xl transition-transform duration-300 group-hover:scale-110',
          bgClass,
          colorClass
        )}
      >
        <Icon className="h-7 w-7" strokeWidth={2} />
      </div>
      <h3 className="text-lg font-bold text-text group-hover:text-primary transition-colors">
        {title}
      </h3>
      <p className="mt-2 text-sm text-text-muted">
        کلیک برای مشاهده و خرید
      </p>
      <div
        className={cn(
          'mt-5 inline-flex items-center gap-1.5 text-sm font-medium transition-colors',
          colorClass
        )}
      >
        <span>انتخاب</span>
        <svg
          className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M19 12H5M12 19l-7-7 7-7" />
        </svg>
      </div>
    </motion.button>
  );
}

const categories = [
  {
    title: 'خودرو',
    slug: 'third-party',
    icon: Car,
    colorClass: 'text-primary',
    bgClass: 'bg-primary/10',
    borderClass: 'border-primary/20',
  },
  {
    title: 'خانه',
    slug: 'body',
    icon: HomeIcon,
    colorClass: 'text-accent',
    bgClass: 'bg-accent/10',
    borderClass: 'border-accent/20',
  },
  {
    title: 'زندگی',
    slug: 'life',
    icon: Heart,
    colorClass: 'text-success',
    bgClass: 'bg-success/10',
    borderClass: 'border-success/20',
  },
  {
    title: 'سفر',
    slug: 'travel',
    icon: Plane,
    colorClass: 'text-sky-600',
    bgClass: 'bg-sky-500/10',
    borderClass: 'border-sky-500/20',
  },
];

export function CategorySelectorSection() {
  return (
    <Section id="insurance-select" eyebrow="انتخاب بیمه" title="چه چیزی می‌خوای بیمه کنی؟">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        className="grid sm:grid-cols-2 md:grid-cols-4 gap-4 mt-10"
      >
        {categories.map((cat, i) => (
          <CategoryCard key={cat.slug} {...cat} delay={i} />
        ))}
      </motion.div>
    </Section>
  );
}

export default CategorySelectorSection;
