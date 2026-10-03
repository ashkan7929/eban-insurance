'use client';

import * as React from 'react';
import { Modal } from '@/components/ui/modal';
import { OtpInput } from '@/components/ui/otp-input';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { useAuthStore } from '@/store/auth-store';
import { formatMobile } from '@/lib/utils';
import { Phone, ShieldCheck, Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface OtpModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mobile: string;
  onSuccess?: () => void;
  expiresInSeconds?: number;
}

export function OtpModal({
  open,
  onOpenChange,
  mobile,
  onSuccess,
  expiresInSeconds = 120,
}: OtpModalProps) {
  const [code, setCode] = React.useState('');
  const [error, setError] = React.useState<string | null>(null);
  const [verifying, setVerifying] = React.useState(false);
  const [resending, setResending] = React.useState(false);
  const [countdown, setCountdown] = React.useState(expiresInSeconds);
  const [countdownStartedAt, setCountdownStartedAt] = React.useState<number | null>(null);

  const authStore = useAuthStore();

  const formattedMobile = formatMobile(mobile);
  const canResend = countdown <= 0;

  React.useEffect(() => {
    if (!open) {
      setCode('');
      setError(null);
      setVerifying(false);
      setResending(false);
      return;
    }
    setCountdown(expiresInSeconds);
    setCountdownStartedAt(Date.now());
  }, [open, expiresInSeconds]);

  React.useEffect(() => {
    if (!open || countdownStartedAt === null) return;

    const interval = setInterval(() => {
      const elapsed = Math.floor((Date.now() - countdownStartedAt) / 1000);
      const remaining = Math.max(0, expiresInSeconds - elapsed);
      setCountdown(remaining);
    }, 1000);

    return () => clearInterval(interval);
  }, [open, countdownStartedAt, expiresInSeconds]);

  const handleVerify = async () => {
    if (code.length !== 6) return;
    setError(null);
    setVerifying(true);

    const result = await authStore.verifyOtp(mobile, code);
    setVerifying(false);

    if (result.success) {
      onSuccess?.();
    } else {
      setError(result.error || 'کد وارد شده اشتباه یا منقضی شده است.');
    }
  };

  const handleResend = async () => {
    setResending(true);
    setError(null);
    setCode('');

    const result = await authStore.sendOtp(mobile);
    setResending(false);

    if (result.success) {
      setCountdown(result.expiresIn ?? expiresInSeconds);
      setCountdownStartedAt(Date.now());
    } else {
      setError(result.error || 'ارسال کد ناموفق بود.');
    }
  };

  const formatCountdown = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <Modal
      open={open}
      onOpenChange={onOpenChange}
      title="تأیید شماره موبایل"
      description={`کد تأیید ارسال شده به شماره ${formattedMobile} را وارد کنید`}
      showCloseButton
      className="sm:max-w-md"
      footer={
        <div className="flex items-center justify-between w-full gap-3 pt-2">
          <Button
            type="button"
            variant="outline"
            size="md"
            onClick={handleResend}
            disabled={!canResend || resending}
            className="gap-2"
          >
            <Send className="h-4 w-4" />
            {resending ? 'در حال ارسال...' : canResend ? 'ارسال مجدد' : `ارسال مجدد (${formatCountdown(countdown)})`}
          </Button>

          <Button
            type="button"
            size="md"
            onClick={handleVerify}
            disabled={code.length !== 6 || verifying}
            className="gap-2"
          >
            {verifying ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                تأیید...
              </>
            ) : (
              <>
                <ShieldCheck className="h-4 w-4" />
                تأیید و ادامه
              </>
            )}
          </Button>
        </div>
      }
    >
      <div className="space-y-5 py-2">
        <div className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/10">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Phone className="h-5 w-5" />
          </div>
          <div className="min-w-0">
            <div className="text-xs text-text-muted">کد به شماره زیر ارسال شد</div>
            <div className="text-base font-bold text-text tabular-nums">{formattedMobile}</div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-text text-center">
            کد تأیید ۶ رقمی را وارد کنید
          </label>
          <OtpInput
            length={6}
            value={code}
            onChange={setCode}
            disabled={verifying}
            className="py-2"
          />
          <div className="text-center text-xs text-text-muted pt-1">
            {countdown > 0 ? (
              <span>کد تا {formatCountdown(countdown)} دیگر معتبر است</span>
            ) : (
              <span className="text-danger">زمان کد به پایان رسید، ارسال مجدد کنید</span>
            )}
          </div>
        </div>

        {error && (
          <Alert variant="danger" description={error} />
        )}

        <div className="text-xs text-text-muted text-center pt-2">
          با تأیید شماره موبایل، با <span className="text-primary font-medium">قوانین و مقررات</span> ابان بیمه موافقت می‌کنید.
        </div>
      </div>
    </Modal>
  );
}

export default OtpModal;
