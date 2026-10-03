'use client';

import { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Alert } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { usePurchaseStore } from '@/store/purchase-store';
import { useAuthStore } from '@/store/auth-store';
import { OtpModal } from './otp-modal';
import { normalizeMobile, isValidMobile, cn } from '@/lib/utils';
import { User, IdCard, Calendar, Phone, Mail, ArrowLeft, ArrowRight, Send, CheckCircle2 } from 'lucide-react';

const schema = z.object({
  firstName: z.string().min(2, 'نام باید حداقل ۲ کاراکتر باشد').regex(/^[\u0600-\u06FF\s]+$/, 'نام باید به فارسی باشد'),
  lastName: z.string().min(2, 'نام خانوادگی باید حداقل ۲ کاراکتر باشد').regex(/^[\u0600-\u06FF\s]+$/, 'نام خانوادگی باید به فارسی باشد'),
  nationalCode: z.string()
    .length(10, 'کد ملی باید دقیقاً ۱۰ رقم باشد')
    .regex(/^[0-9]{10}$/, 'کد ملی باید عددی و ۱۰ رقم باشد'),
  birthDate: z.string().min(1, 'تاریخ تولد را انتخاب کنید'),
  mobile: z.string()
    .min(1, 'شماره موبایل را وارد کنید')
    .refine((v) => isValidMobile(v), 'شماره موبایل معتبر نیست'),
  email: z.string().optional().refine((v) => {
    if (!v) return true;
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
  }, 'ایمیل معتبر نیست'),
});

type FormValues = z.infer<typeof schema>;

export function Step4CustomerInfo() {
  const store = usePurchaseStore();
  const authStore = useAuthStore();
  const existing = store.quoteData.customer;
  const user = authStore.user;
  const isAuthenticated = authStore.isAuthenticated;

  const [otpOpen, setOtpOpen] = useState(false);
  const [otpMobile, setOtpMobile] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpError, setOtpError] = useState<string | null>(null);
  const [sendingOtp, setSendingOtp] = useState(false);

  const defaultValues: FormValues = existing ? {
    ...existing,
  } : {
    firstName: user?.first_name || '',
    lastName: user?.last_name || '',
    nationalCode: user?.national_code || '',
    birthDate: '',
    mobile: user?.mobile || '',
    email: '',
  };

  const methods = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues,
    mode: 'onChange',
  });

  const {
    handleSubmit,
    watch,
    setValue,
    trigger,
    formState: { errors, isSubmitting },
  } = methods;

  const mobileValue = watch('mobile');
  const normalizedMobile = normalizeMobile(mobileValue);

  useEffect(() => {
    if (normalizedMobile !== mobileValue && mobileValue) {
      setValue('mobile', normalizedMobile, { shouldValidate: true });
    }
  }, [mobileValue, normalizedMobile, setValue]);

  const handleSendOtp = async () => {
    const mobileValid = await trigger('mobile');
    if (!mobileValid) return;

    const targetMobile = normalizeMobile(mobileValue);
    if (!targetMobile) return;

    setSendingOtp(true);
    setOtpError(null);

    const result = await authStore.sendOtp(targetMobile);
    setSendingOtp(false);

    if (result.success) {
      setOtpMobile(targetMobile);
      setOtpSent(true);
      setOtpOpen(true);
    } else {
      setOtpError(result.error || 'ارسال کد ناموفق بود، لطفاً دوباره تلاش کنید.');
    }
  };

  const handleOtpSuccess = () => {
    setOtpOpen(false);
    setOtpSent(false);
  };

  const onSubmit = async (values: FormValues) => {
    store.setCustomerData(values);

    if (!authStore.isAuthenticated) {
      const targetMobile = normalizeMobile(values.mobile);
      if (targetMobile && !otpSent) {
        setSendingOtp(true);
        const result = await authStore.sendOtp(targetMobile);
        setSendingOtp(false);
        if (result.success) {
          setOtpMobile(targetMobile);
          setOtpSent(true);
          setOtpOpen(true);
          return;
        } else {
          setOtpError(result.error || 'ارسال کد ناموفق بود.');
          return;
        }
      }
      if (!authStore.isAuthenticated && !otpSent) {
        return;
      }
    }

    store.nextStep();
  };

  return (
    <Card className="rounded-2xl shadow-card border-border">
      <CardContent className="p-6 sm:p-8">
        <div className="flex items-start gap-4 mb-8">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-accent/10 text-accent">
            <User className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <div className="flex items-start justify-between gap-3 flex-wrap">
              <div>
                <h2 className="text-xl font-bold text-text mb-1">۴. اطلاعات شما</h2>
                <p className="text-sm text-text-muted">
                  اطلاعات شخصی خود را وارد کنید تا بیمه‌نامه به نام شما صادر شود
                </p>
              </div>
              {isAuthenticated && (
                <Badge variant="success" className="gap-1.5 self-start">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  وارد شده‌اید
                </Badge>
              )}
            </div>
          </div>
        </div>

        {!isAuthenticated && (
          <Alert
            variant="info"
            title="تأیید شماره موبایل"
            description="پس از وارد کردن شماره موبایل، کد تأیید را دریافت می‌کنید. برای ادامه فرایند باید موبایل خود را تأیید کنید."
          />
        )}

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5 mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="نام"
                placeholder="مثال: علی"
                leftIcon={<User className="h-4 w-4" />}
                error={!!errors.firstName}
                errorMessage={errors.firstName?.message}
                {...methods.register('firstName')}
              />

              <Input
                label="نام خانوادگی"
                placeholder="مثال: رضایی"
                error={!!errors.lastName}
                errorMessage={errors.lastName?.message}
                {...methods.register('lastName')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <Input
                label="کد ملی"
                placeholder="مثال: ۰۰۱۲۳۴۵۶۷۸"
                type="text"
                leftIcon={<IdCard className="h-4 w-4" />}
                helperText="کد ملی ۱۰ رقمی شما"
                error={!!errors.nationalCode}
                errorMessage={errors.nationalCode?.message}
                {...methods.register('nationalCode')}
              />

              <Input
                label="تاریخ تولد"
                type="date"
                leftIcon={<Calendar className="h-4 w-4" />}
                error={!!errors.birthDate}
                errorMessage={errors.birthDate?.message}
                {...methods.register('birthDate')}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-2">
                <Input
                  label="شماره موبایل"
                  type="tel"
                  placeholder="مثال: ۰۹۱۲۳۴۵۶۷۸۹"
                  leftIcon={<Phone className="h-4 w-4" />}
                  helperText="شماره موبایل برای دریافت کد تأیید و بیمه‌نامه"
                  error={!!errors.mobile}
                  errorMessage={errors.mobile?.message}
                  {...methods.register('mobile')}
                />
                {!isAuthenticated && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleSendOtp}
                    disabled={sendingOtp || !normalizedMobile}
                    className="w-full gap-2"
                  >
                    <Send className="h-3.5 w-3.5" />
                    {sendingOtp ? 'در حال ارسال کد...' : otpSent ? 'ارسال مجدد کد' : 'ارسال کد تأیید به موبایل'}
                  </Button>
                )}
                {otpError && (
                  <div className="text-xs text-danger mt-1">{otpError}</div>
                )}
              </div>

              <Input
                label="ایمیل (اختیاری)"
                type="email"
                placeholder="مثال: example@email.com"
                leftIcon={<Mail className="h-4 w-4" />}
                helperText="برای ارسال نسخه دیجیتال بیمه‌نامه"
                error={!!errors.email}
                errorMessage={errors.email?.message}
                {...methods.register('email')}
              />
            </div>

            <div className="pt-6 flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                size="lg"
                onClick={() => store.prevStep()}
              >
                <ArrowRight className="h-4 w-4" />
                بازگشت
              </Button>

              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="gap-2"
              >
                {isSubmitting ? 'در حال پردازش...' : 'ادامه و بازبینی'}
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </FormProvider>
      </CardContent>

      <OtpModal
        open={otpOpen}
        onOpenChange={setOtpOpen}
        mobile={otpMobile}
        onSuccess={handleOtpSuccess}
      />
    </Card>
  );
}

export default Step4CustomerInfo;
