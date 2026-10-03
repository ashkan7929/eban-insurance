'use client';

import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import { PageHeader } from '@/components/layout/page-header';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  ShieldCheck,
  Target,
  Eye,
  History,
  Users,
  Award,
  Clock,
  SmilePlus,
  FileCheck,
  Building2,
  Phone,
  Mail,
  MapPin,
  ArrowLeft,
  CircleCheck,
} from 'lucide-react';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import Link from 'next/link';


const historyItems = [
  {
    year: '۱۳۹۵',
    title: 'تأسیس شرکت',
    description:
      'بانک بیمه ابان با هدف ارائه خدمات بیمه‌ای آنلاین و نوین تأسیس شد.',
  },
  {
    year: '۱۳۹۷',
    title: 'گسترش محصولات',
    description:
      'پلتفرم آنلاین خرید بیمه شخص ثالث و بدنه خودرو با موفقیت راه‌اندازی شد.',
  },
  {
    year: '۱۳۹۹',
    title: 'مجوز رسمی بیمه مرکزی',
    description:
      'مجوز رسمی از سوی بیمه مرکزی ایران برای ارائه کلیه خدمات بیمه‌ای اخذ شد.',
  },
  {
    year: '۱۴۰۱',
    title: 'فرهنگساز خرید آنلاین',
    description:
      'با بیش از ۵۰۰ هزار کاربر فعال، به یکی از پلتفرم‌های برتر بیمه آنلاین تبدیل شدیم.',
  },
  {
    year: '۱۴۰۳',
    title: 'راه‌اندازی نسل جدید پلتفرم',
    description:
      'نسل جدید پلتفرم با تمرکز بر تجربه کاربری، هوش مصنوعی و سرعت بالاتر معرفی شد.',
  },
];

const teamMembers = [
  { name: 'علی محمدی', role: 'مدیر عامل', initials: 'عم' },
  { name: 'مریم احمدی', role: 'معاون فنی', initials: 'ما' },
  { name: 'رضا کریمی', role: 'مدیر محصول', initials: 'رک' },
  { name: 'سارا حسینی', role: 'مدیر پشتیبانی', initials: 'شح' },
  { name: 'حسین رضایی', role: 'مدیر مالی', initials: 'حر' },
  { name: 'نگار صالحی', role: 'مدیر بازاریابی', initials: 'نص' },
];

const numbers: { icon: typeof Users; value: string; suffix: string; label: string; color: string; bg: string }[] = [
  { icon: Users, value: '+۸۵۰', suffix: 'هزار', label: 'کاربر راضی', color: 'text-primary', bg: 'bg-primary/10' },
  { icon: FileCheck, value: '+۱.۲', suffix: 'میلیون', label: 'بیمه‌نامه صادر شده', color: 'text-success', bg: 'bg-success/10' },
  { icon: Award, value: '۱۵', suffix: '', label: 'جایزه صنعت بیمه', color: 'text-warning', bg: 'bg-warning/10' },
  { icon: Clock, value: '۷/۲۴', suffix: '', label: 'پشتیبانی مستمر', color: 'text-secondary', bg: 'bg-secondary/10' },
];

const values = [
  {
    icon: ShieldCheck,
    color: 'text-primary',
    bg: 'bg-primary/10',
    title: 'امنیت و اعتماد',
    description:
      'تمامی تراکنش‌ها با بالاترین سطح رمزنگاری و امنیت انجام می‌شود و اطلاعات شما محفوظ است.',
  },
  {
    icon: SmilePlus,
    color: 'text-success',
    bg: 'bg-success/10',
    title: 'رضایت کاربر',
    description:
      'تمرکز اصلی ما بر ایجاد تجربه‌ای ساده، سریع و خوشایند برای کاربران عزیز است.',
  },
  {
    icon: Award,
    color: 'text-warning',
    bg: 'bg-warning/10',
    title: 'کیفیت خدمات',
    description:
      'همکاری با معتبرترین شرکت‌های بیمه و ارائه محصولات با کیفیت و قیمت رقابتی.',
  },
];

export default function AboutPage() {
  return (
    <main className="flex flex-col min-h-screen">
      <Header />
      <PageHeader
        title="درباره بانک بیمه ابان"
        subtitle="همراه مطمئن شما در خرید و مدیریت بیمه‌های آنلاین"
        breadcrumb={[
          { label: 'خانه', href: '/' },
          { label: 'درباره ما' },
        ]}
      />

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="order-2 lg:order-1 space-y-5">
            <Badge variant="default" size="md" className="mb-2">
              درباره ما
            </Badge>
            <h2 className="text-2xl md:text-3xl font-bold text-text leading-tight">
              با آرامش خاطر، بیمه آنلاین بخرید
            </h2>
            <p className="text-base text-text-muted leading-8">
              بانک بیمه ابان به عنوان یکی از پیشگامان صنعت بیمه آنلاین در ایران،
              با هدف ساده‌سازی فرآیند خرید و مدیریت بیمه‌ها تأسیس شده است. ما
              این امکان را به شما می‌دهیم تا بدون نیاز به مراجعه حضوری، کلیه
              خدمات بیمه‌ای را به صورت آنلاین و در کوتاه‌ترین زمان دریافت کنید.
            </p>
            <p className="text-base text-text-muted leading-8">
              با بیش از یک دهه تجربه در صنعت بیمه و بهره‌گیری از فناوری روز، ما
              متعهد به ارائه خدمات با کیفیت، شفاف و قابل اعتماد به کاربران عزیز
              هستیم.
            </p>
            <div className="pt-2 flex flex-wrap gap-3">
              <Link href="/insurance">
                <Button size="lg">
                  مشاهده محصولات بیمه
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline">
                  تماس با ما
                  <ArrowLeft className="w-4 h-4" strokeWidth={2} />
                </Button>
              </Link>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <div className="relative">
              <div className="absolute -top-5 -right-5 w-32 h-32 bg-primary/10 rounded-full blur-3xl" />
              <div className="absolute -bottom-5 -left-5 w-40 h-40 bg-secondary/10 rounded-full blur-3xl" />
              <div className="relative rounded-3xl overflow-hidden shadow-card-lg border border-border">
                <img
                  src="https://coresg-normal.trae.ai/api/ide/v1/text_to_image?prompt=Modern%20Iranian%20insurance%20company%20office%20with%20professional%20team%20working%20on%20computers%2C%20warm%20lighting%2C%20minimalist%20interior%20design%2C%20shields%20and%20security%20elements%20on%20walls%2C%20persian%20calligraphy%20accents&image_size=landscape_4_3"
                  alt="درباره بانک بیمه ابان"
                  className="w-full h-[360px] md:h-[440px] object-cover"
                />
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section className="!py-10 md:!py-12 bg-card border-y border-border">
        <Container>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            {numbers.map((n) => {
              const Icon = n.icon;
              return (
                <div
                  key={n.label}
                  className="flex flex-col items-center text-center p-5 rounded-2xl bg-white border border-border shadow-card"
                >
                  <div
                    className={cn(
                      'w-12 h-12 rounded-2xl flex items-center justify-center mb-3',
                      n.bg,
                      n.color
                    )}
                  >
                    <Icon className="w-6 h-6" strokeWidth={2} />
                  </div>
                  <div className="text-2xl md:text-3xl font-bold text-text leading-tight">
                    {n.value}
                    {n.suffix && (
                      <span className="text-sm md:text-base font-bold text-text-muted mr-1">
                        {n.suffix}
                      </span>
                    )}
                  </div>
                  <p className="mt-1.5 text-xs md:text-sm text-text-muted">
                    {n.label}
                  </p>
                </div>
              );
            })}
          </div>
        </Container>
      </Section>

      <Section>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
          <Card className="rounded-2xl shadow-card">
            <CardContent className="p-6 md:p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                <Target className="w-6 h-6" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-text">مأموریت ما</h3>
              <p className="text-sm md:text-base text-text-muted leading-8">
                ایجاد دسترسی آسان، سریع و مطمئن به خدمات بیمه‌ای برای کلیه
                ایرانیان، با استفاده از فناوری‌های روز جهان و کاهش هزینه‌های
                اضافی فرآیندهای سنتی. ما به دنبال ساده‌سازی تجربه بیمه و ایجاد
                آرامش خاطر برای خانواده‌های ایرانی هستیم.
              </p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl shadow-card">
            <CardContent className="p-6 md:p-8 space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-secondary/10 text-secondary flex items-center justify-center">
                <Eye className="w-6 h-6" strokeWidth={2} />
              </div>
              <h3 className="text-xl font-bold text-text">چشم‌انداز ما</h3>
              <p className="text-sm md:text-base text-text-muted leading-8">
                تبدیل شدن به اولین و بزرگترین پلتفرم هوشمند بیمه در خاورمیانه،
                پلتفرمی که در آن بیمه‌گذاران به صورت شخصی‌سازی شده، بهترین
                گزینه‌ها را دریافت کنند و در تمام مراحل خرید، پشتیبانی و
                خسارت، بهترین تجربه را داشته باشند.
              </p>
            </CardContent>
          </Card>
        </div>
      </Section>

      <Section>
        <div className="mb-10 md:mb-12 text-center max-w-2xl mx-auto">
          <Badge variant="default" size="md" className="mb-3">
            ارزش‌های ما
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold text-text">
            اصولی که بر اساس آن حرکت می‌کنیم
          </h2>
          <p className="mt-4 text-base text-text-muted">
            این ارزش‌ها در تمام تصمیمات و تعاملات ما با کاربران و همکاران رعایت
            می‌شود.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {values.map((v) => {
            const Icon = v.icon;
            return (
              <Card key={v.title} className="rounded-2xl">
                <CardContent className="p-6 space-y-4">
                  <div
                    className={cn(
                      'w-12 h-12 rounded-2xl flex items-center justify-center',
                      v.bg,
                      v.color
                    )}
                  >
                    <Icon className="w-6 h-6" strokeWidth={2} />
                  </div>
                  <h3 className="text-lg font-bold text-text">{v.title}</h3>
                  <p className="text-sm text-text-muted leading-8">
                    {v.description}
                  </p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </Section>

      <Section>
        <div className="mb-10 md:mb-12 text-center max-w-2xl mx-auto">
          <Badge variant="default" size="md" className="mb-3">
            <History className="w-3.5 h-3.5 ml-1" strokeWidth={2.5} />
            تاریخچه
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold text-text">
            مسیر رشد و پیشرفت
          </h2>
          <p className="mt-4 text-base text-text-muted">
            قدم به قدم، با تلاش متخصصان و اعتماد شما کاربران عزیز.
          </p>
        </div>

        <div className="relative max-w-3xl mx-auto pr-2 md:pr-0">
          <div
            className="absolute md:right-1/2 md:translate-x-1/2 right-[15px] top-6 bottom-6 w-0.5 bg-border"
            aria-hidden="true"
          />
          <ol className="space-y-6">
            {historyItems.map((item, idx) => {
              const isLeft = idx % 2 === 0;
              return (
                <li key={item.year} className="relative flex">
                  <div className="hidden md:flex md:w-1/2 shrink-0" />
                  <div className="absolute md:right-1/2 md:translate-x-1/2 right-0 top-1.5 w-8 h-8 rounded-full bg-primary text-white flex items-center justify-center z-10 border-4 border-bg shadow-card">
                    <CircleCheck className="w-4 h-4" strokeWidth={2.5} />
                  </div>
                  <div
                    className={cn(
                      'md:w-1/2 flex-1 md:px-8',
                      'mr-14 md:mr-0',
                      isLeft ? 'md:text-left md:pr-12 md:order-1' : 'md:pl-12 md:order-2'
                    )}
                  >
                    <Card className="rounded-2xl">
                      <CardContent className="p-5 space-y-2">
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <Badge variant="default" size="md">
                            {item.year}
                          </Badge>
                        </div>
                        <h4 className="text-base font-bold text-text">
                          {item.title}
                        </h4>
                        <p className="text-sm text-text-muted leading-7">
                          {item.description}
                        </p>
                      </CardContent>
                    </Card>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </Section>

      <Section>
        <div className="mb-10 md:mb-12 text-center max-w-2xl mx-auto">
          <Badge variant="default" size="md" className="mb-3">
            <Users className="w-3.5 h-3.5 ml-1" strokeWidth={2.5} />
            تیم ما
          </Badge>
          <h2 className="text-2xl md:text-3xl font-bold text-text">
            متخصصان پشت بانک بیمه ابان
          </h2>
          <p className="mt-4 text-base text-text-muted">
            تیمی متخصص و با تجربه در خدمت شما.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 md:gap-4">
          {teamMembers.map((m) => (
            <Card key={m.name} className="rounded-2xl">
              <CardContent className="p-5 text-center space-y-3">
                <div className="w-16 h-16 mx-auto rounded-full bg-gradient-to-br from-primary/20 to-secondary/20 text-primary flex items-center justify-center text-xl font-bold">
                  {m.initials}
                </div>
                <div>
                  <h4 className="text-sm font-bold text-text">{m.name}</h4>
                  <p className="text-xs text-text-muted mt-1">{m.role}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </Section>

      <Section className="!py-12 md:!py-16 bg-gradient-to-l from-primary/5 via-transparent to-secondary/5 border-t border-border">
        <Container>
          <Card className="rounded-3xl overflow-hidden shadow-card-lg border-border">
            <CardContent className="p-8 md:p-12">
              <div className="grid grid-cols-1 md:grid-cols-[1fr_auto] items-center gap-6">
                <div>
                  <h3 className="text-2xl md:text-3xl font-bold text-text mb-3">
                    شروع خرید بیمه، چند دقیقه کار است
                  </h3>
                  <p className="text-base text-text-muted max-w-xl mb-2">
                    همین حالا به پلتفرم ما بپیوندید و اولین بیمه آنلاین خود را
                    با چند کلیک خریداری کنید.
                  </p>
                </div>
                <div className="flex flex-wrap gap-3">
                  <Link href="/insurance">
                    <Button size="lg">شروع خرید</Button>
                  </Link>
                  <Link href="/tracking">
                    <Button size="lg" variant="outline">
                      پیگیری سفارش
                    </Button>
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </Container>
      </Section>

      <Footer />
      <MobileBottomNav />
    </main>
  );
}
