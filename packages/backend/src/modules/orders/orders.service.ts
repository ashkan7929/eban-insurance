import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service.js';
import { CreateOrderDto } from './dto/create-order.dto.js';
import { notFound, badRequest, forbidden } from '../../shared/errors/AppError.js';
import { generateOrderNumber } from '../../shared/utils/generators.js';
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

@Injectable()
export class OrdersService {
  constructor(@Inject(PrismaService) private prisma: PrismaService) {}

  async createOrder(userId: string, dto: CreateOrderDto) {
    const quote = await this.prisma.quote.findUnique({
      where: { id: dto.quoteId },
      include: { order: true },
    });

    if (!quote) {
      throw notFound('Quote not found');
    }

    if (quote.status === 'CANCELLED') {
      throw badRequest('Quote has been cancelled');
    }

    if (quote.order) {
      throw badRequest('Quote has already been used to create an order');
    }

    if (quote.user_id && quote.user_id !== userId) {
      throw forbidden('You do not have access to this quote');
    }

    const orderNumber = generateOrderNumber();

    return this.prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const order = await tx.order.create({
        data: {
          user_id: userId,
          quote_id: quote.id,
          order_number: orderNumber,
          status: 'DRAFT',
          amount: toDecimalSafe(quote.amount),
        },
      });

      await tx.quote.update({
        where: { id: quote.id },
        data: { status: 'ORDERED' },
      });

      return order;
    });
  }

  async getOrder(id: string, userId: string) {
    const order = await this.prisma.order.findFirst({
      where: {
        id,
        user_id: userId,
      },
      include: { quote: true },
    });

    if (!order) {
      throw notFound('Order not found');
    }

    return order;
  }

  async listMyOrders(userId: string) {
    return this.prisma.order.findMany({
      where: { user_id: userId },
      include: { quote: true },
      orderBy: { created_at: 'desc' },
    });
  }
}
