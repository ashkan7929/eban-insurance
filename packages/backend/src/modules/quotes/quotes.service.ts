import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { CreateQuoteDto } from './dto/create-quote.dto';
import { UpdateQuoteDto } from './dto/update-quote.dto';
import { products } from '../../products/index';
import { notFound, forbidden, badRequest } from '../../shared/errors/AppError';
import { Prisma } from '@prisma/client';

@Injectable()
export class QuotesService {
  constructor(@Inject(PrismaService) private prisma: PrismaService) {}

  async createQuote(userId: string | undefined, dto: CreateQuoteDto) {
    const product = products[dto.productSlug];
    if (!product) {
      throw notFound(`Product with slug "${dto.productSlug}" not found`);
    }

    const { amount } = product.calculateQuote(dto.data);
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    return this.prisma.quote.create({
      data: {
        user_id: userId,
        product_slug: dto.productSlug,
        status: 'DRAFT',
        data_json: dto.data,
        amount: new Prisma.Decimal(amount),
        expires_at: expiresAt,
      },
    });
  }

  async getQuote(id: string, userId?: string) {
    const quote = await this.prisma.quote.findUnique({
      where: { id },
    });

    if (!quote) {
      throw notFound('Quote not found');
    }

    if (userId && quote.user_id && quote.user_id !== userId) {
      throw forbidden('You do not have access to this quote');
    }

    return quote;
  }

  async updateQuote(id: string, dto: UpdateQuoteDto, userId?: string) {
    const quote = await this.getQuote(id, userId);

    if (quote.status === 'CANCELLED' || quote.status === 'ORDERED') {
      throw badRequest('Cannot update a quote that is cancelled or ordered');
    }

    const updateData: Record<string, any> = {};

    if (dto.data !== undefined) {
      updateData.data_json = dto.data;
    }

    if (dto.amount !== undefined) {
      updateData.amount = new Prisma.Decimal(dto.amount);
    }

    if (dto.status !== undefined) {
      updateData.status = dto.status;
    }

    updateData.expires_at = new Date(Date.now() + 30 * 60 * 1000);

    return this.prisma.quote.update({
      where: { id },
      data: updateData,
    });
  }

  async deleteQuote(id: string, userId?: string) {
    const quote = await this.getQuote(id, userId);

    if (quote.status === 'ORDERED') {
      throw badRequest('Cannot delete a quote that has been ordered');
    }

    return this.prisma.quote.update({
      where: { id },
      data: { status: 'CANCELLED' },
    });
  }
}
