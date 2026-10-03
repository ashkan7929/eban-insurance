'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Label } from './label';
import { ChevronDown } from 'lucide-react';

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  helperText?: string;
  error?: boolean;
  errorMessage?: string;
  icon?: React.ReactNode;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  (
    {
      className,
      label,
      helperText,
      error,
      errorMessage,
      icon,
      id,
      children,
      ...props
    },
    ref
  ) => {
    const generatedId = React.useId();
    const selectId = id || generatedId;

    return (
      <div className="w-full">
        {label && (
          <Label htmlFor={selectId}>{label}</Label>
        )}
        <div className="relative">
          {icon && (
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-3 text-text-muted">
              {icon}
            </div>
          )}
          <select
            ref={ref}
            id={selectId}
            className={cn(
              'flex h-11 w-full appearance-none rounded-xl border border-border bg-white px-4 py-2.5 text-sm text-text transition-all duration-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 disabled:cursor-not-allowed disabled:opacity-60',
              icon && 'pr-10',
              error && 'border-danger focus:border-danger focus:ring-danger/20',
              className
            )}
            {...props}
          >
            {children}
          </select>
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-text-muted">
            <ChevronDown className="h-4 w-4" />
          </div>
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

Select.displayName = 'Select';

export default Select;
