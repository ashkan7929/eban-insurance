'use client';

import { useState, useEffect } from 'react';
import {
  User,
  Edit3,
  Save,
  Phone,
  ShieldCheck,
  CreditCard,
  AlertCircle,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert } from '@/components/ui/alert';
import { useAuthStore, type User as UserType } from '@/store/auth-store';
import { cn, formatMobile, formatDate, formatIRR } from '@/lib/utils';

interface ProfileForm {
  first_name: string;
  last_name: string;
  national_code: string;
  birth_date: string;
}

export default function ProfilePage() {
  const { user, loadFromStorage } = useAuthStore();
  const [form, setForm] = useState<ProfileForm>({
    first_name: '',
    last_name: '',
    national_code: '',
    birth_date: '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    loadFromStorage();
    if (user) {
      setForm({
        first_name: user.first_name || '',
        last_name: user.last_name || '',
        national_code: user.national_code || '',
        birth_date: '',
      });
    }
  }, [user, loadFromStorage]);

  const updateField = (key: keyof ProfileForm, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      await new Promise((r) => setTimeout(r, 700));
      setSaved(true);
      setIsEditing(false);
      setTimeout(() => setSaved(false), 2500);
    } finally {
      setIsSaving(false);
    }
  };

  const fullName =
    user?.first_name && user?.last_name
      ? `${user.first_name} ${user.last_name}`
      : user?.first_name || user?.last_name || 'کاربر گرامی';

  const initials = fullName
    .split(' ')
    .map((p) => p.charAt(0))
    .slice(0, 2)
    .join('');

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-text">پروفایل کاربر</h1>
          <p className="text-sm text-text-muted mt-1">
            اطلاعات شخصی خود را مشاهده و ویرایش کنید
          </p>
        </div>
      </div>

      <Card className="rounded-2xl overflow-hidden">
        <div className="h-28 md:h-32 bg-gradient-to-l from-primary/80 via-primary to-secondary/80" />
        <CardContent className="-mt-12 md:-mt-14 relative pb-6">
          <div className="flex flex-col md:flex-row md:items-end gap-4 md:gap-6">
            <div className="shrink-0">
              <div className="w-24 h-24 md:w-28 md:h-28 rounded-2xl bg-white border-4 border-white shadow-card flex items-center justify-center">
                <span className="text-3xl md:text-4xl font-bold text-primary">
                  {initials || 'U'}
                </span>
              </div>
            </div>

            <div className="flex-1 min-w-0 pb-2">
              <div className="flex flex-wrap items-center gap-2 mb-1">
                <h2 className="text-xl md:text-2xl font-bold text-text truncate">
                  {fullName}
                </h2>
                {user?.role === 'ADMIN' && (
                  <Badge variant="default" size="sm">
                    <ShieldCheck className="w-3 h-3 ml-1" strokeWidth={2.5} />
                    مدیر
                  </Badge>
                )}
                {user?.role === 'USER' && (
                  <Badge variant="success" size="sm">
                    <User className="w-3 h-3 ml-1" strokeWidth={2.5} />
                    کاربر احراز هویت شده
                  </Badge>
                )}
              </div>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-text-muted">
                <span className="flex items-center gap-1.5" dir="ltr">
                  <Phone className="w-3.5 h-3.5 text-text-muted" strokeWidth={2} />
                  {user?.mobile ? formatMobile(user.mobile) : '-'}
                </span>
                {user?.national_code && (
                  <span dir="ltr">
                    کد ملی: {user.national_code}
                  </span>
                )}
                <span>
                  عضو از: {formatDate('2025-01-15')}
                </span>
              </div>
            </div>

            <div className="shrink-0">
              <Button
                variant="outline"
                size="md"
                onClick={() => setIsEditing((v) => !v)}
                disabled={isSaving}
              >
                {isEditing ? (
                  <>انصراف</>
                ) : (
                  <>
                    <Edit3 className="w-4 h-4" strokeWidth={2} />
                    ویرایش پروفایل
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <User className="w-5 h-5 text-primary" strokeWidth={2} />
                اطلاعات شخصی
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              {saved && (
                <Alert variant="success" className="mb-5 text-sm">
                  تغییرات با موفقیت ذخیره شد.
                </Alert>
              )}

              <form onSubmit={handleSave} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="نام"
                    value={form.first_name}
                    onChange={(e) => updateField('first_name', e.target.value)}
                    disabled={!isEditing}
                    placeholder="نام خود را وارد کنید"
                  />
                  <Input
                    label="نام خانوادگی"
                    value={form.last_name}
                    onChange={(e) => updateField('last_name', e.target.value)}
                    disabled={!isEditing}
                    placeholder="نام خانوادگی خود را وارد کنید"
                  />
                  <Input
                    label="کد ملی"
                    value={form.national_code}
                    onChange={(e) => updateField('national_code', e.target.value)}
                    disabled={!isEditing}
                    dir="ltr"
                    placeholder="مثال: 0012345678"
                    inputMode="numeric"
                  />
                  <Input
                    label="تاریخ تولد"
                    type="date"
                    value={form.birth_date}
                    onChange={(e) => updateField('birth_date', e.target.value)}
                    disabled={!isEditing}
                    dir="ltr"
                    placeholder="1375/01/01"
                  />
                </div>

                <div>
                  <div className="mb-1.5 text-sm font-medium text-text">
                    شماره موبایل
                  </div>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <div
                      className={cn(
                        'flex-1 flex items-center gap-3 h-11 px-4 rounded-xl border bg-bg',
                        'border-border'
                      )}
                    >
                      <Phone className="w-4 h-4 text-text-muted shrink-0" strokeWidth={2} />
                      <span className="text-sm text-text font-medium" dir="ltr">
                        {user?.mobile ? formatMobile(user.mobile) : '-'}
                      </span>
                      <Badge variant="outline" size="sm" className="mr-auto text-[10px]">
                        غیر قابل ویرایش
                      </Badge>
                    </div>
                    <Button type="button" variant="outline" size="md">
                      تغییر شماره موبایل
                    </Button>
                  </div>
                  <p className="mt-1.5 text-xs text-text-muted">
                    برای تغییر شماره موبایل، فرآیند تأیید هویت مجدد انجام می‌شود.
                  </p>
                </div>

                {isEditing && (
                  <div className="pt-2 flex flex-col sm:flex-row sm:justify-end gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="lg"
                      onClick={() => setIsEditing(false)}
                      disabled={isSaving}
                    >
                      انصراف
                    </Button>
                    <Button type="submit" size="lg" disabled={isSaving}>
                      {isSaving ? (
                        <>
                          <div className="w-4 h-4 rounded-full border-2 border-white border-t-transparent animate-spin" />
                          در حال ذخیره...
                        </>
                      ) : (
                        <>
                          <Save className="w-4 h-4" strokeWidth={2} />
                          ذخیره تغییرات
                        </>
                      )}
                    </Button>
                  </div>
                )}
              </form>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <AlertCircle className="w-5 h-5 text-warning" strokeWidth={2} />
                احراز هویت کامل
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="p-4 rounded-xl border border-warning/20 bg-warning/5 mb-4">
                <p className="text-sm text-text">
                  برای استفاده کامل از تمامی خدمات و دریافت بیمه‌نامه به صورت آنلاین،
                  لطفا احراز هویت خود را تکمیل کنید.
                </p>
              </div>
              <div className="space-y-3">
                {[
                  { label: 'اطلاعات شخصی', done: !!(form.first_name && form.last_name && form.national_code) },
                  { label: 'تصویر کارت ملی', done: true },
                  { label: 'تصویر شناسنامه', done: false },
                  { label: 'تأیید احراز هویت', done: false },
                ].map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl border border-border bg-bg"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          'w-8 h-8 rounded-lg flex items-center justify-center',
                          item.done
                            ? 'bg-success/10 text-success'
                            : 'bg-warning/10 text-warning'
                        )}
                      >
                        {item.done ? (
                          <ShieldCheck className="w-4 h-4" strokeWidth={2.5} />
                        ) : (
                          <AlertCircle className="w-4 h-4" strokeWidth={2.5} />
                        )}
                      </div>
                      <span
                        className={cn(
                          'text-sm font-medium',
                          item.done ? 'text-text' : 'text-text-muted'
                        )}
                      >
                        {item.label}
                      </span>
                    </div>
                    <Badge
                      variant={item.done ? 'success' : 'warning'}
                      size="sm"
                    >
                      {item.done ? 'انجام شده' : 'در انتظار'}
                    </Badge>
                  </div>
                ))}
              </div>
              <div className="mt-5">
                <Button variant="outline" size="md" className="w-full">
                  تکمیل احراز هویت
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" strokeWidth={2} />
                خلاصه فعالیت
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-3">
              {[
                { label: 'تعداد سفارش‌ها', value: '۸ عدد' },
                { label: 'بیمه‌نامه‌های فعال', value: '۴ عدد' },
                { label: 'مبلغ کل پرداختی', value: formatIRR(12500000) },
                { label: 'سطح تخفیف', value: 'طلایی - ۱۰٪' },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between py-2.5 border-b border-border last:border-b-0"
                >
                  <span className="text-sm text-text-muted">{item.label}</span>
                  <span className="text-sm font-bold text-text">{item.value}</span>
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" strokeWidth={2} />
                امنیت حساب
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <div className="p-3 rounded-xl border border-border bg-bg">
                <p className="text-xs text-text-muted mb-1">رمز عبور</p>
                <div className="flex items-center justify-between mt-1">
                  <Badge variant="success" size="sm">تنظیم شده</Badge>
                  <button className="text-xs text-primary font-medium hover:underline">
                    تغییر
                  </button>
                </div>
              </div>
              <div className="p-3 rounded-xl border border-border bg-bg">
                <p className="text-xs text-text-muted mb-1">احراز هویت دو مرحله‌ای</p>
                <div className="flex items-center justify-between mt-1">
                  <Badge variant="warning" size="sm">غیرفعال</Badge>
                  <button className="text-xs text-primary font-medium hover:underline">
                    فعال‌سازی
                  </button>
                </div>
              </div>
              <div className="p-3 rounded-xl border border-border bg-bg">
                <p className="text-xs text-text-muted mb-1">جلسات فعال</p>
                <div className="flex items-center justify-between mt-1">
                  <Badge variant="default" size="sm">۱ جلسه فعال</Badge>
                  <button className="text-xs text-danger font-medium hover:underline">
                    خروج از همه
                  </button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
