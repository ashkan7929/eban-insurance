'use client';

import { motion } from 'framer-motion';
import { ShieldCheck, Shield, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function CTASection() {
  return (
    <section className="py-12 md:py-16">
      <div className="container-page">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-l from-primary to-secondary p-10 md:p-14 text-white max-w-7xl mx-auto"
        >
          <ShieldCheck
            className="absolute -left-8 -top-8 opacity-20 rotate-12 size-40 pointer-events-none select-none"
            strokeWidth={1.5}
          />
          <Shield
            className="absolute -right-8 -bottom-8 opacity-20 -rotate-12 size-40 pointer-events-none select-none"
            strokeWidth={1.5}
          />

          <div className="relative z-10 max-w-3xl">
            <motion.h2
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.1 }}
              className="text-3xl md:text-4xl font-black leading-tight"
            >
              آماده‌ای بیمه‌ات رو خیلی سریع و بدون دردسر ببری؟
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.2 }}
              className="mt-4 text-base md:text-lg text-white/85 leading-relaxed max-w-2xl"
            >
              در کمتر از ۵ دقیقه، بیمه موردنیازت رو با بهترین قیمت پیدا و خریداری کن
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, ease: 'easeOut', delay: 0.3 }}
              className="mt-10 flex flex-wrap gap-4"
            >
              <Button
                size="lg"
                className={cn(
                  '!bg-white !text-primary hover:!bg-white/90 shadow-lg shadow-primary/20'
                )}
              >
                شروع خرید بیمه الان
              </Button>
              <Button
                variant="ghost"
                size="lg"
                className="!text-white border border-white !bg-transparent hover:!bg-white/10 gap-1.5"
              >
                سؤال داری؟ با کارشناسانم صحبت کن
                <MessageCircle className="h-4 w-4" strokeWidth={2} />
              </Button>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default CTASection;
