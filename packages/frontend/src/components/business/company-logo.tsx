'use client';

import { cn } from '@/lib/utils';

export interface CompanyLogoProps {
  companyName: string;
  logoUrl?: string;
  className?: string;
}

function getAbbreviation(name: string): string {
  const cleaned = name.trim();
  if (!cleaned) return '';

  const englishMatch = cleaned.match(/[A-Za-z]/g);
  if (englishMatch && englishMatch.length >= 2) {
    return (englishMatch[0]! + englishMatch[1]!).toUpperCase();
  }

  const persianWords = cleaned.split(/\s+/).filter(Boolean);
  if (persianWords.length >= 2) {
    const first = persianWords[0]!;
    const second = persianWords[1]!;
    return (first[0] ?? '') + (second[0] ?? '');
  }
  if (persianWords.length === 1 && persianWords[0]!.length >= 2) {
    return persianWords[0]!.slice(0, 2);
  }
  return cleaned.slice(0, 2);
}

const bgColors = [
  'bg-primary/10 text-primary',
  'bg-secondary/10 text-secondary',
  'bg-accent/10 text-accent',
  'bg-danger/10 text-danger',
];

function getHashColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % bgColors.length;
  return bgColors[index] ?? bgColors[0]!;
}

export function CompanyLogo({ companyName, logoUrl, className }: CompanyLogoProps) {
  const abbreviation = getAbbreviation(companyName);
  const colorClass = getHashColor(companyName);

  return (
    <div className={cn('flex flex-col items-center gap-3', className)}>
      <div className="w-20 h-20 rounded-2xl border border-border bg-white shadow-card flex items-center justify-center overflow-hidden">
        {logoUrl ? (
          <img
            src={logoUrl}
            alt={companyName}
            className="w-full h-full object-contain p-2"
            loading="lazy"
          />
        ) : (
          <div
            className={cn(
              'w-14 h-14 rounded-full flex items-center justify-center font-bold text-lg',
              colorClass
            )}
          >
            {abbreviation}
          </div>
        )}
      </div>
      <span className="text-sm font-medium text-text text-center leading-tight">
        {companyName}
      </span>
    </div>
  );
}

export default CompanyLogo;
