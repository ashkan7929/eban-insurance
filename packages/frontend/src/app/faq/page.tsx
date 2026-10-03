'use client';

import { useState, useMemo } from 'react';
import { Header } from '@/components/layout/header';
import { Footer } from '@/components/layout/footer';
import { MobileBottomNav } from '@/components/layout/mobile-bottom-nav';
import { PageHeader } from '@/components/layout/page-header';
import { Container } from '@/components/ui/container';
import { Section } from '@/components/ui/section';
import { Card, CardContent } from '@/components/ui/card';
import { Accordion } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Search, HelpCircle, MessageCircle, FileQuestion } from 'lucide-react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

type FaqCategory = 'general' | 'purchase' | 'payment' | 'claims' | 'after-sales';

interface FaqItem {
  id: string;
  category: FaqCategory;
  title: string;
  content: string;
}

const categoryChips: {
  key: 'all' | FaqCategory;
  label: string;
}[] = [
  { key: 'all', label: 'همه سؤالات' },
  { key: 'general', label: 'عمومی' },
  { key: 'purchase', label: 'فرآیند خرید' },
  { key: 'payment', label: 'پرداخت و مالی' },
  { key: 'claims', label: 'خسارت و پوشش' },
  { key: 'after-sales', label: 'پس از فروش' },
];

const faqItems: FaqItem[] = [
  {
    id: 'g1',
    category: 'general',
    title: 'بانک بیمه ابان چیست و چه خدماتی ارائه می‌دهد؟',
    content:
      'بانک بیمه ابان یک پلتفرم آنلاین معتبر برای خرید و مدیریت انواع بیمه‌ها است. ما به عنوان واسط بین شما و معتبرترین شرکت‌های بیمه کشور عمل می‌کنیم و امکان خرید آسان، سریع و امن بیمه شخص ثالث، بدنه خودرو، عمر و حوادث و مسافرت را فراهم می‌کنیم. همچنین خدمات پیگیری سفارش، مدیریت بیمه‌نامه‌ها و پشتیبانی ۲۴ ساعته ارائه می‌دهیم.',
  },
  {
    id: 'g2',
    category: 'general',
    title: 'آیا این پلتفرم دارای مجوز رسمی از بیمه مرکزی است؟',
    content:
      'بله. بانک بیمه ابان دارای کلیه مجوزهای لازم از سازمان بیمه مرکزی جمهوری اسلامی ایران و سامانه ثبت شرکت‌ها می‌باشد. کلیه بیمه‌نامه‌هایی که از طریق ما خریداری می‌شوند، مستقیماً توسط شرکت‌های بیمه همکار و تحت نظارت بیمه مرکزی صادر می‌شوند و کاملاً معتبر و قانونی هستند.',
  },
  {
    id: 'g3',
    category: 'general',
    title: 'اطلاعات من در این پلتفرم ایمن است؟',
    content:
      'بله. حریم خصوصی کاربران برای ما اولویت بالایی دارد. کلیه اطلاعات شما با استفاده از پروتکل رمزنگاری SSL ۲۵۶ بیتی محفوظ است و سرورهای ما در مراکز داده امن با دیواره آتش چندلایه مستقر هستند. اطلاعات شخصی شما بدون رضایت شما در اختیار هیچ شخص ثالثی قرار نمی‌گیرد.',
  },
  {
    id: 'g4',
    category: 'general',
    title: 'آیا خرید بیمه از طریق این پلتفرم اقتصادی‌تر است؟',
    content:
      'بله. به دلیل حذف دلالی‌ها و واسطه‌های زائد در فرآیند خرید آنلاین، شما معمولاً بیمه را با قیمت بهتر و تخفیف بیشتری نسبت به روش سنتی خریداری می‌کنید. همچنین ما تخفیف‌های ویژه و کمپین‌هایی را به صورت منظم ارائه می‌دهیم.',
  },
  {
    id: 'p1',
    category: 'purchase',
    title: 'چگونه می‌توانم بیمه خریداری کنم؟',
    content:
      'فرآیند خرید بسیار ساده است: (۱) وارد صفحه بیمه شوید و نوع بیمه مورد نظر را انتخاب کنید. (۲) فرم اطلاعاتی را تکمیل کنید. (۳) طرح‌های پیشنهادی شرکت‌های مختلف را مقایسه کنید و بهترین گزینه را انتخاب کنید. (۴) از طریق درگاه امن پرداخت، مبلغ را واریز کنید. (۵) بیمه‌نامه شما به صورت فوری صادر و به پنل کاربری و ایمیل شما ارسال می‌شود.',
  },
  {
    id: 'p2',
    category: 'purchase',
    title: 'آیا برای خرید نیاز به ثبت‌نام دارم؟',
    content:
      'بله، برای ثبت سفارش و دسترسی به بیمه‌نامه، باید در سایت عضو شوید. ثبت‌نام بسیار سریع است و فقط با وارد کردن شماره موبایل و تأیید کد پیامکی انجام می‌شود. شما می‌توانید در حین خرید، بدون ثبت‌نام طرح‌ها و قیمت‌ها را مشاهده کنید.',
  },
  {
    id: 'p3',
    category: 'purchase',
    title: 'آیا می‌توانم بیمه را برای شخص دیگری بخرم؟',
    content:
      'بله، شما می‌توانید برای والدین، همسر، دوستان یا هر شخص دیگری بیمه خریداری کنید. کافی است اطلاعات بیمه‌گذار (شخصی که بیمه به نام او ثبت می‌شود) را به درستی وارد کنید. توجه داشته باشید که پرداخت توسط شما انجام می‌شود اما بیمه‌نامه به نام بیمه‌گذار صادر می‌شود.',
  },
  {
    id: 'p4',
    category: 'purchase',
    title: 'مدت زمان صدور بیمه‌نامه چقدر است؟',
    content:
      'بیمه‌های شخص ثالث و بدنه معمولاً بلافاصله پس از پرداخت و تکمیل مدارک، به صورت آنی و فوری صادر می‌شوند. برای بیمه‌های عمر و مسافرت نیز در اکثر موارد صدور فوری است و حداکثر ۲ ساعت طول می‌کشد. در مواردی که نیاز به بررسی‌های بیشتری باشد، مدت زمان بیشتری لازم است.',
  },
  {
    id: 'p5',
    category: 'purchase',
    title: 'آیا می‌توانم درخواست خرید خود را کنسل کنم؟',
    content:
      'بله. تا قبل از پرداخت، می‌توانید سفارش را به راحتی کنسل کنید. پس از پرداخت نیز طبق قوانین بیمه، شما حق انصراف قانونی دارید و مبلغ پرداختی پس از کسر مقرراتی به شما بازگردانده می‌شود. برای جزئیات بیشتر با پشتیبانی تماس بگیرید.',
  },
  {
    id: 'py1',
    category: 'payment',
    title: 'چه روش‌های پرداختی پشتیبانی می‌شوند؟',
    content:
      'پرداخت از طریق کلیه کارت‌های عضو شتاب (بانک‌های دولتی و خصوصی)، درگاه‌های پرداخت آنلاین بانک ملی، ملت، صادرات، پاسارگاد و سپهر امکان‌پذیر است. همچنین در آینده نزدیک امکان پرداخت اقساطی نیز اضافه خواهد شد.',
  },
  {
    id: 'py2',
    category: 'payment',
    title: 'آیا پرداخت در این پلتفرم امن است؟',
    content:
      'کلیه پرداخت‌ها از طریق درگاه‌های امن و رمزنگاری‌شده بانکی انجام می‌شود و ما هیچ‌گاه اطلاعات کارت شما را در سرورهای خود ذخیره نمی‌کنیم. پس از پرداخت موفق، رسید دیجیتالی تراکنش به شما نمایش داده و ایمیل می‌شود که به عنوان مدرک پرداخت معتبر است.',
  },
  {
    id: 'py3',
    category: 'payment',
    title: 'اگر پرداخت ناموفق بود، مبلغ به حساب من برمی‌گردد؟',
    content:
      'بله. در صورت وقوع هرگونه خطا در فرآیند پرداخت و کسر شدن مبلغ از حساب شما، بنا به قوانین بانکی مبلغ کسر شده به صورت خودکار حداکثر ظرف ۷۲ ساعت کاری به حساب شما بازگردانده می‌شود. در صورت تاخیر، با پشتیبانی ما تماس بگیرید.',
  },
  {
    id: 'py4',
    category: 'payment',
    title: 'آیا فاکتور رسمی دریافت می‌کنم؟',
    content:
      'بله. بلافاصله پس از پرداخت موفق، رسید دیجیتالی پرداخت و سپس فاکتور رسمی بیمه‌نامه به صورت الکترونیکی در پنل کاربری شما قرار می‌گیرد و به ایمیلتان نیز ارسال می‌شود. این فاکتورها دارای بارکد و کد رهگیری رسمی هستند.',
  },
  {
    id: 'c1',
    category: 'claims',
    title: 'در صورت وقوع تصادف یا حادثه چه کار باید کنم؟',
    content:
      'در اولین فرصت با پشتیبانی ۲۴ ساعته ما تماس بگیرید. کارشناسان ما شما را در تمام مراحل راهنمایی می‌کنند. همچنین بهتر است قبل از هر کاری، تصویر و فیلم کامل از محل حادثه و خسارت تهیه کنید و اطلاعات طرفین را ثبت کنید. سپس فرآیند ثبت خسارت شروع می‌شود.',
  },
  {
    id: 'c2',
    category: 'claims',
    title: 'چگونه خسارت خود را ثبت کنم؟',
    content:
      'شما می‌توانید خسارت را از طریق سه راه ثبت کنید: (۱) تماس تلفنی با پشتیبانی ۲۴ ساعته، (۲) از طریق پنل کاربری در بخش «ثبت درخواست خسارت»، (۳) از طریق چت آنلاین در وب‌سایت. پس از ثبت، کارشناس شرکت بیمه تعیین وقت بازرسی می‌کند.',
  },
  {
    id: 'c3',
    category: 'claims',
    title: 'مدت زمان رسیدگی به خسارت چقدر است؟',
    content:
      'زمان رسیدگی به خسارت به نوع بیمه و حجم خسارت بستگی دارد. برای بیمه شخص ثالث معمولاً ۵ تا ۱۰ روز کاری و برای بیمه بدنه ۷ تا ۱۵ روز کاری طول می‌کشد. شرکت‌های بیمه متعهد هستند که حداکثر ظرف ۳۰ روز خسارت‌ها را تسویه کنند.',
  },
  {
    id: 'as1',
    category: 'after-sales',
    title: 'چگونه می‌توانم بیمه‌نامه خود را تمدید کنم؟',
    content:
      'شما می‌توانید ۳۰ روز قبل از تاریخ انقضا، از پنل کاربری خود در بخش «بیمه‌نامه‌های من»، با چند کلیک بیمه‌نامه خود را تمدید کنید. ما ۳۰، ۱۵ و ۱ روز مانده به انقضا با ارسال پیامک و ایمیل به شما یادآوری می‌کنیم. تمدید آنی است و بیمه‌نامه جدید بلافاصله صادر می‌شود.',
  },
  {
    id: 'as2',
    category: 'after-sales',
    title: 'آیا می‌توانم اطلاعات بیمه‌نامه را بعد از خرید تغییر دهم؟',
    content:
      'بعضی از اطلاعات مثل آدرس، نام و... قابل تغییر هستند و برای برخی موارد مثل نوع خودرو در بیمه بدنه، محدودیت وجود دارد. برای هرگونه تغییر در اطلاعات بیمه‌نامه، با پشتیبانی تماس بگیرید یا درخواست خود را از پنل کاربری ثبت کنید. در برخی موارد مالی ممکن است نیاز به پرداخت یا بازگشت وجه باشد.',
  },
  {
    id: 'as3',
    category: 'after-sales',
    title: 'پشتیبانی در چه ساعتی پاسخگو است؟',
    content:
      'تیم پشتیبانی ما ۷ روز هفته و ۲۴ ساعت شبانه‌روز (از جمله ایام تعطیل) آماده پاسخگویی به شما هستند. برای موارد غیرضروری و پرسش‌های عمومی، ایمیل ارسال کنید که حداکثر ۲۴ ساعت کاری به آن پاسخ داده می‌شود.',
  },
  {
    id: 'as4',
    category: 'after-sales',
    title: 'اگر به درستی پاسخگویی نشویم چه کار کنم؟',
    content:
      'ما همیشه در جلب رضایت شما سعی می‌کنیم. اما در صورت عدم رضایت از پاسخ پشتیبانی سطح اول، می‌توانید درخواست ارجاع به کارشناس ارشد یا مدیر پشتیبانی را داشته باشید. همچنین فرم تماس در صفحه «تماس با ما» برای ثبت شکایات و پیشنهادات در نظر گرفته شده است.',
  },
];

export default function FaqPage() {
  const [activeCategory, setActiveCategory] = useState<'all' | FaqCategory>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredItems = useMemo(() => {
    let list = faqItems;

    if (activeCategory !== 'all') {
      list = list.filter((f) => f.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.trim();
      list = list.filter(
        (f) =>
          f.title.includes(q) ||
          f.content.includes(q)
      );
    }

    return list;
  }, [activeCategory, searchQuery]);

  const accordionItems = filteredItems.map((f) => ({
    id: f.id,
    title: f.title,
    content: (
      <p className="leading-8 text-sm text-text-muted">{f.content}</p>
    ),
  }));

  return (
    <main className="flex flex-col min-h-screen">
      <Header />
      <PageHeader
        title="سؤالات متداول"
        subtitle="پاسخ اکثر سؤالات خود را در این بخش پیدا کنید"
        breadcrumb={[
          { label: 'خانه', href: '/' },
          { label: 'سؤالات متداول' },
        ]}
      />

      <Section>
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 md:gap-8">
          <aside className="lg:col-span-1 space-y-4 lg:sticky lg:top-28 self-start">
            <Card className="rounded-2xl">
              <CardContent className="p-5 space-y-4">
                <Input
                  placeholder="جستجو در سؤالات..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  leftIcon={<Search className="w-4 h-4" strokeWidth={2} />}
                />

                <div>
                  <p className="text-xs text-text-muted mb-3 font-medium">
                    دسته‌بندی‌ها
                  </p>
                  <nav className="space-y-1">
                    {categoryChips.map((chip) => {
                      const active = activeCategory === chip.key;
                      const count =
                        chip.key === 'all'
                          ? faqItems.length
                          : faqItems.filter((f) => f.category === chip.key).length;
                      return (
                        <button
                          type="button"
                          key={chip.key}
                          onClick={() => setActiveCategory(chip.key)}
                          className={cn(
                            'w-full flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                            active
                              ? 'bg-primary text-white shadow-sm'
                              : 'text-text-muted hover:bg-bg hover:text-text'
                          )}
                        >
                          <span>{chip.label}</span>
                          <Badge
                            variant={active ? 'outline' : 'default'}
                            size="sm"
                            className={cn(
                              active && 'bg-white/20 text-white border-white/30'
                            )}
                          >
                            {count}
                          </Badge>
                        </button>
                      );
                    })}
                  </nav>
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-primary/20 bg-primary/[0.02]">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <MessageCircle className="w-5 h-5" strokeWidth={2} />
                  </div>
                  <div>
                    <h4 className="font-bold text-text">پاسخ سوال خود را پیدا نکردید؟</h4>
                    <p className="text-xs text-text-muted mt-0.5">
                      با تیم پشتیبانی ما تماس بگیرید
                    </p>
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row lg:flex-col gap-2">
                  <Link href="/contact" className="flex-1">
                    <Button variant="outline" size="md" className="w-full">
                      تماس با ما
                    </Button>
                  </Link>
                  <a
                    href="tel:02188888888"
                    dir="ltr"
                    className="flex-1"
                  >
                    <Button size="md" className="w-full">
                      ۰۲۱-۸۸۸۸۸۸۸۸
                    </Button>
                  </a>
                </div>
              </CardContent>
            </Card>
          </aside>

          <div className="lg:col-span-3 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 lg:hidden">
              <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
                {categoryChips.map((chip) => {
                  const active = activeCategory === chip.key;
                  return (
                    <button
                      type="button"
                      key={chip.key}
                      onClick={() => setActiveCategory(chip.key)}
                      className={cn(
                        'shrink-0 inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-medium transition-all',
                        active
                          ? 'bg-primary text-white shadow-sm'
                          : 'bg-bg text-text-muted hover:bg-border/60'
                      )}
                    >
                      {chip.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {accordionItems.length === 0 ? (
              <Card className="rounded-2xl">
                <CardContent className="py-16 text-center">
                  <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-bg flex items-center justify-center">
                    <FileQuestion className="w-8 h-8 text-text-muted" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-base font-bold text-text mb-2">
                    سؤالی یافت نشد
                  </h3>
                  <p className="text-sm text-text-muted max-w-sm mx-auto mb-5">
                    با معیارهای جستجوی شما هیچ سؤالی مطابقت نداشت.
                  </p>
                  <Button
                    variant="outline"
                    size="md"
                    onClick={() => {
                      setActiveCategory('all');
                      setSearchQuery('');
                    }}
                  >
                    پاک کردن فیلترها
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <>
                <div className="flex items-center gap-2 mb-2">
                  <HelpCircle className="w-4 h-4 text-primary" strokeWidth={2.5} />
                  <span className="text-sm font-medium text-text">
                    {accordionItems.length} سؤال در این دسته‌بندی یافت شد
                  </span>
                </div>
                <Accordion
                  items={accordionItems}
                  allowMultiple
                />
              </>
            )}
          </div>
        </div>
      </Section>

      <Footer />
      <MobileBottomNav />
    </main>
  );
}
