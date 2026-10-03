'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import { PageHeader } from '@/components/layout/page-header';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { siteConfig } from '@/config/site';
import {
  Phone,
  Printer,
  Mail,
  MapPin,
  Clock,
  Send,
  MessageCircle,
  Headphones,
  Building2,
  Instagram,
  Send as Telegram,
} from 'lucide-react';


const contactInfoItems = [
  {
    icon: Phone,
    title: 'تلفن تماس',
    values: [siteConfig.phoneFormatted, siteConfig.supportPhoneFormatted],
    sub: 'پاسخگویی ۲۴ ساعته',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: Printer,
    title: 'فکس',
    values: ['۰۲۱-۸۸۸۸۸۸۸۸'],
    sub: 'خط دفتر مرکزی',
    color: 'text-secondary',
    bg: 'bg-secondary/10',
  },
  {
    icon: Mail,
    title: 'ایمیل',
    values: [siteConfig.email, 'support@eban-insurance.ir'],
    sub: 'پاسخگویی تا ۲۴ ساعت',
    color: 'text-success',
    bg: 'bg-success/10',
  },
  {
    icon: MapPin,
    title: 'آدرس',
    values: [siteConfig.address],
    sub: 'دفتر مرکزی',
    color: 'text-warning',
    bg: 'bg-warning/10',
  },
  {
    icon: Clock,
    title: 'ساعات کاری',
    values: ['شنبه تا چهارشنبه: ۹ الی ۱۸', 'پنجشنبه: ۹ الی ۱۳'],
    sub: 'پزشکی و تعطیلات: تعطیل',
    color: 'text-accent',
    bg: 'bg-accent/10',
  },
  {
    icon: Headphones,
    title: 'پشتیبانی آنلاین',
    values: ['چت آنلاین داخل وب‌سایت'],
    sub: 'مستمر - ۷ روز هفته',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
];

const socialLinks = [
  {
    name: 'اینستاگرام',
    href: siteConfig.socialLinks.find((s) => s.name === 'اینستاگرام')?.href || '#',
    icon: Instagram,
    bg: 'bg-[#E1306C]/10',
    color: 'text-[#E1306C]',
  },
  {
    name: 'تلگرام',
    href: siteConfig.socialLinks.find((s) => s.name === 'تلگرام')?.href || '#',
    icon: Telegram,
    bg: 'bg-[#0088CC]/10',
    color: 'text-[#0088CC]',
  },
  {
    name: 'واتساپ',
    href: siteConfig.socialLinks.find((s) => s.name === 'واتساپ')?.href || '#',
    icon: MessageCircle,
    bg: 'bg-[#25D366]/10',
    color: 'text-[#25D366]',
  },
];

export default function ContactPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <Header />
      <PageHeader
        title="تماس با ما"
        subtitle="در هر ساعت از شبانه‌روز، تیم پشتیبانی ما آماده پاسخگویی به شماست"
        breadcrumb={[
          { label: 'خانه', href: '/' },
          { label: 'تماس با ما' },
        ]}
      />

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card className="rounded-2xl shadow-card">
              <CardHeader className="pb-3">
                <CardTitle className="text-xl flex items-center gap-2">
                  <Send className="w-5 h-5 text-primary" strokeWidth={2} />
                  فرم تماس با ما
                </CardTitle>
                <p className="text-sm text-text-muted mt-1">
                  نظرات، پیشنهادات و سوالات خود را برای ما بفرستید. در اسرع وقت
                  پاسخ شما را خواهیم داد.
                </p>
              </CardHeader>
              <CardContent className="pt-3">
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                  }}
                  className="space-y-5"
                >
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Input
                      label="نام و نام خانوادگی"
                      placeholder="نام خود را وارد کنید"
                      required
                    />
                    <Input
                      label="ایمیل"
                      type="email"
                      placeholder="example@email.com"
                      required
                      dir="ltr"
                    />
                  </div>

                  <Input
                    label="موضوع پیام"
                    placeholder="موضوع مورد نظر خود را بنویسید"
                    required
                  />

                  <Textarea
                    label="متن پیام"
                    placeholder="پیام خود را با جزئیات بیشتر توضیح دهید..."
                    rows={7}
                    required
                  />

                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <p className="text-xs text-text-muted">
                      <Badge variant="success" size="sm" className="ml-1.5">
                        ۲۴ ساعته
                      </Badge>
                      پاسخگویی به پیام‌ها در حداکثر ۲۴ ساعت کاری انجام می‌شود.
                    </p>
                    <Button size="lg" type="submit">
                      <Send className="w-4 h-4" strokeWidth={2} />
                      ارسال پیام
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            <Card className="rounded-2xl overflow-hidden">
              <CardContent className="!p-0">
                <div className="relative w-full h-72 md:h-80 bg-bg border-b border-border flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 opacity-40">
                    <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-secondary/20" />
                    <div className="absolute top-8 right-8 w-40 h-40 rounded-full bg-primary/20 blur-3xl" />
                    <div className="absolute bottom-8 left-8 w-48 h-48 rounded-full bg-secondary/20 blur-3xl" />
                  </div>
                  <div className="relative z-10 flex flex-col items-center gap-4 p-6 text-center">
                    <div className="w-16 h-16 rounded-2xl bg-white/80 backdrop-blur text-primary flex items-center justify-center shadow-card">
                      <Building2 className="w-8 h-8" strokeWidth={2} />
                    </div>
                    <div>
                      <h4 className="text-lg font-bold text-text mb-1">
                        دفتر مرکزی بانک بیمه ابان
                      </h4>
                      <p className="text-sm text-text-muted max-w-md">
                        {siteConfig.address}
                      </p>
                    </div>
                    <div className="w-full max-w-md h-32 rounded-2xl border-2 border-dashed border-border/80 bg-white/40 backdrop-blur flex items-center justify-center">
                      <div className="flex flex-col items-center gap-1 text-text-muted">
                        <MapPin className="w-6 h-6" strokeWidth={2} />
                        <p className="text-xs">نمایش روی نقشه گوگل مپ</p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <div className="space-y-3">
              {contactInfoItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Card key={item.title} className="rounded-2xl">
                    <CardContent className="p-5">
                      <div className="flex items-start gap-3.5">
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${item.bg} ${item.color}`}
                        >
                          <Icon className="w-5 h-5" strokeWidth={2} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-text mb-1">
                            {item.title}
                          </h4>
                          <div className="space-y-1">
                            {item.values.map((v, i) => (
                              <p
                                key={i}
                                className="text-sm font-medium text-text"
                                dir={
                                  item.icon === Mail || item.icon === Phone ||
                                  item.icon === Printer
                                    ? 'ltr'
                                    : 'rtl'
                                }
                              >
                                {v}
                              </p>
                            ))}
                          </div>
                          <p className="mt-1.5 text-xs text-text-muted">
                            {item.sub}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            <Card className="rounded-2xl">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg">شبکه‌های اجتماعی</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-3 gap-2.5">
                  {socialLinks.map((s) => {
                    const Icon = s.icon;
                    return (
                      <a
                        key={s.name}
                        href={s.href}
                        target="_blank"
                        rel="noreferrer"
                        className="flex flex-col items-center gap-2 p-4 rounded-xl border border-border bg-bg hover:shadow-card transition-all hover:-translate-y-0.5"
                      >
                        <div
                          className={`w-11 h-11 rounded-xl flex items-center justify-center ${s.bg} ${s.color}`}
                        >
                          <Icon className="w-5 h-5" strokeWidth={2} />
                        </div>
                        <span className="text-xs font-medium text-text">
                          {s.name}
                        </span>
                      </a>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </Section>

      <Footer />
      <MobileBottomNav />
    </main>
  );
}
