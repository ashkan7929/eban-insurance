import { Injectable } from '@nestjs/common';
import { products } from '../../products/index.js';
import { notFound } from '../../shared/errors/AppError.js';
import type { InsuranceProduct } from '../../products/types.js';

@Injectable()
export class ProductsService {
  listProducts(): Omit<InsuranceProduct, 'calculateQuote'>[] {
    return Object.values(products).map(({ calculateQuote, ...rest }) => rest);
  }

  getProduct(slug: string): Omit<InsuranceProduct, 'calculateQuote'> {
    const product = products[slug];
    if (!product) {
      throw notFound(`Product with slug "${slug}" not found`);
    }
    const { calculateQuote, ...rest } = product;
    return rest;
  }

  calculateQuote(
    slug: string,
    input: Record<string, any>,
  ): { amount: number; breakdown: { label: string; value: number }[] } {
    const product = products[slug];
    if (!product) {
      throw notFound(`Product with slug "${slug}" not found`);
    }
    return product.calculateQuote(input);
  }
}
