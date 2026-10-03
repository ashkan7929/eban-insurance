import { Controller, Get, Post, Param, Body, Inject } from '@nestjs/common';
import { ProductsService } from './products.service.js';
import { Public } from '../../shared/decorators/public.decorator.js';

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
    @Body() body: { data?: Record<string, any> },
  ) {
    return this.productsService.calculateQuote(slug, body?.data ?? {});
  }

  @Public()
  @Post(':slug/calculate')
  calculatePost(
    @Param('slug') slug: string,
    @Body() body: { data?: Record<string, any> },
  ) {
    return this.productsService.calculateQuote(slug, body?.data ?? {});
  }
}
