import type { InsuranceProduct } from './types.js';

export const thirdPartyProduct: InsuranceProduct = {
  slug: 'third-party',
  title: 'بیمه شخص ثالث',
  description: 'پوشش خسارت‌های وارده به اشخاص ثالث در تصادفات رانندگی',
  icon: 'Car',
  color: '#3B82F6',
  estimatedPriceFrom: 12500000,
  steps: [
    {
      key: 'vehicle',
      label: 'اطلاعات خودرو',
      fields: [
        { key: 'plate', label: 'شماره پلاک', type: 'text', required: true, placeholder: 'مثال: 12345678' },
        { key: 'brand', label: 'برند خودرو', type: 'text', required: true, placeholder: 'مثال: پژو' },
        { key: 'model', label: 'مدل خودرو', type: 'text', required: true, placeholder: 'مثال: 206' },
        { key: 'year', label: 'سال ساخت', type: 'number', required: true, placeholder: 'مثال: 1400' },
      ],
    },
    {
      key: 'insurance',
      label: 'اطلاعات بیمه',
      fields: [
        {
          key: 'previousCompany',
          label: 'شرکت بیمه قبلی',
          type: 'select',
          required: true,
          options: [
            { label: 'ایران', value: 'iran' },
            { label: 'آسیا', value: 'asia' },
            { label: 'پاسارگاد', value: 'pasargad' },
            { label: 'کارآفرین', value: 'karafarin' },
            { label: 'سینا', value: 'sina' },
            { label: 'دیگر', value: 'other' },
          ],
        },
        { key: 'expirationDate', label: 'تاریخ انقضا', type: 'date', required: true },
        { key: 'discountPercent', label: 'درصد تخفیف', type: 'number', required: false, placeholder: '0 تا 50' },
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
    { icon: 'Shield', title: 'پوشش خسارت جانی', description: 'تا سقف قانونی' },
    { icon: 'Wallet', title: 'پوشش خسارت مالی', description: 'تا سقف قانونی' },
    { icon: 'Clock', title: 'صدور آنی', description: 'کمتر از ۵ دقیقه' },
  ],
  calculateQuote(input: Record<string, any>) {
    const basePrice = 12500000;
    const discountPercent = Math.min(Number(input.discountPercent) || 0, 50);
    const discountAmount = (basePrice * discountPercent) / 100;
    const priceAfterDiscount = basePrice - discountAmount;
    const taxAmount = priceAfterDiscount * 0.09;
    const total = priceAfterDiscount + taxAmount;

    return {
      amount: Math.round(total),
      breakdown: [
        { label: 'قیمت پایه', value: basePrice },
        { label: `تخفیف ${discountPercent}%`, value: -Math.round(discountAmount) },
        { label: 'مالیات ۹٪', value: Math.round(taxAmount) },
      ],
    };
  },
};
