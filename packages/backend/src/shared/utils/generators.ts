export function generateNumericOtp(length = 6): string {
  let code = '';
  for (let i = 0; i < length; i++) {
    code += Math.floor(Math.random() * 10).toString();
  }
  return code;
}

export function generateOrderNumber(sequence?: number): string {
  const seq = sequence ?? Math.floor(Math.random() * 90000 + 10000);
  return `INS-${seq}`;
}

export function toRials(amount: number): number {
  return Math.round(amount);
}

export function formatIRR(amount: number): string {
  return new Intl.NumberFormat('fa-IR').format(amount) + ' تومان';
}

export function normalizeMobile(mobile: string): string {
  const digits = mobile.replace(/\D/g, '');
  if (digits.startsWith('98')) return '0' + digits.slice(2);
  if (digits.startsWith('0')) return digits;
  if (digits.length === 10) return '0' + digits;
  return digits;
}

export function isValidIranianMobile(mobile: string): boolean {
  return /^09\d{9}$/.test(normalizeMobile(mobile));
}

export function isValidNationalCode(code: string): boolean {
  if (!/^\d{10}$/.test(code)) return false;
  const check = parseInt(code[9]!, 10);
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(code[i]!, 10) * (10 - i);
  }
  const remainder = sum % 11;
  if (remainder < 2) return check === remainder;
  return check === 11 - remainder;
}

export function isValidIranianPlate(plate: string): boolean {
  return /^(\d{2}-?[الف-ی]\d{3}-?\d{2}|[\u06F0-\u06F9]{2}[\u0600-\u06FF][\u06F0-\u06F9]{3}-?[\u06F0-\u06F9]{2})$/.test(plate);
}
