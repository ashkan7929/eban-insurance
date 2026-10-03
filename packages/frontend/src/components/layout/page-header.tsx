'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Breadcrumb, type BreadcrumbItem } from './breadcrumb';
import { Container } from '@/components/ui/container';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  breadcrumb?: BreadcrumbItem[];
  className?: string;
  align?: 'left' | 'center';
}

export function PageHeader({
  title,
  subtitle,
  breadcrumb,
  className,
  align = 'left',
}: PageHeaderProps) {
  return (
    <section className={cn('bg-card border-b border-border py-8 md:py-10', className)}>
      <Container>
        <div
          className={cn(
            'flex flex-col gap-3',
            align === 'center' ? 'items-center text-center' : 'items-start text-right'
          )}
        >
          {breadcrumb && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
            >
              <Breadcrumb items={breadcrumb} />
            </motion.div>
          )}
          <motion.h2
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.05 }}
            className="text-2xl font-bold text-text md:text-3xl"
          >
            {title}
          </motion.h2>
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className={cn(
                'text-sm md:text-base text-text-muted max-w-2xl',
                align === 'center' ? 'mx-auto' : ''
              )}
            >
              {subtitle}
            </motion.p>
          )}
        </div>
      </Container>
    </section>
  );
}
