export interface ProductQuoteStep {
  key: string;
  label: string;
  fields: ProductField[];
}

export interface ProductField {
  key: string;
  label: string;
  type: 'text' | 'number' | 'select' | 'date' | 'tel';
  required?: boolean;
  options?: { label: string; value: string }[];
  placeholder?: string;
}

export interface ProductFeature {
  icon: string;
  title: string;
  description?: string;
}

export interface InsuranceProduct {
  slug: string;
  title: string;
  description: string;
  icon: string;
  color: string;
  estimatedPriceFrom: number;
  steps: ProductQuoteStep[];
  features: ProductFeature[];
  calculateQuote(input: Record<string, any>): {
    amount: number;
    breakdown: { label: string; value: number }[];
  };
}
