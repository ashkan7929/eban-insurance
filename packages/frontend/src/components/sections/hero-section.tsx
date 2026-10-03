'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Car, CheckCircle2 } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Container } from '@/components/ui/container';
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

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: 0.3 + i * 0.15,
      duration: 0.5,
      ease: 'easeOut',
    },
  }),
};

export function HeroSection() {
  return (
    <section className="relative overflow-hidden pt-8 md:pt-12">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/3 rounded-full bg-gradient-to-br from-primary/20 via-secondary/10 to-transparent blur-3xl w-[600px] h-[600px] md:w-[900px] md:h-[900px]" />
      </div>

      <Container className="py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-10 items-center">
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
            className="order-2 md:order-1"
          >
            <motion.div variants={itemVariants}>
              <Badge variant="default" className="mb-6">
                پشتیبانی ۲۴ ساعته
              </Badge>
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="font-black text-4xl md:text-5xl lg:text-6xl leading-tight text-text"
            >
              بیمه‌ات رو آنلاین، ساده و سریع بخر
            </motion.h1>

            <motion.p
              variants={itemVariants}
              className="mt-5 text-lg text-text-muted leading-relaxed"
            >
              مقایسه، محاسبه و خرید بیمه بدون مراجعه حضوری، فقط در چند دقیقه
            </motion.p>

            <motion.div variants={itemVariants} className="flex gap-4 mt-8 flex-wrap">
              <Button variant="primary" size="lg">
                محاسبه بیمه من
              </Button>
              <Button variant="secondary" size="lg">
                راهنمای انتخاب بیمه
              </Button>
            </motion.div>

            <motion.div
              variants={itemVariants}
              className="flex flex-wrap items-center gap-6 mt-10 pt-8 border-t border-border"
            >
              <div className="flex flex-col items-center text-center">
                <span className="text-2xl md:text-3xl font-black text-primary">
                  ۲۰۰ک+
                </span>
                <span className="text-sm text-text-muted mt-1">مشتری راضی</span>
              </div>
              <div className="w-px h-10 bg-border hidden sm:block" />
              <div className="flex flex-col items-center text-center">
                <span className="text-2xl md:text-3xl font-black text-secondary">
                  +۲۰
                </span>
                <span className="text-sm text-text-muted mt-1">شرکت بیمه</span>
              </div>
              <div className="w-px h-10 bg-border hidden sm:block" />
              <div className="flex flex-col items-center text-center">
                <span className="text-2xl md:text-3xl font-black text-accent">
                  ۲ دقیقه
                </span>
                <span className="text-sm text-text-muted mt-1">صدور آنلاین</span>
              </div>
            </motion.div>
          </motion.div>

          <motion.div
            className="order-1 md:order-2 relative min-h-[400px] md:min-h-[450px]"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true }}
          >
            <div className="absolute inset-0 -z-10">
              <div className="absolute inset-0 rounded-[2.5rem] bg-gradient-to-br from-primary/20 via-emerald-400/10 to-secondary/20 blur-2xl scale-95" />
            </div>

            <div className="relative w-full h-full min-h-[400px] md:min-h-[450px] flex items-center justify-center">
              <motion.div
                custom={0}
                variants={cardVariants}
                initial="hidden"
                animate="show"
                className="absolute w-60 md:w-72 h-44 md:h-52 rounded-2xl bg-white border border-border shadow-card-lg p-5 rotate-[-8deg] translate-x-10 md:translate-x-16 translate-y-6 md:translate-y-8"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Car className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-text">بیمه خودرو</div>
                    <div className="text-xs text-text-muted">شخص ثالث + بدنه</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-full rounded-full bg-primary/10" />
                  <div className="h-2 w-3/4 rounded-full bg-primary/5" />
                  <div className="mt-4 text-lg font-black text-primary">
                    از ۱,۲۵۰,۰۰۰ تومان
                  </div>
                </div>
              </motion.div>

              <motion.div
                custom={1}
                variants={cardVariants}
                initial="hidden"
                animate="show"
                className="absolute w-60 md:w-72 h-44 md:h-52 rounded-2xl bg-white border border-border shadow-card-lg p-5 z-10"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-secondary/10 text-secondary">
                    <ShieldCheck className="h-8 w-8" strokeWidth={2.25} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-text">تأیید شده</div>
                    <div className="text-xs text-text-muted">همه شرکت‌های بیمه</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-full rounded-full bg-secondary/10" />
                  <div className="h-2 w-5/6 rounded-full bg-secondary/5" />
                  <div className="h-2 w-2/3 rounded-full bg-secondary/5" />
                  <div className="mt-4 flex items-center gap-2 text-secondary font-bold">
                    <CheckCircle2 className="h-5 w-5" />
                    ضمانت معتبرترین بیمه‌ها
                  </div>
                </div>
              </motion.div>

              <motion.div
                custom={2}
                variants={cardVariants}
                initial="hidden"
                animate="show"
                className="absolute w-60 md:w-72 h-44 md:h-52 rounded-2xl bg-white border border-border shadow-card-lg p-5 rotate-[8deg] -translate-x-10 md:-translate-x-16 translate-y-6 md:translate-y-8"
              >
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-accent/10 text-accent">
                    <CheckCircle2 className="h-6 w-6" />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-text">خرید موفق</div>
                    <div className="text-xs text-text-muted">صدور آنلاین فوری</div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-full rounded-full bg-accent/10" />
                  <div className="h-2 w-4/5 rounded-full bg-accent/5" />
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-xs text-text-muted">زمان صدور:</span>
                    <span className="text-lg font-black text-accent">۰۲:۱۵</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </Container>
    </section>
  );
}

export default HeroSection;
