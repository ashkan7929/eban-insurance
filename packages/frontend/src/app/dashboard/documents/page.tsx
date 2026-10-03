'use client';

import { useState } from 'react';
import {
  Upload,
  FileText,
  Image,
  FileCheck,
  FileX,
  Clock,
  Trash2,
  Download,
  Eye,
  Plus,
  Search,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  FileUploader,
  type UploadedFile,
} from '@/components/ui/file-uploader';
import { cn, formatDate } from '@/lib/utils';

type DocStatus = 'verified' | 'pending' | 'rejected' | 'expiring';

interface DocumentItem {
  id: string;
  name: string;
  type: string;
  size: string;
  status: DocStatus;
  category: string;
  uploadedAt: string;
  fileType: 'pdf' | 'image' | 'other';
  verifiedAt?: string;
  note?: string;
}

const initialDocuments: DocumentItem[] = [
  {
    id: '1',
    name: 'کارت‌ملی_محمد_رضایی.pdf',
    type: 'PDF',
    size: '۱.۲ مگابایت',
    status: 'verified',
    category: 'کارت ملی',
    uploadedAt: '2025-09-01',
    fileType: 'pdf',
    verifiedAt: '2025-09-02',
  },
  {
    id: '2',
    name: 'شناسنامه_صفحه_اول.jpg',
    type: 'JPG',
    size: '۸۵۰ کیلوبایت',
    status: 'pending',
    category: 'شناسنامه',
    uploadedAt: '2025-09-28',
    fileType: 'image',
  },
  {
    id: '3',
    name: 'کاربرنامه_جلو.jpg',
    type: 'JPG',
    size: '۶۵۰ کیلوبایت',
    status: 'verified',
    category: 'کاربرنامه خودرو',
    uploadedAt: '2025-09-10',
    fileType: 'image',
    verifiedAt: '2025-09-11',
  },
  {
    id: '4',
    name: 'کاربرنامه_پشت.jpg',
    type: 'JPG',
    size: '۷۰۰ کیلوبایت',
    status: 'rejected',
    category: 'کاربرنامه خودرو',
    uploadedAt: '2025-09-27',
    fileType: 'image',
    note: 'کیفیت تصویر پایین است، لطفا مجدد آپلود کنید.',
  },
  {
    id: '5',
    name: 'گواهی_رانندگی.pdf',
    type: 'PDF',
    size: '۵۰۰ کیلوبایت',
    status: 'verified',
    category: 'گواهی رانندگی',
    uploadedAt: '2025-09-05',
    fileType: 'pdf',
    verifiedAt: '2025-09-06',
  },
];

const statusConfig: Record<DocStatus, { label: string; variant: 'success' | 'warning' | 'danger' | 'default'; icon: typeof FileCheck }> = {
  verified: { label: 'تأیید شده', variant: 'success', icon: FileCheck },
  pending: { label: 'در حال بررسی', variant: 'warning', icon: Clock },
  rejected: { label: 'رد شده', variant: 'danger', icon: FileX },
  expiring: { label: 'در حال انقضا', variant: 'default', icon: Clock },
};

function getFileIcon(fileType: DocumentItem['fileType']) {
  if (fileType === 'image') return Image;
  return FileText;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments);
  const [showUploader, setShowUploader] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<UploadedFile[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const handleUpload = (files: UploadedFile[]) => {
    setPendingFiles(files);
  };

  const handleRemove = (fileId: string) => {
    setPendingFiles((prev) => prev.filter((f) => f.id !== fileId));
  };

  const handleConfirmUpload = () => {
    if (pendingFiles.length === 0) return;
    const newDocs: DocumentItem[] = pendingFiles.map((f, idx) => ({
      id: `new-${Date.now()}-${idx}`,
      name: f.name,
      type: (f.type.split('/')[1] || 'FILE').toUpperCase(),
      size: f.size < 1024
        ? `${f.size} بایت`
        : f.size < 1024 * 1024
        ? `${(f.size / 1024).toFixed(1)} کیلوبایت`
        : `${(f.size / (1024 * 1024)).toFixed(1)} مگابایت`,
      status: 'pending',
      category: 'سایر مدارک',
      uploadedAt: new Date().toISOString(),
      fileType: f.type.startsWith('image/') ? 'image' : f.type.includes('pdf') ? 'pdf' : 'other',
    }));
    setDocuments((prev) => [...newDocs, ...prev]);
    setPendingFiles([]);
    setShowUploader(false);
  };

  const handleDelete = (id: string) => {
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  const filteredDocs = documents.filter((d) =>
    d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const stats = {
    verified: documents.filter((d) => d.status === 'verified').length,
    pending: documents.filter((d) => d.status === 'pending').length,
    rejected: documents.filter((d) => d.status === 'rejected').length,
    total: documents.length,
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl md:text-2xl font-bold text-text">مدارک من</h1>
          <p className="text-sm text-text-muted mt-1">
            آپلود و مدیریت مدارک هویتی و بیمه‌ای شما
          </p>
        </div>
        <Button
          size="md"
          onClick={() => setShowUploader((v) => !v)}
          className={cn(showUploader && 'hidden sm:inline-flex')}
        >
          <Plus className="w-4 h-4" strokeWidth={2.5} />
          آپلود مدرک جدید
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'کل مدارک', value: stats.total, variant: 'default' as const, color: 'bg-primary/10 text-primary' },
          { label: 'تأیید شده', value: stats.verified, variant: 'success' as const, color: 'bg-success/10 text-success' },
          { label: 'در بررسی', value: stats.pending, variant: 'warning' as const, color: 'bg-warning/10 text-warning' },
          { label: 'رد شده', value: stats.rejected, variant: 'danger' as const, color: 'bg-danger/10 text-danger' },
        ].map((s) => (
          <Card key={s.label} className="rounded-2xl">
            <CardContent className="p-4">
              <p className="text-xs text-text-muted mb-1.5">{s.label}</p>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-bold text-text">
                  {new Intl.NumberFormat('fa-IR').format(s.value)}
                </p>
                <div
                  className={cn(
                    'w-10 h-10 rounded-xl flex items-center justify-center',
                    s.color
                  )}
                >
                  <FileText className="w-5 h-5" strokeWidth={2} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {showUploader && (
        <Card className="rounded-2xl border-primary/30 bg-primary/[0.02]">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <Upload className="w-5 h-5 text-primary" strokeWidth={2} />
              آپلود مدرک جدید
            </CardTitle>
          </CardHeader>
          <CardContent className="pt-0 space-y-4">
            <FileUploader
              label="آپلود مدارک"
              description="فایل‌های تصویری یا PDF را بکشید و رها کنید"
              accept="image/*,.pdf"
              maxSize={10 * 1024 * 1024}
              multiple
              onUpload={handleUpload}
              files={pendingFiles}
              onRemove={handleRemove}
            />
            {pendingFiles.length > 0 && (
              <div className="flex gap-2 sm:justify-end">
                <Button
                  variant="outline"
                  size="md"
                  onClick={() => {
                    setPendingFiles([]);
                    setShowUploader(false);
                  }}
                >
                  انصراف
                </Button>
                <Button size="md" onClick={handleConfirmUpload}>
                  تأیید و ذخیره
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <Card className="rounded-2xl">
        <CardContent className="p-4 md:p-5">
          <div className="w-full sm:w-80">
            <Input
              placeholder="جستجو در مدارک..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              leftIcon={<Search className="w-4 h-4" strokeWidth={2} />}
            />
          </div>
        </CardContent>
      </Card>

      <Card className="rounded-2xl">
        <CardContent className="p-0">
          <div className="divide-y divide-border">
            {filteredDocs.length === 0 ? (
              <div className="py-16 text-center">
                <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-bg flex items-center justify-center">
                  <FileText className="w-8 h-8 text-text-muted" strokeWidth={1.5} />
                </div>
                <h3 className="text-base font-bold text-text mb-2">مدرکی یافت نشد</h3>
                <p className="text-sm text-text-muted max-w-sm mx-auto">
                  مدارکی با این نام یا دسته‌بندی یافت نشد.
                </p>
              </div>
            ) : (
              filteredDocs.map((doc) => {
                const StatusIcon = statusConfig[doc.status].icon;
                const FileIcon = getFileIcon(doc.fileType);
                return (
                  <div
                    key={doc.id}
                    className="flex flex-col sm:flex-row sm:items-center gap-3 p-4 md:p-5 hover:bg-bg/50 transition-colors"
                  >
                    <div
                      className={cn(
                        'w-12 h-12 rounded-xl flex items-center justify-center shrink-0',
                        doc.fileType === 'image'
                          ? 'bg-secondary/10 text-secondary'
                          : 'bg-primary/10 text-primary'
                      )}
                    >
                      <FileIcon className="w-6 h-6" strokeWidth={2} />
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <p className="font-bold text-text truncate">{doc.name}</p>
                        <Badge
                          variant={statusConfig[doc.status].variant}
                          size="sm"
                        >
                          <StatusIcon className="w-3.5 h-3.5 ml-1" strokeWidth={2.5} />
                          {statusConfig[doc.status].label}
                        </Badge>
                        <Badge variant="outline" size="sm">
                          {doc.category}
                        </Badge>
                      </div>
                      <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-xs text-text-muted">
                        <span>{doc.type}</span>
                        <span>{doc.size}</span>
                        <span>آپلود: {formatDate(doc.uploadedAt)}</span>
                        {doc.verifiedAt && (
                          <span className="text-success">تأیید: {formatDate(doc.verifiedAt)}</span>
                        )}
                      </div>
                      {doc.note && (
                        <p className="mt-2 text-xs text-danger bg-danger/5 border border-danger/15 rounded-lg px-3 py-2">
                          {doc.note}
                        </p>
                      )}
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 sm:mr-2">
                      <Button variant="ghost" size="md" className="!p-2 !h-10 !w-10">
                        <Eye className="w-4 h-4" strokeWidth={2} />
                      </Button>
                      <Button variant="ghost" size="md" className="!p-2 !h-10 !w-10 text-primary hover:bg-primary/10 hover:text-primary">
                        <Download className="w-4 h-4" strokeWidth={2} />
                      </Button>
                      <Button
                        variant="ghost"
                        size="md"
                        className="!p-2 !h-10 !w-10 text-danger hover:bg-danger/10 hover:text-danger"
                        onClick={() => handleDelete(doc.id)}
                      >
                        <Trash2 className="w-4 h-4" strokeWidth={2} />
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
