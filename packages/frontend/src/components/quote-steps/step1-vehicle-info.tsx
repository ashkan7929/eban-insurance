'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { usePurchaseStore } from '@/store/purchase-store';
import { Car, Heart, Plane, ArrowLeft, User, Calendar } from 'lucide-react';

const carBrands = [
  'پژو', 'رنو', 'ایران‌خودرو', 'سایپا', 'تویوتا', 'هیوندای', 'کیا', 'نیسان', 'فورد', 'هonda', 'سوزوکی', 'مدل‌های دیگر'
];

const carModelsByBrand: Record<string, string[]> = {
  'پژو': ['۲۰۶', '۲۰۷', '۳۰۱', '۳۰۷', '۴۰۵', '۵۰۸', 'سوینگ', 'رکس'],
  'رنو': ['پارس', 'تندر', 'لودی', 'سمند', 'مگان', 'کلیو'],
  'ایران‌خودرو': ['سمند', 'سمند سورن', 'پارس', 'تارا', 'دودج', 'رانا'],
  'سایپا': ['تیبا', 'پیکان', 'ساینا', 'کارون', 'دنا', 'کوییک', 'سایپا ۱۵۱'],
  'تویوتا': ['کورولا', 'کامری', 'لندکروز', 'پرادو', 'یلوس', 'راو۴'],
  'هیوندای': ['آنتارا', 'النترا', 'سوناتا', 'سانتافه', 'توسان', 'آیکونیک'],
  'کیا': ['سراتو', 'سورنتو', 'ریو', 'اپتیم', 'کید', 'مورین'],
  'نیسان': ['سونای', 'اترنا', 'ماکسیما', 'راجل', 'نیسان‌وان'],
  'فورد': ['فوکوس', 'فوژن', 'مستانگ', 'کا', 'اسکیپ'],
  'هonda': ['سیویک', 'آکورد', 'سی‌آر‌وی', 'سیتی', 'جاز'],
  'سوزوکی': ['سوزیو', 'گرند ویتارا', 'سوئیفت', 'سوزوکی وایر'],
  'مدل‌های دیگر': ['سایر'],
};

const genders = [
  { value: 'male', label: 'مرد' },
  { value: 'female', label: 'زن' },
];

const carSchema = z.object({
  plate: z.string().min(7, 'شماره پلاک باید حداقل ۷ کاراکتر باشد').regex(/^[1-9\u06F0-\u06F9\u06F1-\u06F9a-zA-Zپچجدحخرهستصضعطغکگلمنوهیي\s]+$/, 'فرمت پلاک صحیح نیست'),
  brand: z.string().min(1, 'لطفاً برند خودرو را انتخاب کنید'),
  model: z.string().min(1, 'لطفاً مدل خودرو را انتخاب کنید'),
  year: z.string().min(4, 'سال ساخت را وارد کنید').regex(/^[1-4][0-9]{3}$/, 'سال ساخت معتبر نیست'),
});

const lifeSchema = z.object({
  age: z.string().min(1, 'سن را وارد کنید').regex(/^\d+$/, 'سن باید عددی باشد').refine((v) => {
    const n = parseInt(v, 10);
    return n >= 18 && n <= 75;
  }, 'سن باید بین ۱۸ تا ۷۵ سال باشد'),
  gender: z.string().min(1, 'لطفاً جنسیت را انتخاب کنید'),
  occupation: z.string().min(2, 'شغل را وارد کنید (حداقل ۲ کاراکتر)'),
});

const travelSchema = z.object({
  destination: z.string().min(2, 'مقصد سفر را وارد کنید'),
  departureDate: z.string().min(1, 'تاریخ رفت را انتخاب کنید'),
  returnDate: z.string().min(1, 'تاریخ برگشت را انتخاب کنید'),
}).refine((data) => {
  if (data.departureDate && data.returnDate) {
    return new Date(data.returnDate) >= new Date(data.departureDate);
  }
  return true;
}, {
  message: 'تاریخ برگشت باید بعد از تاریخ رفت باشد',
  path: ['returnDate'],
});

type CarFormValues = z.infer<typeof carSchema>;
type LifeFormValues = z.infer<typeof lifeSchema>;
type TravelFormValues = z.infer<typeof travelSchema>;

export interface Step1VehicleInfoProps {
  slug: string;
}

export function Step1VehicleInfo({ slug }: Step1VehicleInfoProps) {
  const isCar = slug === 'third-party' || slug === 'body';
  const isLife = slug === 'life';
  const isTravel = slug === 'travel';

  const schema = isCar ? carSchema : isLife ? lifeSchema : travelSchema;
  const store = usePurchaseStore();

  const existing = store.quoteData.vehicle;

  const methods = useForm<any>({
    resolver: zodResolver(schema),
    defaultValues: existing ? {
      ...existing,
    } : isCar ? {
      plate: '',
      brand: '',
      model: '',
      year: '',
    } : isLife ? {
      age: '',
      gender: '',
      occupation: '',
    } : {
      destination: '',
      departureDate: '',
      returnDate: '',
    },
    mode: 'onChange',
  });

  const {
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = methods;

  const selectedBrand = watch('brand') as string | undefined;
  const models: string[] = (selectedBrand && carModelsByBrand[selectedBrand]) || [];

  const Icon = isCar ? Car : isLife ? Heart : Plane;
  const title = isCar ? 'اطلاعات خودرو' : isLife ? 'اطلاعات بیمه‌شده' : 'اطلاعات سفر';
  const subtitle = isCar
    ? 'جزئیات خودروی خود را وارد کنید تا قیمت دقیق محاسبه شود'
    : isLife
    ? 'اطلاعات فردی بیمه‌شده را وارد کنید'
    : 'جزئیات سفر خود را مشخص کنید';

  const onSubmit = async (values: any) => {
    store.setVehicleData(values);
    store.nextStep();
  };

  return (
    <Card className="rounded-2xl shadow-card border-border">
      <CardContent className="p-6 sm:p-8">
        <div className="flex items-start gap-4 mb-8">
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <Icon className="h-6 w-6" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-text mb-1">۱. {title}</h2>
            <p className="text-sm text-text-muted">{subtitle}</p>
          </div>
        </div>

        <FormProvider {...methods}>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {isCar && (
              <>
                <Input
                  label="شماره پلاک خودرو"
                  placeholder="مثال: ۱۲ب۳۴۵ایران ۶۷"
                  helperText="شماره پلاک را به صورت کامل وارد کنید"
                  error={!!errors.plate}
                  errorMessage={errors.plate?.message as string}
                  {...methods.register('plate')}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <Select
                      label="برند خودرو"
                      error={!!errors.brand}
                      errorMessage={errors.brand?.message as string}
                      {...methods.register('brand')}
                    >
                      <option value="">انتخاب برند</option>
                      {carBrands.map((brand) => (
                        <option key={brand} value={brand}>{brand}</option>
                      ))}
                    </Select>
                  </div>

                  <div>
                    <Select
                      label="مدل خودرو"
                      disabled={!selectedBrand}
                      error={!!errors.model}
                      errorMessage={errors.model?.message as string}
                      {...methods.register('model')}
                    >
                      <option value="">{selectedBrand ? 'انتخاب مدل' : 'ابتدا برند را انتخاب کنید'}</option>
                      {models.map((m) => (
                        <option key={m} value={m}>{m}</option>
                      ))}
                    </Select>
                  </div>
                </div>

                <div>
                  <Input
                    label="سال ساخت"
                    type="number"
                    placeholder="مثال: ۱۴۰۲"
                    helperText="بر اساس سال شمسی"
                    error={!!errors.year}
                    errorMessage={errors.year?.message as string}
                    {...methods.register('year')}
                  />
                </div>
              </>
            )}

            {isLife && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input
                    label="سن"
                    type="number"
                    placeholder="مثال: ۳۵"
                    leftIcon={<User className="h-4 w-4" />}
                    helperText="بین ۱۸ تا ۷۵ سال"
                    error={!!errors.age}
                    errorMessage={errors.age?.message as string}
                    {...methods.register('age')}
                  />

                  <Select
                    label="جنسیت"
                    error={!!errors.gender}
                    errorMessage={errors.gender?.message as string}
                    {...methods.register('gender')}
                  >
                    <option value="">انتخاب جنسیت</option>
                    {genders.map((g) => (
                      <option key={g.value} value={g.value}>{g.label}</option>
                    ))}
                  </Select>
                </div>

                <Input
                  label="شغل"
                  placeholder="مثال: مهندس نرم‌افزار"
                  helperText="شغل فعلی خود را وارد کنید"
                  error={!!errors.occupation}
                  errorMessage={errors.occupation?.message as string}
                  {...methods.register('occupation')}
                />
              </>
            )}

            {isTravel && (
              <>
                <Input
                  label="مقصد سفر"
                  placeholder="مثال: ترکیه، آلمان، دبی"
                  helperText="کشور یا شهر مقصد را وارد کنید"
                  leftIcon={<Plane className="h-4 w-4" />}
                  error={!!errors.destination}
                  errorMessage={errors.destination?.message as string}
                  {...methods.register('destination')}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <Input
                    label="تاریخ رفت"
                    type="date"
                    leftIcon={<Calendar className="h-4 w-4" />}
                    error={!!errors.departureDate}
                    errorMessage={errors.departureDate?.message as string}
                    {...methods.register('departureDate')}
                  />

                  <Input
                    label="تاریخ برگشت"
                    type="date"
                    leftIcon={<Calendar className="h-4 w-4" />}
                    error={!!errors.returnDate}
                    errorMessage={errors.returnDate?.message as string}
                    {...methods.register('returnDate')}
                  />
                </div>
              </>
            )}

            <div className="pt-6 flex justify-end">
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'در حال پردازش...' : 'ادامه'}
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  );
}

export default Step1VehicleInfo;
