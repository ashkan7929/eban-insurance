'use client';

import { motion } from 'framer-motion';
import { FastForward, CreditCard, Headphones, FileText } from 'lucide-react';
import { Section } from '@/components/ui/section';
import { cn } from '@/lib/utils';
import type { LucideIcon } from 'lucide-react';

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

interface InsuranceFeatureProps {
  title: string;
  description: string;
  icon: LucideIcon;
  colorClass: string;
  bgClass: string;
}

function InsuranceFeature({
  title,
  description,
  icon: Icon,
  colorClass,
  bgClass,
}: InsuranceFeatureProps) {
  return (
    <motion.div
      variants={itemVariants}
      className="group relative rounded-2xl border border-border bg-card p-7 transition-all duration-300 hover:shadow-card-hover hover:-translate-y-1 hover:border-primary/20"
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

      <h3 className="text-lg font-bold text-text mb-2">{title}</h3>
      <p className="text-sm text-text-muted leading-relaxed">{description}</p>
    </motion.div>
  );
}

const features: InsuranceFeatureProps[] = [
  {
    title: 'صدور آنلاین',
    description: 'صدور فوری و آنلاین بیمه‌نامه بدون نیاز به مراجعه حضوری، فقط در چند دقیقه',
    icon: FastForward,
    colorClass: 'text-primary',
    bgClass: 'bg-primary/10',
  },
  {
    title: 'پرداخت امن',
    description: 'پرداخت ایمن از طریق درگاه‌های بانکی معتبر با تأییدیه رسمی و ضمانت بازگشت وجه',
    icon: CreditCard,
    colorClass: 'text-success',
    bgClass: 'bg-success/10',
  },
  {
    title: 'پشتیبانی ۲۴ ساعته',
    description: 'تیم پشتیبانی متخصص ما در تمام ساعات شبانه‌روز آماده پاسخگویی و کمک به شماست',
    icon: Headphones,
    colorClass: 'text-warning',
    bgClass: 'bg-warning/10',
  },
  {
    title: 'پیگیری آنلاین',
    description: 'امکان پیگیری وضعیت بیمه‌نامه، ثبت خسارت و مدیریت تمام بیمه‌ها از پنل کاربری',
    icon: FileText,
    colorClass: 'text-purple-600',
    bgClass: 'bg-purple-500/10',
  },
];

export function WhyUsSection() {
  return (
    <Section id="why-us" eyebrow="چرا ما؟" title="چرا از بانک بیمه ابان خرید کنم؟">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10"
      >
        {features.map((feature) => (
          <InsuranceFeature key={feature.title} {...feature} />
        ))}
      </motion.div>
    </Section>
  );
}

export default WhyUsSection;
