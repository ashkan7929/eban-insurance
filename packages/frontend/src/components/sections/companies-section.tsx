'use client';

import { motion } from 'framer-motion';
import { Building2 } from 'lucide-react';
import { Section } from '@/components/ui/section';
import { cn } from '@/lib/utils';

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.04,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' },
  },
};

interface CompanyLogoProps {
  name: string;
}

function CompanyLogo({ name }: CompanyLogoProps) {
  return (
    <motion.div
      variants={itemVariants}
      className={cn(
        'group relative flex aspect-[4/3] items-center justify-center rounded-2xl border border-border bg-card p-4',
        'transition-all duration-300 hover:shadow-card-hover hover:-translate-y-0.5 hover:border-primary/20'
      )}
    >
      <div className="flex flex-col items-center justify-center gap-2 w-full">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/5 text-primary/60 transition-colors duration-300 group-hover:bg-primary/10 group-hover:text-primary">
          <Building2 className="h-5 w-5" strokeWidth={1.75} />
        </div>
        <span className="text-sm font-bold text-text-muted transition-colors duration-300 group-hover:text-text">
          بیمه {name}
        </span>
      </div>
    </motion.div>
  );
}

const companies = [
  'ایران',
  'آسیا',
  'دنا',
  'پارسیان',
  'ملی',
  'کرمان',
  'پاسارگاد',
  'نوین',
  'معین',
  'رازی',
  'خاورمیانه',
  'آلبرز',
];

export function CompaniesSection() {
  return (
    <Section
      eyebrow="شرکت‌های بیمه"
      title="همکاری با برترین شرکت‌های بیمه کشور"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 mt-10"
      >
        {companies.map((name) => (
          <CompanyLogo key={name} name={name} />
        ))}
      </motion.div>
    </Section>
  );
}

export default CompaniesSection;
