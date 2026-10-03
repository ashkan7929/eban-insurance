import { Controller, Get, Post, Param, Body, Inject } from '@nestjs/common';
import { ProductsService } from './products.service.js';
import { Public } from '../../shared/decorators/public.decorator.js';

function normalizeInput(body: Record<string, any>): Record<string, any> {
  if (!body) return {};
  if (body.data && typeof body.data === 'object') {
    const flat = { ...body.data };
    const nestedKeys = ['vehicle', 'insurance', 'customer', 'insured', 'coverage', 'trip', 'travelers'];
    const hasNested = nestedKeys.some((k) => flat[k] && typeof flat[k] === 'object');
    if (!hasNested) return flat;
    const result: Record<string, any> = {};
    for (const [key, value] of Object.entries(flat)) {
      if (value && typeof value === 'object' && !Array.isArray(value) && nestedKeys.includes(key)) {
        Object.assign(result, value);
      } else {
        result[key] = value;
      }
    }
    return result;
  }
  const direct: Record<string, any> = {};
  const nestedKeys = ['vehicle', 'insurance', 'customer', 'insured', 'coverage', 'trip', 'travelers'];
  let hasDirectNested = false;
  for (const [key, value] of Object.entries(body)) {
    if (value && typeof value === 'object' && !Array.isArray(value) && nestedKeys.includes(key)) {
      Object.assign(direct, value);
      hasDirectNested = true;
    } else {
      direct[key] = value;
    }
  }
  return hasDirectNested ? direct : body;
}

@Controller('products')
export class ProductsController {
  constructor(@Inject(ProductsService) private readonly productsService: ProductsService) {}

  @Public()
  @Get()
  list() {
    return this.productsService.listProducts();
  }

  @Public()
  @Get(':slug')
  get(@Param('slug') slug: string) {
    return this.productsService.getProduct(slug);
  }

  @Public()
  @Get(':slug/calculate')
  calculateGet(
    @Param('slug') slug: string,
    @Body() body: Record<string, any>,
  ) {
    return this.productsService.calculateQuote(slug, normalizeInput(body));
  }

  @Public()
  @Post(':slug/calculate')
  calculatePost(
    @Param('slug') slug: string,
    @Body() body: Record<string, any>,
  ) {
    return this.productsService.calculateQuote(slug, normalizeInput(body));
  }
}
