'use client';

import * as React from 'react';
import { cn } from '@/lib/utils';
import { Container } from './container';

export interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  id?: string;
  title?: string;
  description?: string;
  eyebrow?: string;
  children?: React.ReactNode;
  containerClassName?: string;
  headerClassName?: string;
  align?: 'start' | 'center';
}

export const Section = React.forwardRef<HTMLElement, SectionProps>(
  (
    {
      className,
      id,
      title,
      description,
      eyebrow,
      children,
      containerClassName,
      headerClassName,
      align = 'start',
      ...props
    },
    ref
  ) => {
    const hasHeader = title || description || eyebrow;

    return (
      <section
        ref={ref}
        id={id}
        className={cn('section', className)}
        {...props}
      >
        <Container className={containerClassName}>
          {hasHeader && (
            <div
              className={cn(
                'mb-10 md:mb-12',
                align === 'center' && 'text-center mx-auto max-w-2xl',
                headerClassName
              )}
            >
              {eyebrow && (
                <span className="mb-3 inline-flex items-center rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary">
                  {eyebrow}
                </span>
              )}
              {title && (
                <h2 className="text-2xl font-bold text-text md:text-3xl lg:text-4xl">
                  {title}
                </h2>
              )}
              {description && (
                <p
                  className={cn(
                    'mt-4 text-base text-text-muted md:text-lg',
                    align === 'start' && 'max-w-2xl'
                  )}
                >
                  {description}
                </p>
              )}
            </div>
          )}
          {children}
        </Container>
      </section>
    );
  }
);

Section.displayName = 'Section';

export default Section;
