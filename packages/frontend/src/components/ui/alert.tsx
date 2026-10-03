'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Info, AlertTriangle, CheckCircle2, XCircle, X } from 'lucide-react';

type AlertVariant = 'info' | 'success' | 'warning' | 'danger';

export interface AlertProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: AlertVariant;
  title?: string;
  description?: string;
  dismissible?: boolean;
  onClose?: () => void;
  icon?: React.ReactNode;
}

const variantConfig: Record<
  AlertVariant,
  { wrapper: string; icon: React.ReactNode; iconColor: string }
> = {
  info: {
    wrapper: 'bg-blue-50 border-blue-200 text-blue-800',
    icon: <Info className="h-5 w-5" />,
    iconColor: 'text-blue-500',
  },
  success: {
    wrapper: 'bg-green-50 border-green-200 text-green-800',
    icon: <CheckCircle2 className="h-5 w-5" />,
    iconColor: 'text-success',
  },
  warning: {
    wrapper: 'bg-amber-50 border-amber-200 text-amber-800',
    icon: <AlertTriangle className="h-5 w-5" />,
    iconColor: 'text-warning',
  },
  danger: {
    wrapper: 'bg-red-50 border-red-200 text-red-800',
    icon: <XCircle className="h-5 w-5" />,
    iconColor: 'text-danger',
  },
};

export const Alert = React.forwardRef<HTMLDivElement, AlertProps>(
  (
    {
      className,
      variant = 'info',
      title,
      description,
      dismissible = false,
      onClose,
      icon,
      children,
      ...props
    },
    ref
  ) => {
    const [isVisible, setIsVisible] = React.useState(true);

    const handleClose = () => {
      setIsVisible(false);
      onClose?.();
    };

    if (!isVisible) return null;

    const config = variantConfig[variant];

    return (
      <div
        ref={ref}
        role="alert"
        className={cn(
          'flex items-start gap-3 rounded-xl border p-4 transition-all duration-300',
          config.wrapper,
          className
        )}
        {...props}
      >
        <div className={cn('shrink-0 mt-0.5', config.iconColor)}>
          {icon || config.icon}
        </div>
        <div className="flex-1 min-w-0">
          {title && (
            <h4 className="text-sm font-semibold">{title}</h4>
          )}
          {(description || children) && (
            <div className={cn('text-sm opacity-90', title && 'mt-1')}>
              {description || children}
            </div>
          )}
        </div>
        {dismissible && (
          <button
            type="button"
            onClick={handleClose}
            className={cn(
              'shrink-0 flex h-7 w-7 items-center justify-center rounded-lg transition-colors opacity-70 hover:opacity-100',
              variant === 'info' && 'hover:bg-blue-100',
              variant === 'success' && 'hover:bg-green-100',
              variant === 'warning' && 'hover:bg-amber-100',
              variant === 'danger' && 'hover:bg-red-100'
            )}
            aria-label="Close alert"
          >
            <X className="h-4 w-4" />
          </button>
        )}
      </div>
    );
  }
);

Alert.displayName = 'Alert';

export default Alert;
