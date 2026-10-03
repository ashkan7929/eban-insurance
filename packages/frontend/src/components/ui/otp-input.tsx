'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface OtpInputProps extends Omit<React.HTMLAttributes<HTMLDivElement>, 'onChange'> {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  disabled?: boolean;
  inputClassName?: string;
}

export const OtpInput = React.forwardRef<HTMLDivElement, OtpInputProps>(
  ({ className, value, onChange, length = 6, disabled, inputClassName, ...props }, ref) => {
    const inputRefs = React.useRef<Array<HTMLInputElement | null>>([]);

    const handleChange = (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
      const newValue = e.target.value.replace(/[^0-9]/g, '');

      if (newValue.length > 1) {
        const pasted = newValue.slice(0, length - index);
        const newValueArr = value.split('');
        for (let i = 0; i < pasted.length; i++) {
          if (index + i < length) {
            newValueArr[index + i] = pasted[i] || '';
          }
        }
        onChange(newValueArr.join(''));
        const nextIndex = Math.min(index + pasted.length, length - 1);
        inputRefs.current[nextIndex]?.focus();
        return;
      }

      const newValueArr = value.split('');
      newValueArr[index] = newValue;
      onChange(newValueArr.join(''));

      if (newValue && index < length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'Backspace') {
        e.preventDefault();
        const newValueArr = value.split('');
        if (newValueArr[index]) {
          newValueArr[index] = '';
          onChange(newValueArr.join(''));
        } else if (index > 0) {
          newValueArr[index - 1] = '';
          onChange(newValueArr.join(''));
          inputRefs.current[index - 1]?.focus();
        }
      } else if (e.key === 'ArrowLeft' && index > 0) {
        e.preventDefault();
        inputRefs.current[index - 1]?.focus();
      } else if (e.key === 'ArrowRight' && index < length - 1) {
        e.preventDefault();
        inputRefs.current[index + 1]?.focus();
      }
    };

    const handlePaste = (index: number, e: React.ClipboardEvent<HTMLInputElement>) => {
      e.preventDefault();
      const pastedData = e.clipboardData.getData('text/plain').replace(/[^0-9]/g, '');
      if (!pastedData) return;

      const pasted = pastedData.slice(0, length - index);
      const newValueArr = value.split('');
      for (let i = 0; i < pasted.length; i++) {
        if (index + i < length) {
          newValueArr[index + i] = pasted[i] || '';
        }
      }
      onChange(newValueArr.join(''));
      const nextIndex = Math.min(index + pasted.length, length - 1);
      setTimeout(() => inputRefs.current[nextIndex]?.focus(), 0);
    };

    return (
      <div
        ref={ref}
        className={cn(
          'flex items-center justify-center gap-2 sm:gap-3',
          className
        )}
        {...props}
      >
        {Array.from({ length }).map((_, index) => (
          <input
            key={index}
            ref={(el) => {
              inputRefs.current[index] = el;
            }}
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={length}
            value={value[index] || ''}
            disabled={disabled}
            onChange={(e) => handleChange(index, e)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={(e) => handlePaste(index, e)}
            className={cn(
              'h-12 w-10 sm:h-14 sm:w-12 rounded-xl border border-border bg-white text-center text-lg sm:text-xl font-semibold text-text transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60',
              inputClassName
            )}
            aria-label={`OTP digit ${index + 1}`}
          />
        ))}
      </div>
    );
  }
);

OtpInput.displayName = 'OtpInput';

export default OtpInput;
