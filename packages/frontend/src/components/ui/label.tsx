'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface LabelProps extends React.LabelHTMLAttributes<HTMLLabelElement> {}

export const Label = React.forwardRef<HTMLLabelElement, LabelProps>(
  ({ className, ...props }, ref) => {
    return (
      <label
        ref={ref}
        className={cn(
          'block mb-1.5 text-sm font-medium text-text',
          className
        )}
        {...props}
      />
    );
  }
);

Label.displayName = 'Label';

export default Label;
