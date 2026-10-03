'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Calculator,
  CreditCard,
  FileCheck2,
  IdCard,
  CarFront,
  Image as ImageIcon,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  CheckCircle2,
  FileText,
  UserCheck,
} from 'lucide-react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import { PageHeader } from '@/components/layout/page-header';
import { Section } from '@/components/ui/section';
import { Container } from '@/components/ui/container';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Stepper } from '@/components/ui/stepper';
import { Accordion } from '@/components/ui/accordion';
import { products, getProductBySlug, productSlugs, type ProductConfig } from '@/config/products';
import { formatIRR, cn } from '@/lib/utils';
import { InsuranceFeature } from '@/components/business/insurance-feature';
import { PlanCard, type PlanFeature } from '@/components/business/plan-card';
import { CoverageCard, type CoverageRow } from '@/components/business/coverage-card';
import { StickyPurchaseBar } from '@/components/business/sticky-purchase-bar';

const estimatedPrices: Record<string, number> = {
  'third-party': 1850000,
  body: 4500000,
  life: 2800000,
  travel: 980000,
};

const benefitsData: Record<string, string[]> = {
  'third-party': [
    'رعایت الزامات قانونی و جریمه نشدن',
    'پوشش خسارت جانی تا سقف قانونی',
    'پوشش خسارت مالی خودروهای دیگر',
    'امداد و پشتیبانی ۲۴ ساعته در جاده',
    'فرآیند ساده و سریع پرداخت خسارت',
    'امکان ارتقاء به بیمه بدنه با تخفیف',
  ],
  body: [
    'پوشش کامل تصادفات و برخوردها',
    'آتش‌سوزی و انفجار خودرو',
    'سرقت کامل و جزئی خودرو',
    'بلایای طبیعی (سیل، طوفان، زلزله)',
    'خودرو جایگزین در صورت تعمیر',
    'خدمات یدکی و تندرستی ۲۴ ساعته',
  ],
  life: [
    'پرداخت وجه فوت طبیعی و تصادفی',
    'پوشش نقص عضو دائمی و کامل',
    'پرداخت حق بیمه بستری در بیمارستان',
    'پوشش هزینه‌های جراحی و درمانی',
    'امکان انتخاب سقف پوشش انعطاف‌پذیر',
    'معافیت از پرداخت حق بیمه در برخی موارد',
  ],
  travel: [
    'پوشش درمانی تا ۵۰ هزار یورو',
    'ارسال به بیمارستان و اجلاس پزشکی',
    'پوشش از دست دادن چمدان',
    'تاخیر در پرواز و اقامت اجباری',
    'لغو سفر به دلایل موجه',
    'خدمات اضطراری و مشاوره تلفنی',
  ],
};

const planPrices: Record<string, { basic: number; complete: number }> = {
  'third-party': { basic: 1850000, complete: 2450000 },
  body: { basic: 4500000, complete: 7200000 },
  life: { basic: 2800000, complete: 5200000 },
  travel: { basic: 980000, complete: 1850000 },
};

function getPlanFeatures(slug: string): { basic: PlanFeature[]; complete: PlanFeature[] } {
  switch (slug) {
    case 'third-party':
      return {
        basic: [
          { title: 'پوشش خسارت جانی اشخاص ثالث', included: true },
          { title: 'پوشش خسارت مالی خودرو ثالث (تا ۲۰۰ میلیون', included: true },
          { title: 'حوله و امداد جاده‌ای پایه', included: true },
          { title: 'پشتیبانی تلفنی ۲۴ ساعته', included: true },
          { title: 'پوشش خسارت مالی بیشتر از ۲۰۰ میلیون', included: false },
          { title: 'خودرو جایگزین', included: false },
        ],
        complete: [
          { title: 'پوشش خسارت جانی اشخاص ثالث', included: true },
          { title: 'پوشش خسارت مالی خودرو ثالث (تا ۵۰۰ میلیون)', included: true },
          { title: 'حوله و امداد جاده‌ای کامل', included: true },
          { title: 'پشتیبانی تلفنی ۲۴ ساعته', included: true },
          { title: 'پوشش خسارت مالی بیشتر از ۵۰۰ میلیون', included: true },
          { title: 'خودرو جایگزین تا ۷ روز', included: true },
        ],
      };
    case 'body':
      return {
        basic: [
          { title: 'پوشش تصادف و برخورد', included: true },
          { title: 'پوشش آتش‌سوزی', included: true },
          { title: 'پوشش سرقت کامل', included: true },
          { title: 'شکست شیشه جلو', included: true },
          { title: 'بلایای طبیعی', included: false },
          { title: 'خودرو جایگزین', included: false },
        ],
        complete: [
          { title: 'پوشش تصادف و برخورد', included: true },
          { title: 'پوشش آتش‌سوزی', included: true },
          { title: 'پوشش سرقت کامل و جزئی', included: true },
          { title: 'شکست تمام شیشه‌ها', included: true },
          { title: 'بلایای طبیعی (سیل، زلزله)', included: true },
          { title: 'خودرو جایگزین تا ۱۰ روز', included: true },
        ],
      };
    case 'life':
      return {
        basic: [
          { title: 'پوشش فوت طبیعی', included: true },
          { title: 'پوشش فوت تصادفی', included: true },
          { title: 'نقص عضو دائمی', included: true },
          { title: 'بستری در بیمارستان', included: false },
          { title: 'هزینه‌های درمانی و جراحی', included: false },
          { title: 'معافیت از پرداخت حق بیمه', included: false },
        ],
        complete: [
          { title: 'پوشش فوت طبیعی ۲ برابر', included: true },
          { title: 'پوشش فوت تصادفی ۴ برابر', included: true },
          { title: 'نقص عضو دائمی کامل', included: true },
          { title: 'بستری در بیمارستان', included: true },
          { title: 'هزینه‌های درمانی و جراحی', included: true },
          { title: 'معافیت از پرداخت حق بیمه', included: true },
        ],
      };
    case 'travel':
    default:
      return {
        basic: [
          { title: 'پوشش درمانی تا ۱۵ هزار یورو', included: true },
          { title: 'از دست دادن چمدان', included: true },
          { title: 'تاخیر در پرواز بیش از ۴ ساعت', included: true },
          { title: 'لغو سفر', included: false },
          { title: 'اقامت اجباری', included: false },
          { title: 'اعزام اضطراری خانواده', included: false },
        ],
        complete: [
          { title: 'پوشش درمانی تا ۵۰ هزار یورو', included: true },
          { title: 'از دست دادن چمدان ۲ برابر', included: true },
          { title: 'تاخیر در پرواز بیش از ۲ ساعت', included: true },
          { title: 'لغو سفر به هر دلیلی', included: true },
          { title: 'اقامت اجباری هتل ۵ ستاره', included: true },
          { title: 'اعزام اضطراری خانواده', included: true },
        ],
      };
  }
}

function getCoverageRows(slug: string): CoverageRow[] {
  switch (slug) {
    case 'third-party':
      return [
        { name: 'خسارت جانی اشخاص ثالث', basic: 'full', complete: 'full' },
        { name: 'خسارت مالی خودرو دیگران', basic: 'partial', complete: 'full' },
        { name: 'امداد جاده‌ای', basic: 'partial', complete: 'full' },
        { name: 'خودرو جایگزین', basic: 'none', complete: 'partial' },
        { name: 'حق وکیل و هزینه‌های قضایی', basic: 'none', complete: 'partial' },
        { name: 'پوشش سرنشینان خودرو', basic: 'none', complete: 'full' },
      ];
    case 'body':
      return [
        { name: 'سرقت', basic: 'full', complete: 'full' },
        { name: 'آتش‌سوزی', basic: 'full', complete: 'full' },
        { name: 'بلایای طبیعی', basic: 'none', complete: 'full' },
        { name: 'شکست شیشه', basic: 'partial', complete: 'full' },
        { name: 'حوادث راننده', basic: 'partial', complete: 'full' },
        { name: 'مسئولیت مدنی سرنشینان', basic: 'none', complete: 'full' },
      ];
    case 'life':
      return [
        { name: 'فوت طبیعی', basic: 'full', complete: 'full' },
        { name: 'فوت تصادفی', basic: 'full', complete: 'full' },
        { name: 'نقص عضو دائمی', basic: 'partial', complete: 'full' },
        { name: 'بستری در بیمارستان', basic: 'none', complete: 'full' },
        { name: 'هزینه درمان', basic: 'none', complete: 'full' },
        { name: 'معافیت حق بیمه', basic: 'none', complete: 'full' },
      ];
    case 'travel':
    default:
      return [
        { name: 'پوشش درمانی', basic: 'partial', complete: 'full' },
        { name: 'از دست دادن چمدان', basic: 'partial', complete: 'full' },
        { name: 'تاخیر پرواز', basic: 'partial', complete: 'full' },
        { name: 'لغو سفر', basic: 'none', complete: 'full' },
        { name: 'اقامت اجباری', basic: 'none', complete: 'full' },
        { name: 'اعزام خانواده', basic: 'none', complete: 'full' },
      ];
  }
}

const howItWorks = [
  { label: 'وارد کردن اطلاعات' },
  { label: 'محاسبه و مقایسه' },
  { label: 'پرداخت و دریافت بیمه‌نامه' },
];

function getRequiredDocs(slug: string) {
  if (slug === 'travel' || slug === 'life') {
    return [
      { icon: IdCard, title: 'کارت ملی', description: 'مجدت دارنده بیمه' },
      { icon: FileText, title: 'گذرنامه', description: 'معتبر برای سفرهای خارجی' },
      { icon: ImageIcon, title: 'عکس پرسنلی', description: 'حداقل ۶ ماه اخیر' },
      { icon: FileCheck2, title: 'شماره تماس', description: 'معتبر و فعال' },
    ];
  }
  return [
    { icon: IdCard, title: 'کارت ملی', description: 'مالک خودرو' },
    { icon: CarFront, title: 'کارت رانندگی', description: 'راننده اصلی' },
    { icon: FileText, title: 'برگ خودرو', description: 'معتبر و معاوضه نشده' },
    { icon: ImageIcon, title: 'عکس خودرو', description: 'در صورت نیاز' },
  ];
}

function getFaqItems(slug: string) {
  switch (slug) {
    case 'third-party':
      return [
        {
          id: 'tp-1',
          title: 'بیمه شخص ثالث چقدر اعتبار دارد؟',
          content: 'اعتبار بیمه شخص ثالث به صورت پیش‌فرض یک ساله از تاریخ صدور است. پس از انقضا، باید تمدید شود. در صورت عدم تمدید، با جریمه‌های نقدی و حراستی در پی خواهد داشت.',
        },
        {
          id: 'tp-2',
          title: 'آیا می‌توانم بیمه شخص ثالث را قبل از تاریخ شروع فعلی خریداری کنم؟',
          content: 'بله، شما می‌توانید تا ۳۰ روز قبل از تاریخ انقضای بیمه‌نامه فعلی، بیمه جدید را خریداری و ثبت نمایید. اعتبار بیمه جدید از تاریخ انقضای قبلی شروع خواهد شد.',
        },
        {
          id: 'tp-3',
          title: 'در صورت فروش خودرو چه اتفاقی برای بیمه‌نامه می‌افتد؟',
          content: 'بیمه شخص ثالث به خودرو بسته می‌شود نه به مالک. پس در صورت فروش، بیمه‌نامه به مالک جدید منتقل می‌شود و نیازی به تغییر نام ندارد، مگر آنکه مالک جدید بخواهد بیمه جدیدی تهیه نماید.',
        },
        {
          id: 'tp-4',
          title: 'خسارت سرنشینان خودرو من پوشش داده می‌شود؟',
          content: 'در طرح پایه خیر، اما در طرح کامل پوشش مسئولیت مدنی سرنشینان خودرو وجود دارد. همچنین می‌توانید بیمه تکمیلی بدنه را هم خریداری کنید.',
        },
        {
          id: 'tp-5',
          title: 'پرداخت خسارت چه مدت طول می‌کشد؟',
          content: 'پس از تحویل مدارک کامل و ارزیابی خسارت، حداکثر ظرف ۱۰ روز کاری مبلغ خسارت واریز می‌گردد. در موارد ساده‌تر این زمان کمتر خواهد بود.',
        },
      ];
    case 'body':
      return [
        {
          id: 'bd-1',
          title: 'بیمه بدنه و شخص ثالث چه تفاوتی دارند؟',
          content: 'بیمه شخص ثالث، خسارت وارده به دیگران را پوشش می‌دهد ولی بیمه بدنه، خسارت وارده به خودروی شما را. برای آسایش بیشتر، توصیه می‌کنیم هر دو را خریداری کنید.',
        },
        {
          id: 'bd-2',
          title: 'آیا همه خودروها بیمه بدنه می‌گیرند؟',
          content: 'خودروهایی که سن بالای ۱۰ سال دارند معمولاً بیمه بدنه نمی‌گیرند، البته این بسته به بیمه‌گر و وضعیت خودرو نیز دارد. خودروهای لوکس و کمیاب نیز ممکن است شرایط ویژه‌ای داشته باشند.',
        },
        {
          id: 'bd-3',
          title: 'سرقت جزئی چیست؟',
          content: 'سرقت جزئی به سرقت قطعات و لوازم جانبی خودرو مانند رادیو، چرخ و بند، شیشه و غیره گفته می‌شود که در طرح کامل پوشش دارد. در طرح پایه فقط سرقت کامل خودرو پوشش است.',
        },
        {
          id: 'bd-4',
          title: 'بلایای طبیعی شامل چه مواردی است؟',
          content: 'بلایای طبیعی شامل سیلاب، طوفان، زلزله، آتش‌سوزی طبیعی، درخت ریختن و سنگ‌ریز و... است که در طرح کامل پوشش داده می‌شود.',
        },
        {
          id: 'bd-5',
          title: 'کارکرد بیمه‌نامه بدنه از چه لحظاتی شروع می‌شود؟',
          content: 'بلافاصله پس از پرداخت و صدور آنلاین بیمه‌نامه، پوشش فعال می‌گردد و شما می‌توانید پی دی اف بیمه‌نامه را دانلود و پرینت بگیرید.',
        },
      ];
    case 'life':
      return [
        {
          id: 'lf-1',
          title: 'بیمه عمر را برای چه کسانی مناسب است؟',
          content: 'بیمه عمر برای کسانی که مسئولیت نگهداری خانواده و یا وام‌ها را دارند بسیار توصیه می‌شود. هر چه سن کمتر باشد، حق بیمه کمتری پرداخت خواهید کرد.',
        },
        {
          id: 'lf-2',
          title: 'سقف پوشش چگونه محاسبه می‌شود؟',
          content: 'شما می‌توانید بر اساس نیاز خود سقف پوشش را بین ۵۰ میلیون تا ۵ میلیارد تومان انتخاب کنید. هرچه سقف بالاتر باشد، حق بیمه ماهانه بیشتر است.',
        },
        {
          id: 'lf-3',
          title: 'آیا در صورت بیماری قبلی مشکلی هست؟',
          content: 'باید در فرم درخواست، بیماری‌های زمینه‌ای را اعلام کنید. بر اساس نوع بیماری ممکن است کسری از حق بیمه اضافه شود و یا در موارد خاص پوشش داده نشود.',
        },
        {
          id: 'lf-4',
          title: 'حق بیمه پرداخت شده قابل استرداد است؟',
          content: 'در ۱۵ روز اول پس از خرید، می‌توانید بدون هیچ جریمه‌ای حق بیمه خود را استرداد کنید. پس از آن طبق جدول مقرراتی در صورت لغو بخشی از مبلغ باز می‌گردد.',
        },
        {
          id: 'lf-5',
          title: 'پرداخت خسارت به چه کسی انجام می‌شود؟',
          content: 'در صورت وقوع خسارت، به ذی‌نفع معرفی شده در بیمه‌نامه پرداخت می‌شود. در صورت عدم معرفی، به وارثان قانونی فرد بیمه‌شده پرداخت می‌گردد.',
        },
      ];
    case 'travel':
    default:
      return [
        {
          id: 'tr-1',
          title: 'بیمه مسافرت برای کشورهای اروپا و شنگن مناسب است؟',
          content: 'بله، بیمه مسافرت ما با تمام سفارتخانه‌ها و کنسولگری‌ها به رسمیت شناخته شده و برای اخذ ویزای شنگن کاملاً قابل استفاده است.',
        },
        {
          id: 'tr-2',
          title: 'آیا می‌توانم پس از خرید سفر، بیمه مسافرت هم خریداری کنم؟',
          content: 'بله، می‌توانید. اما پوشش از لحظه صدور بیمه‌نامه شروع می‌شود و حوادثی که قبل از آن اتفاق افتاده‌اند پوشش داده نمی‌شوند.',
        },
        {
          id: 'tr-3',
          title: 'در صورت بستری در بیمارستان در خارج از کشور چه باید کرد؟',
          content: 'با شماره اضطراری ذکر شده در بیمه‌نامه تماس بگیرید. همکاران ما هماهنگی‌های لازم را با بیمارستان انجام داده و هزینه‌ها را مستقیماً تسویه می‌کنند.',
        },
        {
          id: 'tr-4',
          title: 'از دست دادن پاسپورت و گذرنامه چطور؟',
          content: 'در طرح کامل، هزینه‌های متعاقب از دست دادن مدارک شامل صدور مجدد گذرنامه و هزینه اقامت اضافی نیز پوشش داده می‌شود.',
        },
        {
          id: 'tr-5',
          title: 'لغو سفر به چه دلایلی پوشش دارد؟',
          content: 'در طرح کامل، لغو سفر به دلایل بحرانی مانند بیماری ناگهانی خود یا بستگان درجه یک، فوت بستگان، حوادث غیر مترقبه و... پوشش دارد.',
        },
      ];
  }
}

const planTitles: Record<string, string> = {
  'third-party': 'مقایسه پوشش‌های بیمه شخص ثالث',
  body: 'مقایسه پوشش‌های بیمه بدنه',
  life: 'مقایسه پوشش‌های بیمه عمر و حوادث',
  travel: 'مقایسه پوشش‌های بیمه مسافرت',
};

const steps = [
  {
    icon: UserCheck,
    title: 'وارد کردن اطلاعات',
    description: 'اطلاعات خود و بیمه‌نامه را در چند مرحله ساده وارد کنید.',
  },
  {
    icon: Calculator,
    title: 'محاسبه و مقایسه',
    description: 'قیمت دقیق محاسبه شده و بهترین گزینه‌ها را ببینید.',
  },
  {
    icon: CreditCard,
    title: 'پرداخت و دریافت بیمه‌نامه',
    description: 'پرداخت امن و دریافت فوری بیمه‌نامه به صورت آنلاین.',
  },
];

export default function InsuranceDetailPage() {
  const params = useParams<{ slug: string }>();
  const product = getProductBySlug(params.slug);

  if (!product) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-bg text-center p-10">
        <div className="size-20 rounded-full bg-danger/10 text-danger flex items-center justify-center">
          <Sparkles className="size-10" />
        </div>
        <h1 className="text-2xl font-bold">محصول پیدا نشد</h1>
        <p className="text-text-muted">بیمه درخواستی شما در سیستم ثبت نشده است.</p>
        <Link href="/insurance">
          <Button variant="primary">مشاهده لیست بیمه‌ها</Button>
        </Link>
      </div>
    );
  }

  const ProductIcon = product.icon;
  const price = estimatedPrices[product.slug] || 0;
  const benefits = benefitsData[product.slug] || [];
  const prices = planPrices[product.slug] ?? { basic: 0, complete: 0 };
  const planFeatures = getPlanFeatures(product.slug);
  const coverageRows = getCoverageRows(product.slug);
  const requiredDocs = getRequiredDocs(product.slug);
  const faqItems = getFaqItems(product.slug);

  return (
    <div className="flex min-h-screen flex-col pb-24 sm:pb-10">
      <Header />

      <main className="flex-1">
        <PageHeader
          title={product.title}
          subtitle={product.description}
          breadcrumb={[
            { label: 'خانه', href: '/' },
            { label: 'بیمه‌ها', href: '/insurance' },
            { label: product.title },
          ]}
        />

        <Container>
          <div className="grid grid-cols-1 gap-10 py-10 md:grid-cols-2 md:py-14">
            <div className="order-2 md:order-1">
              <Badge className="mb-4 gap-1" variant="outline">
                <Sparkles className="h-3.5 w-3.5 text-primary" />
                {product.shortTitle}
              </Badge>
              <h3 className="text-2xl font-bold text-text mb-4 md:text-3xl">
                ویژگی‌های بیمه {product.shortTitle}
              </h3>
              <p className="text-sm leading-8 text-text-muted mb-7 md:text-base">
                {product.longDescription}
              </p>

              <div className="space-y-3 mb-8">
                {product.features.map((feature, idx) => (
                <InsuranceFeature
                  key={idx}
                  feature={feature}
                  variant="check"
                  colorClass={product.color}
                  bgClass={product.bgColor}
                />
              ))}
              </div>

              <Link href={`/quote/${product.slug}`}>
                <Button size="lg" className="gap-2">
                  <Calculator className="h-5 w-5" />
                  محاسبه قیمت و شروع خرید
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="order-1 md:order-2 relative">
              <div className="relative overflow-hidden rounded-3xl p-8 md:p-10 bg-gradient-to-br from-primary/5 via-transparent to-primary/10 border border-primary/10">
                <div
                  className={cn(
                    'absolute top-6 left-6 h-40 w-40 rounded-full blur-3xl opacity-30 animate-pulse',
                    product.bgColor
                  )}
                />
                <div
                  className={cn(
                    'absolute bottom-0 right-0 h-56 w-56 rounded-full blur-3xl opacity-20',
                    product.bgColor
                  )}
                />

                <div className="relative flex flex-col items-center justify-center gap-6 text-center py-10 md:py-14">
                  <div
                    className={cn(
                      'relative flex h-28 w-28 md:h-36 md:w-36 items-center justify-center rounded-3xl shadow-card-lg',
                      product.bgColor,
                      product.color,
                      'ring-4 ring-white'
                    )}
                  >
                    <ProductIcon className="h-14 w-14 md:h-20 md:w-20" strokeWidth={1.75} />
                  </div>

                  <div className="w-full max-w-xs">
                    <div className="text-xs text-text-muted mb-2">تخمین قیمت از</div>
                    <div className="rounded-2xl bg-gradient-to-l from-primary to-primary-light text-white shadow-card-lg py-4 px-6">
                      <div className="text-3xl font-bold md:text-4xl">
                        {formatIRR(price)}
                      </div>
                      <div className="text-xs mt-1 text-white/80">
                        برای اطلاع از قیمت دقیق، محاسبه کنید
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-center gap-3">
                    <Badge variant="success" className="gap-1">
                      <CheckCircle2 className="h-3.5 w-3.5" />
                      صدور فوری
                    </Badge>
                    <Badge variant="default" className="gap-1 bg-primary/10 text-primary border-0">
                      <ShieldCheck className="h-3.5 w-3.5" />
                      معتبر و قانونی
                    </Badge>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>

        <Section eyebrow="مزایا" title="مزایای این بیمه" description="با انتخاب این بیمه، از مزایای زیر بهره‌مند خواهید بود.">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {benefits.map((benefit, idx) => (
              <Card key={idx} className="h-full transition-all duration-300 hover:shadow-card-hover">
                <CardContent className="p-6">
                  <InsuranceFeature
                    feature={benefit}
                    variant="check"
                    colorClass={product.color}
                    bgClass={product.bgColor}
                    className="items-start"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </Section>

        <Section eyebrow="طرح‌ها" title={planTitles[product.slug] || 'مقایسه پوشش‌ها'} description="دو طرح پایه و کامل را ببینید و متناسب با نیاز خود انتخاب کنید.">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 mb-10">
            <PlanCard
              name="طرح پایه"
              description="پوشش‌های ضروری و اصلی"
              price={prices.basic}
              features={planFeatures.basic}
            />
            <PlanCard
              name="طرح کامل"
              description="پوشش کامل و جامع با بیشترین مزایا"
              price={prices.complete}
              features={planFeatures.complete}
              highlighted
            />
          </div>

          <CoverageCard rows={coverageRows} />
        </Section>

        <Section eyebrow="فرآیند" title="نحوه صدور بیمه‌نامه" description="در سه مرحله ساده و سریع بیمه‌نامه خود را دریافت کنید." className="bg-card border-y border-border">
          <div className="max-w-3xl mx-auto mb-12">
            <Stepper steps={howItWorks} currentStep={3} />
          </div>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {steps.map((step, idx) => {
              const StepIcon = step.icon;
              return (
                <Card key={idx} className="relative h-full text-center">
                  <CardContent className="p-6">
                    <div
                      className={cn(
                        'mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl',
                        idx === 0 && 'bg-primary/10 text-primary',
                        idx === 1 && 'bg-secondary/10 text-secondary',
                        idx === 2 && 'bg-accent/10 text-accent'
                      )}
                    >
                      <StepIcon className="h-7 w-7" strokeWidth={2} />
                    </div>
                    <div className="text-xs font-bold text-text-muted mb-2">
                      مرحله {idx + 1}
                    </div>
                    <h3 className="text-lg font-bold text-text mb-2">{step.title}</h3>
                    <p className="text-sm leading-7 text-text-muted">{step.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </Section>

        <Section eyebrow="مدارک" title="مدارک موردنیاز" description="برای صدور این بیمه، مدارک زیر را آماده داشته باشید.">
          <div className="grid grid-cols-2 gap-5 md:grid-cols-4">
            {requiredDocs.map((doc, idx) => {
              const DocIcon = doc.icon;
              return (
                <Card
                  key={idx}
                  className="h-full text-center transition-all duration-300 hover:shadow-card-hover"
                >
                  <CardContent className="p-6">
                    <div
                      className={cn(
                        'mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl',
                        product.bgColor,
                        product.color
                      )}
                    >
                      <DocIcon className="h-7 w-7" strokeWidth={2} />
                    </div>
                    <h4 className="text-base font-bold text-text mb-1">{doc.title}</h4>
                    <p className="text-xs leading-6 text-text-muted">{doc.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </Section>

        <Section eyebrow="سوالات متداول" title="پاسخ سوالات شما" description="در صورتی که سوال دیگری دارید، با پشتیبانی ما تماس بگیرید." className="bg-card border-t border-border">
          <div className="max-w-3xl mx-auto">
            <Accordion items={faqItems} />
          </div>
        </Section>

        <Section className="pt-0">
          <Card className="overflow-hidden border-0 bg-gradient-to-l from-primary via-primary/90 to-primary-light text-white shadow-card-lg">
            <CardContent className="p-8 md:p-10">
              <div className="flex flex-col items-center justify-between gap-6 md:flex-row md:text-right text-center">
                <div className="md:max-w-xl">
                  <div className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-1.5 text-xs font-medium text-white">
                    <Sparkles className="h-3.5 w-3.5" />
                    همین الان شروع کنید
                  </div>
                  <h3 className="text-2xl font-bold mb-3 md:text-3xl">
                    آماده خرید بیمه {product.shortTitle} هستید؟
                  </h3>
                  <p className="text-white/80 text-sm md:text-base leading-8">
                    قیمت دقیق را محاسبه کنید، طرح مناسب را انتخاب و بلافاصله بیمه‌نامه خود را دریافت کنید.
                  </p>
                </div>
                <Link href={`/quote/${product.slug}`} className="shrink-0">
                  <Button
                    size="lg"
                    variant="secondary"
                    className="bg-white text-primary hover:bg-white/90 gap-2"
                  >
                    <Calculator className="h-5 w-5" />
                    شروع خرید
                    <ArrowLeft className="h-4 w-4" />
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </Section>
      </main>

      <Footer />
      <MobileBottomNav />
      <StickyPurchaseBar product={product} />
    </div>
  );
}
