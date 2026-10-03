'use client';

import { Check, X, Star } from 'lucide-react';
import { cn, formatIRR } from '@/lib/utils';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

export interface PlanFeature {
  title: string;
  included: boolean;
}

export interface PlanCardProps {
  name: string;
  description?: string;
  price: number;
  period?: string;
  features: PlanFeature[];
  highlighted?: boolean;
  onSelect?: () => void;
  className?: string;
}

export function PlanCard({
  name,
  description,
  price,
  period = 'سالانه',
  features,
  highlighted = false,
  onSelect,
  className,
}: PlanCardProps) {
  return (
    <Card
      className={cn(
        'relative h-full flex flex-col transition-all duration-300',
        highlighted
          ? 'border-primary shadow-card-lg ring-2 ring-primary/10 scale-[1.02]'
          : 'hover:shadow-card-hover',
        className
      )}
    >
      {highlighted && (
        <div className="absolute -top-3 right-1/2 translate-x-1/2">
          <Badge variant="default" className="gap-1 shadow-card-lg">
            <Star className="h-3.5 w-3.5 fill-white" />
            پیشنهادی
          </Badge>
        </div>
      )}

      <CardContent className="p-6 flex-1 flex flex-col">
        <div className="mb-5">
          <h3
            className={cn(
              'text-lg font-bold mb-1.5',
              highlighted ? 'text-primary' : 'text-text'
            )}
          >
            {name}
          </h3>
          {description && (
            <p className="text-sm text-text-muted">{description}</p>
          )}
        </div>

        <div className="mb-6 pb-6 border-b border-border">
          <div className="flex items-baseline gap-1.5">
            <span className="text-2xl font-bold text-text">
              {formatIRR(price)}
            </span>
          </div>
          <div className="text-xs text-text-muted mt-1">{period}</div>
        </div>

        <ul className="space-y-3 flex-1">
          {features.map((feature, idx) => (
            <li key={idx} className="flex items-start gap-2.5">
              {feature.included ? (
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/10 text-success">
                  <Check className="h-3 w-3" strokeWidth={3} />
                </div>
              ) : (
                <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-border text-text-muted">
                  <X className="h-3 w-3" strokeWidth={3} />
                </div>
              )}
              <span
                className={cn(
                  'text-sm leading-6',
                  feature.included ? 'text-text' : 'text-text-muted line-through'
                )}
              >
                {feature.title}
              </span>
            </li>
          ))}
        </ul>
      </CardContent>

      <CardFooter className="pt-0 pb-6">
        <Button
          variant={highlighted ? 'primary' : 'outline'}
          size="lg"
          className="w-full"
          onClick={onSelect}
        >
          انتخاب این طرح
        </Button>
      </CardFooter>
    </Card>
  );
}
