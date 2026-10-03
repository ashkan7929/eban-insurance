import type { LucideIcon } from 'lucide-react';
import { Car, ShieldPlus, Heart, Plane } from 'lucide-react';

export interface ProductFeature {
  title: string;
}

export interface ProductConfig {
  slug: string;
  title: string;
  shortTitle: string;
  description: string;
  longDescription: string;
  icon: LucideIcon;
  color: string;
  bgColor: string;
  borderColor: string;
  features: ProductFeature[];
  heroImage: string;
}

export const products: ProductConfig[] = [
  {
    slug: 'third-party',
    title: 'بیمه شخص ثالث',
    shortTitle: 'شخص ثالث',
    description: 'بیمه مسئولیت مدنی رانندگان خودرو',
    longDescription:
      'بیمه شخص ثالث یا مسئولیت مدنی راننده، خسارت‌های مالی و جانی ناشی از تصادفات وارده به اشخاص ثالث را پوشش می‌دهد. این بیمه به صورت قانونی الزامی است و می‌توانید آن را به صورت آنلاین و در عرض چند دقیقه از ما خریداری کنید.',
    icon: Car,
    color: 'text-primary',
    bgColor: 'bg-primary/10',
    borderColor: 'border-primary/20',
    features: [
      { title: 'پوشش خسارت جانی به اشخاص ثالث' },
      { title: 'پوشش خسارت مالی به وسایل نقلیه دیگر' },
      { title: 'امکان انتخاب بیمه تکمیلی بدنه' },
      { title: 'صدور آنلاین و فوری بیمه نامه' },
      { title: 'پشتیبانی ۲۴ ساعته در صورت تصادف' },
    ],
    heroImage: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=1200&q=80',
  },
  {
    slug: 'body',
    title: 'بیمه بدنه خودرو',
    shortTitle: 'بدنه خودرو',
    description: 'پوشش کامل خسارت‌های وارده به خودروی شما',
    longDescription:
      'بیمه بدنه خودرو، خسارت‌های ناشی از تصادف، سرقت، آتش‌سوزی، ضایعات طبیعی و سایر موارد را پوشش می‌دهد. با این بیمه نامه از آرامش خاطر برخوردار باشید.',
    icon: ShieldPlus,
    color: 'text-secondary',
    bgColor: 'bg-secondary/10',
    borderColor: 'border-secondary/20',
    features: [
      { title: 'پوشش خسارت تصادفات کامل' },
      { title: 'پوشش سرقت و آتش‌سوزی' },
      { title: 'پوشش ضایعات طبیعی (طوفان، سیل)' },
      { title: 'خسارت شیشه و لوازم جانبی' },
      { title: 'خدمات یدکی و خودرو جایگزین' },
    ],
    heroImage: 'https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=1200&q=80',
  },
  {
    slug: 'life',
    title: 'بیمه عمر و حوادث',
    shortTitle: 'عمر و حوادث',
    description: 'آرامش خاطر برای شما و خانواده‌تان',
    longDescription:
      'بیمه عمر و حوادث، پوشش مالی در موارد فوت، نقص عضو دائمی، بستری در بیمارستان و هزینه‌های درمانی را ارائه می‌دهد. این بیمه نامه امنیت مالی خانواده شما را در شرایط سختی تضمین می‌کند.',
    icon: Heart,
    color: 'text-danger',
    bgColor: 'bg-danger/10',
    borderColor: 'border-danger/20',
    features: [
      { title: 'پوشش فوت و نقص عضو دائمی' },
      { title: 'پرداخت حق بیمه بستری' },
      { title: 'پوشش هزینه‌های درمانی' },
      { title: 'امکان انتخاب دوره و سقف پوشش' },
      { title: 'پرداخت فوری خسارت در صورت وقوع' },
    ],
    heroImage: 'https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?w=1200&q=80',
  },
  {
    slug: 'travel',
    title: 'بیمه مسافرت',
    shortTitle: 'مسافرت',
    description: 'همراه مطمئن سفرهای داخلی و خارجی',
    longDescription:
      'بیمه مسافرت، پوشش هزینه‌های پزشکی در خارج از کشور، از دست دادن چمدان، لغو سفر و موارد اضطراری دیگر را فراهم می‌کند. با این بیمه نامه با خیال راحت سفر کنید.',
    icon: Plane,
    color: 'text-accent',
    bgColor: 'bg-accent/10',
    borderColor: 'border-accent/20',
    features: [
      { title: 'پوشش هزینه‌های درمانی در خارج از کشور' },
      { title: 'پوشش از دست دادن و تاخیر چمدان' },
      { title: 'پوشش لغو یا کوتاه کردن سفر' },
      { title: 'خدمات اضطراری ۲۴ ساعته' },
      { title: 'صدور آنلاین برای تمام کشورها' },
    ],
    heroImage: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80',
  },
];

export function getProductBySlug(slug: string): ProductConfig | undefined {
  return products.find((p) => p.slug === slug);
}

export const productSlugs = products.map((p) => p.slug);
