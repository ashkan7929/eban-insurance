'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Label } from './label';

export interface InputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  success?: boolean;
  variant?: 'default' | 'error' | 'success';
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  type?: 'text' | 'number' | 'tel' | 'date' | 'email' | 'password';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      errorMessage,
      success,
      variant,
      leftIcon,
      rightIcon,
      id,
      type = 'text',
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const inputId = id || generatedId;

    const inputVariant = variant || (error ? 'error' : success ? 'success' : 'default');

    const variantClasses = {
      default: 'border-border focus:border-primary focus:ring-primary/20',
      error: 'border-danger focus:border-danger focus:ring-danger/20',
      success: 'border-success focus:border-success focus:ring-success/20',
    };

    return (
      <div className="w-full">
        {label && (
          <Label htmlFor={inputId}>{label}</Label>
        )}
        <div className="relative">
          {leftIcon && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-text-muted">
              {leftIcon}
            </div>
          )}
          <input
            ref={ref}
            id={inputId}
            type={type}
            className={cn(
              'flex h-11 w-full rounded-xl border bg-white px-4 py-2.5 text-sm text-text placeholder:text-text-muted transition-all duration-200 focus:outline-none focus:ring-2 disabled:cursor-not-allowed disabled:opacity-60',
              leftIcon && 'pr-10',
              rightIcon && 'pl-10',
              variantClasses[inputVariant],
              className
            )}
            {...props}
          />
          {rightIcon && (
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-text-muted">
              {rightIcon}
            </div>
          )}
        </div>
        {helperText && !error && !errorMessage && (
          <p className="mt-1.5 text-xs text-text-muted">{helperText}</p>
        )}
        {(error || errorMessage) && (
          <p className="mt-1.5 text-xs text-danger">{errorMessage}</p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;
