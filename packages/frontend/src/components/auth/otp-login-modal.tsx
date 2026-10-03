'use client';

import * as React from 'react';
import { useRouter } from 'next/navigation';
import Modal from '@/components/ui/modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { OtpInput } from '@/components/ui/otp-input';
import { Alert } from '@/components/ui/alert';
import { Spinner } from '@/components/ui/spinner';
import { useAuthStore } from '@/store/auth-store';
import { usePurchaseStore } from '@/store/purchase-store';
import { Phone, ArrowLeft, LogIn } from 'lucide-react';

const OTP_COUNTDOWN = 120;

export interface OtpLoginModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  redirectTo?: string;
  onSuccess?: () => void;
}

export function OtpLoginModal({
  open,
  onOpenChange,
  redirectTo,
  onSuccess,
}: OtpLoginModalProps) {
  const router = useRouter();
  const sendOtp = useAuthStore((s) => s.sendOtp);
  const verifyOtp = useAuthStore((s) => s.verifyOtp);
  const isLoading = useAuthStore((s) => s.isLoading);
  const orderId = usePurchaseStore((s) => s.orderId);
  const currentStep = usePurchaseStore((s) => s.currentStep);

  const [phase, setPhase] = React.useState<'mobile' | 'otp'>('mobile');
  const [mobile, setMobile] = React.useState('');
  const [otpCode, setOtpCode] = React.useState('');
  const [mobileError, setMobileError] = React.useState('');
  const [otpError, setOtpError] = React.useState('');
  const [generalError, setGeneralError] = React.useState('');
  const [countdown, setCountdown] = React.useState(0);

  React.useEffect(() => {
    if (!open) {
      setPhase('mobile');
      setMobile('');
      setOtpCode('');
      setMobileError('');
      setOtpError('');
      setGeneralError('');
      setCountdown(0);
    }
  }, [open]);

  React.useEffect(() => {
    if (countdown > 0 && open) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown, open]);

  const validateMobile = (value: string) => {
    const cleaned = value.replace(/\D/g, '');
    if (!cleaned) return 'شماره موبایل الزامی است';
    if (!/^09\d{9}$/.test(cleaned)) return 'شماره موبایل معتبر نیست';
    return '';
  };

  const formatMobile = (raw: string) => {
    let cleaned = raw.replace(/\D/g, '');
    if (cleaned.startsWith('98')) cleaned = '0' + cleaned.slice(2);
    if (cleaned.startsWith('9') && cleaned.length === 10) cleaned = '0' + cleaned;
    return cleaned.slice(0, 11);
  };

  const handleSendOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');
    const formatted = formatMobile(mobile);
    setMobile(formatted);
    const error = validateMobile(formatted);
    if (error) {
      setMobileError(error);
      return;
    }
    setMobileError('');

    const result = await sendOtp(formatted);
    if (result.success) {
      setCountdown(result.expiresIn || OTP_COUNTDOWN);
      setPhase('otp');
    } else {
      setGeneralError(result.error || 'ارسال کد تایید ناموفق بود');
    }
  };

  const handleResendOtp = async () => {
    if (countdown > 0) return;
    setOtpError('');
    setGeneralError('');
    const result = await sendOtp(mobile);
    if (result.success) {
      setCountdown(result.expiresIn || OTP_COUNTDOWN);
      setOtpCode('');
    } else {
      setGeneralError(result.error || 'ارسال مجدد کد ناموفق بود');
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setGeneralError('');
    if (otpCode.length !== 6) {
      setOtpError('کد تایید باید ۶ رقمی باشد');
      return;
    }
    setOtpError('');

    const result = await verifyOtp(mobile, otpCode);
    if (result.success) {
      onOpenChange(false);
      onSuccess?.();

      if (redirectTo) {
        router.push(redirectTo);
      } else if (orderId) {
        router.push(`/checkout/${orderId}`);
      } else if (currentStep > 0) {
        router.push(`/insurance/${usePurchaseStore.getState().quoteData.productSlug || ''}`);
      }
    } else {
      setOtpError(result.error || 'کد تایید نامعتبر یا منقضی شده است');
    }
  };

  const handleBackToMobile = () => {
    setPhase('mobile');
    setOtpCode('');
    setOtpError('');
    setGeneralError('');
    setCountdown(0);
  };

  const formatCountdown = (secs: number) => {
    const m = Math.floor(secs / 60).toString().padStart(2, '0');
    const s = (secs % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="ورود / ثبت‌نام"
      description={
        phase === 'mobile'
          ? 'برای ادامه، شماره موبایل خود را وارد کنید'
          : `کد تایید به شماره ${mobile} ارسال شد`
      }
      showCloseButton
    >
      <div className="space-y-5 pt-2">
        {generalError && (
          <Alert variant="danger" title="خطا" description={generalError} />
        )}

        {phase === 'mobile' ? (
          <form onSubmit={handleSendOtp} className="space-y-5">
            <Input
              label="شماره موبایل"
              type="tel"
              placeholder="مثلاً ۰۹۱۲۳۴۵۶۷۸۹"
              value={mobile}
              onChange={(e) => {
                setMobile(formatMobile(e.target.value));
                if (mobileError) setMobileError('');
              }}
              error={!!mobileError}
              errorMessage={mobileError}
              leftIcon={<Phone className="h-4 w-4" />}
              disabled={isLoading}
              inputMode="numeric"
              maxLength={11}
            />
            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" />
                  در حال ارسال...
                </>
              ) : (
                <>
                  <LogIn className="h-4 w-4" strokeWidth={2} />
                  ارسال کد تایید
                </>
              )}
            </Button>
            <p className="text-center text-xs text-text-muted leading-relaxed">
              با ورود و یا ثبت نام،{' '}
              <a href="#" className="text-primary hover:underline">
                قوانین و مقررات
              </a>{' '}
              پلتفرم را می‌پذیرید.
            </p>
          </form>
        ) : (
          <form onSubmit={handleVerifyOtp} className="space-y-5">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleBackToMobile}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-text-muted hover:bg-bg transition-colors"
                aria-label="بازگشت"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <span className="text-sm text-text-muted">تغییر شماره موبایل</span>
            </div>

            <div className="space-y-2">
              <OtpInput
                value={otpCode}
                onChange={(val) => {
                  setOtpCode(val);
                  if (otpError) setOtpError('');
                }}
                length={6}
                disabled={isLoading}
              />
              {otpError && (
                <p className="text-center text-xs text-danger mt-1">{otpError}</p>
              )}
            </div>

            <div className="flex items-center justify-center gap-2">
              {countdown > 0 ? (
                <span className="text-sm text-text-muted">
                  ارسال مجدد کد:{' '}
                  <span className="font-medium text-text">{formatCountdown(countdown)}</span>
                </span>
              ) : (
                <button
                  type="button"
                  onClick={handleResendOtp}
                  className="text-sm text-primary hover:underline font-medium"
                  disabled={isLoading}
                >
                  ارسال مجدد کد تایید
                </button>
              )}
            </div>

            <Button
              type="submit"
              variant="primary"
              size="lg"
              className="w-full"
              disabled={isLoading || otpCode.length !== 6}
            >
              {isLoading ? (
                <>
                  <Spinner size="sm" />
                  در حال تایید...
                </>
              ) : (
                'تایید و ادامه'
              )}
            </Button>
          </form>
        )}
      </div>
    </Modal>
  );
}

export default OtpLoginModal;
