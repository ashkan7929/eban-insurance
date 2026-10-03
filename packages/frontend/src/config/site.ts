export interface NavLink {
  title: string;
  href: string;
}

export interface SiteConfig {
  name: string;
  nameEn: string;
  slogan: string;
  phone: string;
  phoneFormatted: string;
  supportPhone: string;
  supportPhoneFormatted: string;
  email: string;
  address: string;
  navLinks: NavLink[];
  footerLinks: {
    section: string;
    links: NavLink[];
  }[];
  socialLinks: {
    name: string;
    href: string;
  }[];
}

export const siteConfig: SiteConfig = {
  name: 'بانک بیمه ابان',
  nameEn: 'eban insurance',
  slogan: 'بیمه‌ات رو آنلاین، ساده و سریع بخر',
  phone: '021-12345678',
  phoneFormatted: '۰۲۱-۱۲۳۴۵۶۷۸',
  supportPhone: '021-88888888',
  supportPhoneFormatted: '۰۲۱-۸۸۸۸۸۸۸۸',
  email: 'info@eban-insurance.ir',
  address: 'تهران، خیابان ولیعصر، پلاک ۱۲۳۴',
  navLinks: [
    { title: 'خانه', href: '/' },
    { title: 'بیمه‌ها', href: '/insurance' },
    { title: 'پیگیری', href: '/tracking' },
    { title: 'راهنما', href: '/faq' },
    { title: 'تماس', href: '/contact' },
  ],
  footerLinks: [
    {
      section: 'خدمات',
      links: [
        { title: 'بیمه شخص ثالث', href: '/insurance/third-party' },
        { title: 'بیمه بدنه خودرو', href: '/insurance/body' },
        { title: 'بیمه عمر و حوادث', href: '/insurance/life' },
        { title: 'بیمه مسافرت', href: '/insurance/travel' },
      ],
    },
    {
      section: 'دسترسی سریع',
      links: [
        { title: 'پیگیری بیمه نامه', href: '/tracking' },
        { title: 'ثبت درخواست خسارت', href: '/claims' },
        { title: 'سوالات متداول', href: '/faq' },
        { title: 'قوانین و مقررات', href: '/terms' },
      ],
    },
    {
      section: 'درباره ما',
      links: [
        { title: 'درباره ابان', href: '/about' },
        { title: 'تماس با ما', href: '/contact' },
        { title: 'همکاری با ما', href: '/careers' },
        { title: 'بلاگ', href: '/blog' },
      ],
    },
  ],
  socialLinks: [
    { name: 'اینستاگرام', href: 'https://instagram.com/eban_insurance' },
    { name: 'تلگرام', href: 'https://t.me/eban_insurance' },
    { name: 'واتساپ', href: 'https://wa.me/982112345678' },
    { name: 'لینکدین', href: 'https://linkedin.com/company/eban-insurance' },
  ],
};
