import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { notFound, badRequest, forbidden } from '../../shared/errors/AppError';
import { generateOrderNumber } from '../../shared/utils/generators';
import { Prisma } from '@prisma/client';

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
          amount: new Prisma.Decimal(quote.amount.toString()),
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
