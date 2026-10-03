'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';

export interface DividerProps extends React.HTMLAttributes<HTMLHRElement> {}

export const Divider = React.forwardRef<HTMLHRElement, DividerProps>(
  ({ className, ...props }, ref) => {
    return (
      <hr
        ref={ref}
        className={cn(
          'my-6 border-border',
          className
        )}
        {...props}
      />
    );
  }
);

Divider.displayName = 'Divider';

export default Divider;
