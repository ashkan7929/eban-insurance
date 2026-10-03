import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatIRR(n: number | string | null | undefined): string {
  if (n === null || n === undefined) return '0 تومان';
  const num = typeof n === 'string' ? parseInt(n, 10) : n;
  if (isNaN(num)) return '0 تومان';
  return new Intl.NumberFormat('fa-IR').format(num) + ' تومان';
}

export function formatDate(date: Date | string | number | null | undefined): string {
  if (!date) return '-';
  const d = typeof date === 'object' ? date : new Date(date);
  return d.toLocaleDateString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

export function formatDateTime(date: Date | string | number | null | undefined): string {
  if (!date) return '-';
  const d = typeof date === 'object' ? date : new Date(date);
  return d.toLocaleString('fa-IR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function normalizeMobile(mobile: string | null | undefined): string {
  if (!mobile) return '';
  let cleaned = mobile.replace(/\D/g, '');
  if (cleaned.startsWith('98')) {
    cleaned = '0' + cleaned.slice(2);
  }
  if (cleaned.startsWith('9') && cleaned.length === 10) {
    cleaned = '0' + cleaned;
  }
  return cleaned;
}

export function isValidMobile(mobile: string | null | undefined): boolean {
  if (!mobile) return false;
  const normalized = normalizeMobile(mobile);
  return /^09\d{9}$/.test(normalized);
}

export function formatMobile(mobile: string | null | undefined): string {
  const normalized = normalizeMobile(mobile);
  if (!normalized) return '';
  return normalized.replace(/(\d{4})(\d{3})(\d{4})/, '$1 $2 $3');
}
