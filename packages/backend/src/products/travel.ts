import type { InsuranceProduct } from './types.js';

export const travelProduct: InsuranceProduct = {
  slug: 'travel',
  title: 'بیمه مسافرتی',
  description: 'سفر امن با پوشش کامل بیمه مسافرتی داخلی و خارجی',
  icon: 'Plane',
  color: '#8B5CF6',
  estimatedPriceFrom: 120000,
  steps: [
    {
      key: 'trip',
      label: 'اطلاعات سفر',
      fields: [
        {
          key: 'destination',
          label: 'مقصد',
          type: 'select',
          required: true,
          options: [
            { label: 'داخلی (ایران)', value: 'domestic' },
            { label: 'اروپا', value: 'europe' },
            { label: 'آمریکا', value: 'america' },
            { label: 'آسیا', value: 'asia' },
            { label: 'آفریقا', value: 'africa' },
            { label: 'اقیانوسیه', value: 'oceania' },
          ],
        },
        { key: 'departureDate', label: 'تاریخ حرکت', type: 'date', required: true },
        { key: 'returnDate', label: 'تاریخ بازگشت', type: 'date', required: true },
      ],
    },
    {
      key: 'travelers',
      label: 'مسافران',
      fields: [
        { key: 'count', label: 'تعداد مسافر', type: 'number', required: true, placeholder: 'مثال: 2' },
      ],
    },
    {
      key: 'coverage',
      label: 'انتخاب طرح',
      fields: [
        {
          key: 'plan',
          label: 'نوع طرح',
          type: 'select',
          required: true,
          options: [
            { label: 'پایه', value: 'basic' },
            { label: 'استاندارد', value: 'standard' },
            { label: 'پرمیوم', value: 'premium' },
          ],
        },
      ],
    },
  ],
  features: [
    { icon: 'Stethoscope', title: 'پوشش درمانی', description: 'هزینه‌های درمانی و بستری' },
    { icon: 'Luggage', title: 'پوشش وسایل', description: 'گم شدن یا آسیب به چمدان' },
    { icon: 'CalendarX', title: 'لغو سفر', description: 'بازپرداخت هزینه لغو سفر' },
  ],
  calculateQuote(input: Record<string, any>) {
    const departure = new Date(input.departureDate);
    const returnd = new Date(input.returnDate);
    const days = Math.max(1, Math.ceil((returnd.getTime() - departure.getTime()) / (1000 * 60 * 60 * 24)) + 1);
    const count = Math.max(1, Number(input.count) || 1);
    const plan = input.plan === 'premium' ? 'premium' : input.plan === 'standard' ? 'standard' : 'basic';
    const dailyRate = plan === 'basic' ? 120000 : plan === 'standard' ? 250000 : 420000;
    const total = days * count * dailyRate;

    return {
      amount: Math.round(total),
      breakdown: [
        { label: `مدت سفر: ${days} روز`, value: 0 },
        { label: `تعداد مسافر: ${count} نفر`, value: 0 },
        { label: `نرخ روزانه طرح ${plan === 'basic' ? 'پایه' : plan === 'standard' ? 'استاندارد' : 'پرمیوم'}`, value: dailyRate },
        { label: 'مبلغ کل', value: Math.round(total) },
      ],
    };
  },
};
