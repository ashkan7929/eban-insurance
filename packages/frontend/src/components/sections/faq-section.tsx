'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Section } from '@/components/ui/section';
import { cn } from '@/lib/utils';

const containerVariants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.45, ease: 'easeOut' },
  },
};

interface FaqItem {
  question: string;
  answer: string;
}

const faqItems: FaqItem[] = [
  {
    question: 'بیمه شخص ثالث چیست؟',
    answer:
      'بیمه شخص ثالث یا مسئولیت مدنی راننده، خسارت‌های مالی و جانی ناشی از تصادفات وارده به اشخاص ثالث را پوشش می‌دهد. این بیمه به صورت قانونی الزامی است و باید قبل از استفاده از خودرو خریداری شود. در صورت بروز حادثه، خسارت وارده به خودروهای دیگر و زخمیان تصادف از طریق این بیمه جبران می‌شود.',
  },
  {
    question: 'قیمت بیمه چگونه محاسبه می‌شود؟',
    answer:
      'قیمت بیمه بر اساس عوامل مختلفی محاسبه می‌شود. برای بیمه خودرو: نوع خودرو، سال ساخت، سوابق خسارت و تخفیف‌های سالانه مؤثر است. برای بیمه عمر: سن، وضعیت سلامتی، میزان پوشش و دوره بیمه‌نامه مؤثر است. برای بیمه مسافرت: مقصد سفر، مدت سفر، سن بیمه‌گذار و نوع پوشش انتخابی. سیستم ما به صورت آنلاین قیمت‌ها را از تمام شرکت‌های بیمه دریافت و مقایسه می‌کند.',
  },
  {
    question: 'تخفیف بیمه چگونه اعمال می‌شود؟',
    answer:
      'تخفیف‌های بیمه به几种 صورت محاسبه می‌شوند: تخفیف عدم خسارت (۱۰٪ تا ۶۰٪ در بیمه شخص ثالث بر اساس تعداد سال بدون خسارت)، تخفیف‌های ویژه دوره‌ای شرکت‌های بیمه، تخفیف خرید آنلاین و تخفیف‌های مشتریان ویژه. تمام تخفیف‌ها به صورت خودکار در محاسبه قیمت اعمال و در نتیجه نهایی نمایش داده می‌شوند.',
  },
  {
    question: 'بعد از پرداخت چه اتفاقی می‌افتد؟',
    answer:
      'بلافاصله پس از تأیید پرداخت، بیمه‌نامه الکترونیکی شما در سیستم صادر می‌شود. یک کپی از بیمه‌نامه به ایمیل و شماره موبایل شما ارسال می‌شود و همچنین در پنل کاربری شما در بخش «بیمه‌نامه‌های من» قابل دسترسی است. برای بیمه‌های خودرو، اطلاعات بیمه‌نامه به طور خودکار به سامانه راهنمایی و رانندگی ارسال و ثبت می‌شود.',
  },
  {
    question: 'بیمه‌نامه الکترونیکی معتبر است؟',
    answer:
      'بله، بیمه‌نامه‌های الکترونیکی صادر شده از سامانه‌های معتبر، بر اساس «آیین‌نامه بیمه‌نامه الکترونیکی» مصوب مجلس و با تأیید بیمه مرکزی جمهوری اسلامی ایران، دارای اعتبار کامل قانونی هستند و نیازی به چاپ و ارائه نسخه کاغذی ندارند. کافی است شماره بیمه‌نامه یا نسخه دیجیتال آن را همراه داشته باشید.',
  },
  {
    question: 'می‌توانم اطلاعات رو بعداً ویرایش کنم؟',
    answer:
      'قبل از صدور نهایی بیمه‌نامه، می‌توانید تمام اطلاعات را اصلاح کنید. پس از صدور، برای اصلاح جزئیات مانند تغییر نشانی، تغییر شماره پلاک (در بیمه خودرو) یا تصحیح اطلاعات شخصی، می‌توانید از طریق پنل کاربری درخواست اصلاح بیمه‌نامه ثبت کنید یا با پشتیبانی تماس بگیرید. تغییرات اساسی ممکن است مستلزم پرداخت مابه‌التفاوت حق بیمه باشد.',
  },
];

interface FaqAccordionItemProps {
  item: FaqItem;
  isOpen: boolean;
  onToggle: () => void;
}

function FaqAccordionItem({ item, isOpen, onToggle }: FaqAccordionItemProps) {
  return (
    <motion.div
      variants={itemVariants}
      className={cn(
        'rounded-2xl border bg-card transition-all duration-300',
        isOpen
          ? 'border-primary/30 shadow-card-lg'
          : 'border-border hover:border-primary/15'
      )}
    >
      <button
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 p-5 md:p-6 text-right"
      >
        <span className="font-bold text-text md:text-base text-sm leading-relaxed">
          {item.question}
        </span>
        <ChevronDown
          className={cn(
            'h-5 w-5 shrink-0 text-primary transition-transform duration-300',
            isOpen && 'rotate-180'
          )}
          strokeWidth={2.25}
        />
      </button>

      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial={{ height: 0, opacity: 0 }}
            animate={{
              height: 'auto',
              opacity: 1,
              transition: {
                height: { duration: 0.35, ease: 'easeOut' },
                opacity: { duration: 0.25, delay: 0.08, ease: 'easeOut' },
              },
            }}
            exit={{
              height: 0,
              opacity: 0,
              transition: {
                height: { duration: 0.3, ease: 'easeIn' },
                opacity: { duration: 0.15, ease: 'easeIn' },
              },
            }}
            className="overflow-hidden"
          >
            <div className="px-5 md:px-6 pb-5 md:pb-6 pt-0">
              <p className="text-sm md:text-base text-text-muted leading-8">
                {item.answer}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export function FaqSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const handleToggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <Section eyebrow="سؤالات متداول" title="قبل از خرید، سؤالی داری؟">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: '-80px' }}
        className="mt-10 space-y-3"
      >
        {faqItems.map((item, i) => (
          <FaqAccordionItem
            key={item.question}
            item={item}
            isOpen={openIndex === i}
            onToggle={() => handleToggle(i)}
          />
        ))}
      </motion.div>
    </Section>
  );
}

export default FaqSection;
