'use client';

import { Check, X, Minus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Card, CardContent } from '@/components/ui/card';

export type CoverageValue = 'full' | 'partial' | 'none' | string;

export interface CoverageRow {
  name: string;
  basic: CoverageValue;
  complete: CoverageValue;
}

export interface CoverageCardProps {
  rows: CoverageRow[];
  className?: string;
}

function renderValue(value: CoverageValue) {
  if (value === 'full') {
    return (
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-success/10 text-success">
        <Check className="h-4 w-4" strokeWidth={3} />
      </div>
    );
  }
  if (value === 'partial') {
    return (
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-warning/10 text-warning">
        <Minus className="h-4 w-4" strokeWidth={3} />
      </div>
    );
  }
  if (value === 'none') {
    return (
      <div className="flex h-7 w-7 items-center justify-center rounded-full bg-border text-text-muted">
        <X className="h-4 w-4" strokeWidth={3} />
      </div>
    );
  }
  return (
    <span className="text-sm font-medium text-text">{value}</span>
  );
}

export function CoverageCard({ rows, className }: CoverageCardProps) {
  return (
    <Card className={cn('overflow-hidden', className)}>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-right">
            <thead>
              <tr className="bg-bg border-b border-border">
                <th className="p-4 text-sm font-bold text-text min-w-[200px]">
                  پوشش
                </th>
                <th className="p-4 text-center text-sm font-bold text-text w-[140px]">
                  طرح پایه
                </th>
                <th className="p-4 text-center text-sm font-bold text-primary bg-primary/5 w-[140px]">
                  طرح کامل
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => (
                <tr
                  key={idx}
                  className={cn(
                    'border-b border-border last:border-b-0 transition-colors hover:bg-bg/50'
                  )}
                >
                  <td className="p-4 text-sm text-text">{row.name}</td>
                  <td className="p-4">
                    <div className="flex justify-center">
                      {renderValue(row.basic)}
                    </div>
                  </td>
                  <td className="p-4 bg-primary/[0.02]">
                    <div className="flex justify-center">
                      {renderValue(row.complete)}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
