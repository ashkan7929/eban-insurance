import type { InsuranceProduct } from './types.js';

export const lifeProduct: InsuranceProduct = {
  slug: 'life',
  title: 'بیمه زندگی',
  description: 'آینده خانواده خود را با بیمه زندگی تضمین کنید',
  icon: 'Heart',
  color: '#EF4444',
  estimatedPriceFrom: 500000,
  steps: [
    {
      key: 'insured',
      label: 'اطلاعات بیمه‌شده',
      fields: [
        { key: 'age', label: 'سن', type: 'number', required: true, placeholder: 'مثال: 35' },
        {
          key: 'gender',
          label: 'جنسیت',
          type: 'select',
          required: true,
          options: [
            { label: 'مرد', value: 'male' },
            { label: 'زن', value: 'female' },
          ],
        },
        {
          key: 'occupation',
          label: 'شغل',
          type: 'select',
          required: true,
          options: [
            { label: 'کارمند اداری', value: 'office' },
            { label: 'کارگر', value: 'worker' },
            { label: 'آزاد', value: 'freelancer' },
            { label: 'دانشجو', value: 'student' },
            { label: 'بازنشسته', value: 'retired' },
          ],
        },
      ],
    },
    {
      key: 'coverage',
      label: 'انتخاب پوشش',
      fields: [
        { key: 'coverageAmount', label: 'مبلغ پوشش (تومان)', type: 'number', required: true, placeholder: 'مثال: 2000000000' },
        {
          key: 'coverageYears',
          label: 'مدت پوشش (سال)',
          type: 'select',
          required: true,
          options: [
            { label: '۵ سال', value: '5' },
            { label: '۱۰ سال', value: '10' },
            { label: '۱۵ سال', value: '15' },
            { label: '۲۰ سال', value: '20' },
          ],
        },
      ],
    },
    {
      key: 'customer',
      label: 'اطلاعات مشتری',
      fields: [
        { key: 'firstName', label: 'نام', type: 'text', required: true },
        { key: 'lastName', label: 'نام خانوادگی', type: 'text', required: true },
        { key: 'nationalCode', label: 'کد ملی', type: 'text', required: true, placeholder: '10 رقم' },
        { key: 'birthDate', label: 'تاریخ تولد', type: 'date', required: true },
        { key: 'mobile', label: 'شماره موبایل', type: 'tel', required: true, placeholder: '09xxxxxxxxx' },
      ],
    },
  ],
  features: [
    { icon: 'HeartPulse', title: 'پوشش عمر', description: 'پرداخت وجه فالو مرگ' },
    { icon: 'PiggyBank', title: 'سودآوری', description: 'عایدی مناسب در پایان دوره' },
    { icon: 'Users', title: 'پوشش خانواده', description: 'امانت مالی برای خانواده' },
  ],
  calculateQuote(input: Record<string, any>) {
    const coverageAmount = Number(input.coverageAmount) || 0;
    const coverageYears = Number(input.coverageYears) || 5;
    const age = Number(input.age) || 30;
    const maxAge = 80;
    const ageFactor = Math.max(maxAge - age, 1);

    const monthlyPremium = coverageAmount / (coverageYears * 12 * ageFactor);

    return {
      amount: Math.round(monthlyPremium),
      breakdown: [
        { label: 'مبلغ پوشش', value: coverageAmount },
        { label: `مدت: ${coverageYears} سال`, value: 0 },
        { label: `سن: ${age}`, value: 0 },
        { label: 'حق بیمه ماهانه', value: Math.round(monthlyPremium) },
      ],
    };
  },
};
