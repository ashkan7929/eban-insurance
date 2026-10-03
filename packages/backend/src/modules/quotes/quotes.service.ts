import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service.js';
import { CreateQuoteDto } from './dto/create-quote.dto.js';
import { UpdateQuoteDto } from './dto/update-quote.dto.js';
import { products } from '../../products/index.js';
import { notFound, forbidden, badRequest } from '../../shared/errors/AppError.js';
import { Prisma } from '@prisma/client';

function toDecimalSafe(value: string | number | Prisma.Decimal | null | undefined): Prisma.Decimal {
  if (value === null || value === undefined) {
    return new Prisma.Decimal(0);
  }
  if (typeof value === 'object' && 'toString' in Object(value)) {
    const numeric = Number(value.toString());
    return new Prisma.Decimal(Number.isFinite(numeric) ? numeric : 0);
  }
  const numeric = Number(value);
  return new Prisma.Decimal(Number.isFinite(numeric) ? numeric : 0);
}

function flattenData(data: Record<string, any>): Record<string, any> {
  if (!data) return {};
  const nestedKeys = ['vehicle', 'insurance', 'customer', 'insured', 'coverage', 'trip', 'travelers'];
  const hasNested = nestedKeys.some((k) => data[k] && typeof data[k] === 'object');
  if (!hasNested) return data;
  const flat: Record<string, any> = {};
  for (const [key, value] of Object.entries(data)) {
    if (value && typeof value === 'object' && !Array.isArray(value) && nestedKeys.includes(key)) {
      Object.assign(flat, value);
    } else {
      flat[key] = value;
    }
  }
  return flat;
}

@Injectable()
export class QuotesService {
  constructor(@Inject(PrismaService) private prisma: PrismaService) {}

  async createQuote(userId: string | undefined, dto: CreateQuoteDto) {
    const product = products[dto.productSlug];
    if (!product) {
      throw notFound(`Product with slug "${dto.productSlug}" not found`);
    }

    const flatData = flattenData(dto.data);
    const calculated = product.calculateQuote(flatData);
    const finalAmount = dto.amount && dto.amount > 0 ? Number(dto.amount) : Number(calculated.amount);
    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    return this.prisma.quote.create({
      data: {
        user_id: userId,
        product_slug: dto.productSlug,
        status: 'DRAFT',
        data_json: flatData,
        amount: toDecimalSafe(finalAmount),
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
      updateData.amount = toDecimalSafe(dto.amount);
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
