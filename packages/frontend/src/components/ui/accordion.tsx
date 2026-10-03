'use client';

import * as React from 'react';
import { ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
}

export interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  items: AccordionItem[];
  allowMultiple?: boolean;
}

export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  ({ className, items, allowMultiple = false, ...props }, ref) => {
    const [openItems, setOpenItems] = React.useState<Set<string>>(new Set());

    const toggle = (id: string) => {
      setOpenItems((prev) => {
        const next = new Set(prev);
        if (next.has(id)) {
          next.delete(id);
        } else {
          if (!allowMultiple) {
            next.clear();
          }
          next.add(id);
        }
        return next;
      });
    };

    return (
      <div ref={ref} className={cn('space-y-3', className)} {...props}>
        {items.map((item) => {
          const isOpen = openItems.has(item.id);
          return (
            <div
              key={item.id}
              className={cn(
                'rounded-2xl border border-border bg-card overflow-hidden transition-all',
                isOpen && 'shadow-card'
              )}
            >
              <button
                type="button"
                onClick={() => toggle(item.id)}
                className="flex w-full items-center justify-between gap-4 p-5 text-right transition-colors hover:bg-bg"
                aria-expanded={isOpen}
              >
                <span className="text-base font-medium text-text">
                  {item.title}
                </span>
                <ChevronDown
                  className={cn(
                    'h-5 w-5 shrink-0 text-text-muted transition-transform duration-300',
                    isOpen && 'rotate-180 text-primary'
                  )}
                />
              </button>
              <div
                className={cn(
                  'grid transition-all duration-300 ease-out',
                  isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
                )}
              >
                <div className="overflow-hidden">
                  <div className="px-5 pb-5 pt-0 text-sm leading-8 text-text-muted">
                    {item.content}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  }
);

Accordion.displayName = 'Accordion';

export default Accordion;
