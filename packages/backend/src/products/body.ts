import type { InsuranceProduct } from './types.js';

export const bodyProduct: InsuranceProduct = {
  slug: 'body',
  title: 'بیمه بدنه',
  description: 'پوشش کامل خسارت‌های وارده به بدنه خودرو',
  icon: 'CarFront',
  color: '#10B981',
  estimatedPriceFrom: 15000000,
  steps: [
    {
      key: 'vehicle',
      label: 'اطلاعات خودرو',
      fields: [
        { key: 'plate', label: 'شماره پلاک', type: 'text', required: true, placeholder: 'مثال: 12345678' },
        { key: 'brand', label: 'برند خودرو', type: 'text', required: true, placeholder: 'مثال: پژو' },
        { key: 'model', label: 'مدل خودرو', type: 'text', required: true, placeholder: 'مثال: 206' },
        { key: 'year', label: 'سال ساخت', type: 'number', required: true, placeholder: 'مثال: 1400' },
        { key: 'vehicleValue', label: 'ارزش خودرو (تومان)', type: 'number', required: true, placeholder: 'مثال: 500000000' },
      ],
    },
    {
      key: 'coverage',
      label: 'انتخاب پوشش‌ها',
      fields: [
        {
          key: 'plan',
          label: 'طرح اصلی',
          type: 'select',
          required: true,
          options: [
            { label: 'پایه', value: 'basic' },
            { label: 'کامل', value: 'complete' },
          ],
        },
        { key: 'theft', label: 'پوشش سرقت', type: 'select', required: false, options: [{ label: 'بله', value: 'true' }, { label: 'خیر', value: 'false' }] },
        { key: 'fire', label: 'پوشش آتش‌سوزی', type: 'select', required: false, options: [{ label: 'بله', value: 'true' }, { label: 'خیر', value: 'false' }] },
        { key: 'naturalDisaster', label: 'پوشش بلایای طبیعی', type: 'select', required: false, options: [{ label: 'بله', value: 'true' }, { label: 'خیر', value: 'false' }] },
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
    { icon: 'ShieldCheck', title: 'پوشش تصادفات', description: 'تمام خسارت‌های تصادفی' },
    { icon: 'Hammer', title: 'تعمیرگاه معتبر', description: 'تعمیر در معتبرترین مراکز' },
    { icon: 'Truck', title: 'خدمات یدک', description: 'رایگان در سراسر کشور' },
  ],
  calculateQuote(input: Record<string, any>) {
    const vehicleValue = Number(input.vehicleValue) || 0;
    const plan = input.plan === 'complete' ? 'complete' : 'basic';
    const baseRate = plan === 'basic' ? 0.015 : 0.028;
    const basePremium = vehicleValue * baseRate;

    const breakdown: { label: string; value: number }[] = [
      { label: `طرح ${plan === 'basic' ? 'پایه' : 'کامل'} (${(baseRate * 100).toFixed(1)}٪)`, value: Math.round(basePremium) },
    ];

    let total = basePremium;

    if (input.theft === 'true' || input.theft === true) {
      const theftPremium = vehicleValue * 0.003;
      breakdown.push({ label: 'پوشش سرقت (۰.۳٪)', value: Math.round(theftPremium) });
      total += theftPremium;
    }

    if (input.fire === 'true' || input.fire === true) {
      const firePremium = vehicleValue * 0.003;
      breakdown.push({ label: 'پوشش آتش‌سوزی (۰.۳٪)', value: Math.round(firePremium) });
      total += firePremium;
    }

    if (input.naturalDisaster === 'true' || input.naturalDisaster === true) {
      const ndPremium = vehicleValue * 0.003;
      breakdown.push({ label: 'پوشش بلایای طبیعی (۰.۳٪)', value: Math.round(ndPremium) });
      total += ndPremium;
    }

    return {
      amount: Math.round(total),
      breakdown,
    };
  },
};
