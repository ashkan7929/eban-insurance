'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { XCircle, RotateCcw, Headphones, Home } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface FailureStateProps {
  description?: string;
  onRetry?: () => void;
  onContactSupport?: () => void;
  supportHref?: string;
  className?: string;
}

export function FailureState({
  description = 'متاسفانه در هنگام پرداخت مشکلی پیش آمد. لطفاً مجدداً تلاش کنید یا با پشتیبانی تماس بگیرید.',
  onRetry,
  onContactSupport,
  supportHref = '/contact',
  className,
}: FailureStateProps) {
  return (
    <Card className={cn('rounded-3xl border-danger/20 bg-white shadow-card', className)}>
      <CardContent className="p-8 text-center space-y-7">
        <motion.div
          initial={{ scale: 0, opacity: 0, rotate: -10 }}
          animate={{ scale: 1, opacity: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
          className="flex justify-center"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-danger/15 rounded-full blur-xl scale-125" />
            <XCircle
              className="relative w-16 h-16 text-danger"
              strokeWidth={1.8}
            />
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 15, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          className="space-y-3"
        >
          <h2 className="text-xl md:text-2xl font-bold text-text">
            پرداخت ناموفق بود
          </h2>
          <p className="text-sm md:text-base text-text-muted leading-relaxed max-w-md mx-auto">
            {description}
          </p>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="flex flex-col sm:flex-row gap-3 justify-center max-w-md mx-auto"
        >
          <Button
            variant="primary"
            size="md"
            onClick={onRetry}
            className="flex-1 sm:flex-none"
          >
            <RotateCcw className="w-4 h-4" strokeWidth={2} />
            تلاش مجدد برای پرداخت
          </Button>
          {onContactSupport ? (
            <Button
              variant="outline"
              size="md"
              onClick={onContactSupport}
              className="flex-1 sm:flex-none"
            >
              <Headphones className="w-4 h-4" strokeWidth={2} />
              تماس با پشتیبانی
            </Button>
          ) : (
            <Link href={supportHref} className="flex-1 sm:flex-none">
              <Button variant="outline" size="md" className="w-full">
                <Headphones className="w-4 h-4" strokeWidth={2} />
                تماس با پشتیبانی
              </Button>
            </Link>
          )}
          <Link href="/" className="flex-1 sm:flex-none">
            <Button variant="ghost" size="md" className="w-full">
              <Home className="w-4 h-4" strokeWidth={2} />
              بازگشت به خانه
            </Button>
          </Link>
        </motion.div>
      </CardContent>
    </Card>
  );
}

export default FailureState;
