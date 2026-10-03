'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowRight,
  CircleCheck,
  CircleDashed,
  Loader2,
  FileCheck,
  FileX,
  CreditCard,
  ShieldCheck,
  Phone,
  Calendar,
  Clock,
  Upload,
  Download,
  Eye,
  FileText,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Divider } from '@/components/ui/divider';
import {
  FileUploader,
  type UploadedFile,
} from '@/components/ui/file-uploader';
import { PriceBreakdown } from '@/components/business/price-breakdown';
import { getProductBySlug } from '@/config/products';
import { cn, formatDate, formatDateTime, formatIRR } from '@/lib/utils';
import { type OrderStatus } from '@/components/business/order-card';

type OrderDetailStatus = 'pending' | 'paid' | 'processing' | 'completed' | 'failed';

const orderStatusConfig: Record<OrderDetailStatus, { label: string; variant: 'default' | 'success' | 'warning' | 'danger' | 'outline' }> = {
  pending: { label: 'در انتظار پرداخت', variant: 'warning' },
  paid: { label: 'پرداخت شده', variant: 'success' },
  processing: { label: 'در حال پردازش', variant: 'default' },
  completed: { label: 'تکمیل شده', variant: 'success' },
  failed: { label: 'لغو شده', variant: 'danger' },
};

interface TimelineStep {
  label: string;
  status: 'done' | 'current' | 'pending';
  date?: string;
}

interface PaymentRecord {
  id: string;
  amount: number;
  method: string;
  status: 'success' | 'pending' | 'failed';
  date: string;
  referenceCode: string;
}

interface DocumentRow {
  key: string;
  label: string;
  required: boolean;
  description?: string;
  file?: UploadedFile[];
  uploaded?: boolean;
  verified?: boolean;
}

interface OrderMock {
  id: number;
  orderNumber: string;
  productSlug: string;
  status: OrderDetailStatus;
  amount: number;
  createdAt: string;
  customer: {
    name: string;
    nationalCode: string;
    mobile: string;
  };
  timeline: TimelineStep[];
  payments: PaymentRecord[];
  documents: DocumentRow[];
  policyStatus: 'not-started' | 'in-progress' | 'issued';
}

const mockOrdersById: Record<string, OrderMock> = {
  '1': {
    id: 1,
    orderNumber: 'INS-14020001',
    productSlug: 'third-party',
    status: 'processing',
    amount: 4500000,
    createdAt: '2025-09-28T10:30:00Z',
    customer: {
      name: 'محمد رضایی',
      nationalCode: '0012345678',
      mobile: '09123456789',
    },
    timeline: [
      { label: 'ثبت درخواست', status: 'done', date: '2025-09-28T10:30:00Z' },
      { label: 'تکمیل اطلاعات', status: 'done', date: '2025-09-28T10:45:00Z' },
      { label: 'پرداخت', status: 'done', date: '2025-09-28T11:00:00Z' },
      { label: 'صدور بیمه‌نامه', status: 'current' },
      { label: 'تحویل', status: 'pending' },
    ],
    payments: [
      {
        id: 'pay-1',
        amount: 4500000,
        method: 'درگاه بانک ملت',
        status: 'success',
        date: '2025-09-28T11:00:00Z',
        referenceCode: '87654321',
      },
    ],
    documents: [
      {
        key: 'national_card',
        label: 'کارت ملی',
        required: true,
        description: 'تصویر رو کارت ملی',
        uploaded: true,
        verified: true,
      },
      {
        key: 'birth_certificate',
        label: 'شناسنامه',
        required: true,
        description: 'تصویر برگ شناسنامه',
        uploaded: true,
        verified: false,
      },
      {
        key: 'vehicle_card',
        label: 'کاربرنامه خودرو',
        required: true,
        description: 'تصویر جلو و پشت کاربرنامه',
        uploaded: false,
        verified: false,
      },
      {
        key: 'driver_license',
        label: 'گواهی رانندگی',
        required: false,
        description: 'اختیاری — برای بهبود سرعت صدور',
        uploaded: false,
        verified: false,
      },
    ],
    policyStatus: 'in-progress',
  },
};

const StepIcon = ({ status }: { status: TimelineStep['status'] }) => {
  if (status === 'done') {
    return <CircleCheck className="w-6 h-6 text-success" strokeWidth={2} />;
  }
  if (status === 'current') {
    return (
      <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
        <Loader2 className="w-4 h-4 text-primary animate-spin" strokeWidth={2.5} />
      </div>
    );
  }
  return <CircleDashed className="w-6 h-6 text-text-muted" strokeWidth={2} />;
};

const paymentStatusBadge: Record<PaymentRecord['status'], 'success' | 'warning' | 'danger'> = {
  success: 'success',
  pending: 'warning',
  failed: 'danger',
};
const paymentStatusLabel: Record<PaymentRecord['status'], string> = {
  success: 'موفق',
  pending: 'در انتظار',
  failed: 'ناموفق',
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string;
  const order: OrderMock = mockOrdersById[orderId] ?? mockOrdersById['1']!;
  const product = getProductBySlug(order.productSlug);

  const [documents, setDocuments] = useState<DocumentRow[]>(() =>
    order.documents.map((d) => ({ ...d, file: [] as UploadedFile[] }))
  );

  const handleFileUpload = (docKey: string, files: UploadedFile[]) => {
    setDocuments((prev) =>
      prev.map((d) =>
        d.key === docKey
          ? { ...d, file: files, uploaded: files.length > 0 }
          : d
      )
    );
  };

  const handleFileRemove = (docKey: string, fileId: string) => {
    setDocuments((prev) =>
      prev.map((d) => {
        if (d.key !== docKey) return d;
        const next = (d.file || []).filter((f) => f.id !== fileId);
        return { ...d, file: next, uploaded: next.length > 0 };
      })
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button
          variant="ghost"
          size="md"
          onClick={() => router.back()}
          className="!px-3"
        >
          <ArrowRight className="w-4 h-4" strokeWidth={2} />
        </Button>
        <div className="flex-1 min-w-0">
          <h1 className="text-xl md:text-2xl font-bold text-text truncate">
            جزئیات سفارش {order.orderNumber}
          </h1>
          <p className="text-sm text-text-muted mt-1 truncate">
            {product?.title || order.productSlug} • ثبت شده در {formatDate(order.createdAt)}
          </p>
        </div>
        <Badge
          variant={orderStatusConfig[order.status]?.variant || 'default'}
          size="md"
          className="shrink-0"
        >
          {orderStatusConfig[order.status]?.label || order.status}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6 lg:col-span-2">
          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg">اطلاعات سفارش</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-bg border border-border">
                <div>
                  <p className="text-xs text-text-muted mb-1">نوع بیمه</p>
                  <div className="flex items-center gap-2 mt-1.5">
                    {product?.icon && (
                      <div
                        className={cn(
                          'w-9 h-9 rounded-xl flex items-center justify-center shrink-0',
                          product.bgColor,
                          product.color
                        )}
                      >
                        <product.icon className="w-5 h-5" strokeWidth={2} />
                      </div>
                    )}
                    <p className="text-sm font-bold text-text">
                      {product?.title || order.productSlug}
                    </p>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-1">وضعیت</p>
                  <div className="mt-1.5">
                    <Badge
                      variant={orderStatusConfig[order.status]?.variant || 'default'}
                      size="md"
                    >
                      {orderStatusConfig[order.status]?.label || order.status}
                    </Badge>
                  </div>
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-1">شماره سفارش</p>
                  <p className="text-sm font-bold text-text mt-1">{order.orderNumber}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-1">تاریخ ثبت</p>
                  <p className="text-sm font-medium text-text mt-1 flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-text-muted" strokeWidth={2} />
                    {formatDateTime(order.createdAt)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-1">نام مشتری</p>
                  <p className="text-sm font-medium text-text mt-1">{order.customer.name}</p>
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-1">شماره موبایل</p>
                  <p
                    className="text-sm font-medium text-text mt-1 flex items-center gap-1.5"
                    dir="ltr"
                  >
                    <Phone className="w-3.5 h-3.5 text-text-muted" strokeWidth={2} />
                    {order.customer.mobile}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-text-muted mb-1">کد ملی</p>
                  <p
                    className="text-sm font-medium text-text mt-1"
                    dir="ltr"
                  >
                    {order.customer.nationalCode}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg">مراحل پردازش سفارش</CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="relative pr-2">
                <div
                  className="absolute right-[11px] top-6 bottom-6 w-0.5 bg-border"
                  aria-hidden="true"
                />
                <ol className="space-y-5">
                  {order.timeline.map((step, idx) => (
                    <li key={idx} className="relative flex items-start gap-4">
                      <div
                        className={cn(
                          'relative z-10 shrink-0 w-6 h-6 flex items-center justify-center'
                        )}
                      >
                        <StepIcon status={step.status} />
                      </div>
                      <div className="flex-1 pt-0.5 pb-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <p
                            className={cn(
                              'text-sm font-semibold',
                              step.status === 'pending' ? 'text-text-muted' : 'text-text'
                            )}
                          >
                            {step.label}
                          </p>
                          {step.status === 'current' && (
                            <Badge variant="default" size="sm">
                              در حال انجام
                            </Badge>
                          )}
                        </div>
                        {step.date && (
                          <p className="text-xs text-text-muted mt-1 flex items-center gap-1.5">
                            <Clock className="w-3 h-3" strokeWidth={2} />
                            {formatDateTime(step.date)}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg">مدارک مورد نیاز</CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-5">
              {documents.map((doc) => (
                <div
                  key={doc.key}
                  className="rounded-xl border border-border p-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h4 className="font-bold text-text">{doc.label}</h4>
                        {doc.required ? (
                          <Badge variant="danger" size="sm">الزامی</Badge>
                        ) : (
                          <Badge variant="outline" size="sm">اختیاری</Badge>
                        )}
                        {doc.uploaded && (
                          doc.verified ? (
                            <Badge variant="success" size="sm">
                              <FileCheck className="w-3 h-3 ml-1" strokeWidth={2.5} />
                              تأیید شده
                            </Badge>
                          ) : (
                            <Badge variant="warning" size="sm">
                              <Clock className="w-3 h-3 ml-1" strokeWidth={2} />
                              در حال بررسی
                            </Badge>
                          )
                        )}
                      </div>
                      {doc.description && (
                        <p className="text-xs text-text-muted mt-1">
                          {doc.description}
                        </p>
                      )}
                    </div>
                  </div>

                  <FileUploader
                    label={`${doc.label} را آپلود کنید`}
                    description="فایل را بکشید و رها کنید یا کلیک کنید"
                    accept="image/*,.pdf"
                    maxSize={5 * 1024 * 1024}
                    onUpload={(files) => handleFileUpload(doc.key, files)}
                    files={doc.file}
                    onRemove={(fileId) => handleFileRemove(doc.key, fileId)}
                  />
                </div>
              ))}
            </CardContent>
          </Card>

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" strokeWidth={2} />
                تراکنش‌های پرداخت
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="overflow-x-auto -mx-2">
                <table className="w-full text-sm min-w-[520px]">
                  <thead>
                    <tr className="text-right text-xs text-text-muted border-b border-border">
                      <th className="px-2 py-3 font-medium">کد پیگیری</th>
                      <th className="px-2 py-3 font-medium">درگاه</th>
                      <th className="px-2 py-3 font-medium">مبلغ</th>
                      <th className="px-2 py-3 font-medium">تاریخ</th>
                      <th className="px-2 py-3 font-medium">وضعیت</th>
                    </tr>
                  </thead>
                  <tbody>
                    {order.payments.map((p) => (
                      <tr
                        key={p.id}
                        className="border-b border-border last:border-b-0 hover:bg-bg/50"
                      >
                        <td className="px-2 py-3 font-medium text-text" dir="ltr">
                          {p.referenceCode}
                        </td>
                        <td className="px-2 py-3 text-text-muted">{p.method}</td>
                        <td className="px-2 py-3 font-bold text-text">
                          {formatIRR(p.amount)}
                        </td>
                        <td className="px-2 py-3 text-text-muted">
                          {formatDateTime(p.date)}
                        </td>
                        <td className="px-2 py-3">
                          <Badge
                            variant={paymentStatusBadge[p.status]}
                            size="sm"
                          >
                            {paymentStatusLabel[p.status]}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <PriceBreakdown amount={order.amount} />

          <Card className="rounded-2xl">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <ShieldCheck className="w-5 h-5 text-primary" strokeWidth={2} />
                وضعیت صدور بیمه‌نامه
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <div
                className={cn(
                  'p-4 rounded-xl border',
                  order.policyStatus === 'issued'
                    ? 'border-success/20 bg-success/5'
                    : order.policyStatus === 'in-progress'
                    ? 'border-primary/20 bg-primary/5'
                    : 'border-border bg-bg'
                )}
              >
                <div className="flex items-center gap-3 mb-2">
                  {order.policyStatus === 'issued' && (
                    <div className="w-10 h-10 rounded-full bg-success/10 text-success flex items-center justify-center">
                      <FileCheck className="w-5 h-5" strokeWidth={2} />
                    </div>
                  )}
                  {order.policyStatus === 'in-progress' && (
                    <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center">
                      <Loader2 className="w-5 h-5 animate-spin" strokeWidth={2} />
                    </div>
                  )}
                  {order.policyStatus === 'not-started' && (
                    <div className="w-10 h-10 rounded-full bg-border text-text-muted flex items-center justify-center">
                      <FileX className="w-5 h-5" strokeWidth={2} />
                    </div>
                  )}
                  <div>
                    <p className="font-bold text-text">
                      {order.policyStatus === 'issued'
                        ? 'بیمه‌نامه صادر شد'
                        : order.policyStatus === 'in-progress'
                        ? 'در حال صدور'
                        : 'آماده‌سازی نشده'}
                    </p>
                    <p className="text-xs text-text-muted mt-0.5">
                      {order.policyStatus === 'issued'
                        ? 'بیمه‌نامه شما آماده دانلود است'
                        : order.policyStatus === 'in-progress'
                        ? 'پس از بررسی مدارک، بیمه‌نامه صادر خواهد شد'
                        : 'پس از تأیید مدارک و تکمیل مراحل، صدور بیمه‌نامه آغاز می‌شود'}
                    </p>
                  </div>
                </div>
              </div>

              {order.policyStatus === 'issued' ? (
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-bg border border-border">
                    <p className="text-xs text-text-muted mb-1">شماره بیمه‌نامه</p>
                    <p className="font-bold text-text" dir="ltr">
                      EBAN-TP-1402-{order.id.toString().padStart(4, '0')}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Button variant="outline" size="md">
                      <Eye className="w-4 h-4" strokeWidth={2} />
                      مشاهده
                    </Button>
                    <Button variant="primary" size="md">
                      <Download className="w-4 h-4" strokeWidth={2} />
                      دانلود
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <div className="p-3 rounded-xl bg-bg border border-border">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-xs text-text-muted">پیشرفت</span>
                      <span className="text-xs font-bold text-text">
                        {order.policyStatus === 'in-progress' ? '۶۵٪' : '۲۰٪'}
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-border overflow-hidden">
                      <div
                        className="h-full rounded-full bg-primary transition-all"
                        style={{
                          width: order.policyStatus === 'in-progress' ? '65%' : '20%',
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {order.status === 'pending' && (
            <Button size="lg" className="w-full">
              <CreditCard className="w-4 h-4" strokeWidth={2} />
              تکمیل پرداخت
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
