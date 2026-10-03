'use client';

import { motion } from 'framer-motion';
import { Section } from '@/components/ui/section';
import { cn } from '@/lib/utils';

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.1,
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

interface StepCardProps {
  number: string;
  title: string;
  description: string;
  last?: boolean;
}

function StepCard({ number, title, description, last }: StepCardProps) {
  return (
    <motion.div
      variants={itemVariants}
      className="relative"
    >
      {!last && (
        <div className="hidden md:block absolute top-1/2 -translate-y-1/2 right-full w-full h-0.5 bg-border z-0" />
      )}

      <div className="relative z-10 rounded-2xl border border-border bg-card p-6 md:p-7 h-full transition-all duration-300 hover:shadow-card-hover hover:border-primary/20">
        <div className="mb-5">
          <span className="text-5xl md:text-6xl font-black text-primary/15 leading-none select-none">
            {number}
          </span>
        </div>

        <h3 className="text-lg font-bold text-text mb-2">{title}</h3>
        <p className="text-sm text-text-muted leading-relaxed">{description}</p>
      </div>
    </motion.div>
  );
}

const steps: { number: string; title: string; description: string }[] = [
  {
    number: '۰۱',
    title: 'انتخاب بیمه',
    description: 'نوع بیمه موردنظرتون رو از بین محصولات مختلف انتخاب و مشخصات رو وارد کنید',
  },
  {
    number: '۰۲',
    title: 'دریافت قیمت فوری',
    description: 'قیمت بیمه از تمام شرکت‌های معتبر محاسبه می‌شه و بهترین گزینه‌ها به شما نمایش داده می‌شه',
  },
  {
    number: '۰۳',
    title: 'پرداخت امن',
    description: 'پرداخت رو از طریق درگاه‌های امن بانکی انجام بدید و اطمینان حاصل کنید',
  },
  {
    number: '۰۴',
    title: 'دریافت بیمه‌نامه',
    description: 'بیمه‌نامه الکترونیکی شما بلافاصله صادر و در پنل کاربری و ایمیلتون ارسال می‌شه',
  },
];

export function HowItWorksSection() {
  return (
    <Section id="how" eyebrow="نحوه کار" title="خرید بیمه فقط در ۴ گام">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        className="grid md:grid-cols-4 gap-6 mt-10 relative"
      >
        {steps.map((step, i) => (
          <StepCard
            key={step.number}
            {...step}
            last={i === steps.length - 1}
          />
        ))}
      </motion.div>
    </Section>
  );
}

export default HowItWorksSection;
