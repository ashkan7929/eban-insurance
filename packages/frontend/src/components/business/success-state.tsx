'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Download,
  Send,
  FileText,
  Home,
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface SuccessStateProps {
  orderNumber?: string;
  description?: string;
  onDownload?: () => void;
  onSendMobile?: () => void;
  onTrackOrder?: () => void;
  orderId?: string | number;
  className?: string;
}

export function SuccessState({
  orderNumber,
  description = 'بیمه‌نامه شما به زودی به شماره موبایل و ایمیل شما ارسال خواهد شد.',
  onDownload,
  onSendMobile,
  onTrackOrder,
  orderId,
  className,
}: SuccessStateProps) {
  const trackHref = orderId !== undefined ? `/dashboard/orders/${orderId}` : '/dashboard/orders';

  return (
    <Card className={cn('rounded-3xl border-success/20 bg-white shadow-card', className)}>
      <CardContent className="p-8 text-center space-y-7">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
          className="flex justify-center"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-success/15 rounded-full blur-xl scale-125" />
            <CheckCircle2
              className="relative w-16 h-16 text-success"
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
            🎉 بیمه شما با موفقیت ثبت شد
          </h2>
          <p className="text-sm md:text-base text-text-muted leading-relaxed max-w-md mx-auto">
            {description}
          </p>
          {orderNumber ? (
            <div className="inline-flex items-center gap-2 rounded-xl border border-border bg-bg px-4 py-2.5">
              <span className="text-sm text-text-muted">شماره سفارش:</span>
              <span className="font-bold text-primary text-base">
                {orderNumber}
              </span>
            </div>
          ) : null}
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.4, delay: 0.35 }}
          className="grid grid-cols-2 md:grid-cols-4 gap-3 max-w-2xl mx-auto"
        >
          <Button
            variant="outline"
            size="md"
            onClick={onDownload}
            className="w-full"
          >
            <Download className="w-4 h-4" strokeWidth={2} />
            دانلود بیمه‌نامه
          </Button>
          <Button
            variant="outline"
            size="md"
            onClick={onSendMobile}
            className="w-full"
          >
            <Send className="w-4 h-4" strokeWidth={2} />
            ارسال به موبایل
          </Button>
          <Link href={trackHref} className="w-full">
            <Button variant="outline" size="md" className="w-full">
              <FileText className="w-4 h-4" strokeWidth={2} />
              پیگیری سفارش
            </Button>
          </Link>
          <Link href="/" className="w-full col-span-2 md:col-span-1">
            <Button variant="secondary" size="md" className="w-full">
              <Home className="w-4 h-4" strokeWidth={2} />
              بازگشت به خانه
            </Button>
          </Link>
        </motion.div>
      </CardContent>
    </Card>
  );
}

export default SuccessState;
