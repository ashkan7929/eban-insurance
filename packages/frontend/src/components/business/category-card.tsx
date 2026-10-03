'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

export interface CategoryCardProps {
  icon: LucideIcon;
  title: string;
  color?: string;
  active?: boolean;
  onClick?: () => void;
}

export function CategoryCard({
  icon: Icon,
  title,
  color,
  active,
  onClick,
}: CategoryCardProps) {
  return (
    <motion.button
      type="button"
      onClick={onClick}
      whileHover={{ y: -3 }}
      whileTap={{ scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 20 }}
      className={cn(
        'rounded-2xl border p-6 flex flex-col items-center gap-3 w-full',
        'transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary/30',
        active
          ? 'border-primary bg-primary/5 shadow-card'
          : 'border-border bg-white hover:border-primary/40 hover:bg-bg shadow-card hover:shadow-card-hover'
      )}
    >
      <div
        className={cn(
          'w-16 h-16 rounded-2xl flex items-center justify-center',
          'transition-colors duration-200',
          active
            ? 'bg-primary text-white'
            : color ?? 'bg-primary/10 text-primary'
        )}
        style={
          !active && color
            ? { backgroundColor: 'rgba(37, 99, 235, 0.1)', color: '#2563eb' }
            : undefined
        }
      >
        <Icon className="w-8 h-8" strokeWidth={2} />
      </div>
      <h3
        className={cn(
          'text-base font-semibold transition-colors',
          active ? 'text-primary' : 'text-text'
        )}
      >
        {title}
      </h3>
    </motion.button>
  );
}

export default CategoryCard;
