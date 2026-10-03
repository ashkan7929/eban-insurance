import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service.js';
import { notFound, forbidden, badRequest } from '../../shared/errors/AppError.js';
import type { CreatePaymentDto } from './dto/create-payment.dto.js';

@Injectable()
export class PaymentsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async createPayment(orderId: string, userId: string, dto: CreatePaymentDto) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw notFound('Order not found');
    }

    if (order.user_id !== userId) {
      throw forbidden('You do not own this order');
    }

    const payment = await this.prisma.payment.create({
      data: {
        order_id: orderId,
        gateway: dto.gateway,
        amount: order.amount,
        status: 'PENDING',
      },
    });

    const redirectUrl = `/api/v1/payments/${payment.id}/mock-gateway`;

    return {
      paymentId: payment.id,
      redirectUrl,
    };
  }

  async verifyPaymentCallback(paymentId: string, gatewayParams: Record<string, any>) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: { order: true },
    });

    if (!payment) {
      throw notFound('Payment not found');
    }

    if (payment.status !== 'PENDING') {
      throw badRequest('Payment already processed');
    }

    const transactionId = `MOCK-${Date.now()}`;

    const updatedPayment = await this.prisma.payment.update({
      where: { id: paymentId },
      data: {
        status: 'PAID',
        paid_at: new Date(),
        transaction_id: transactionId,
      },
    });

    const nextOrderStatus = payment.order.status === 'DRAFT' ? 'PROCESSING' : 'PAID';

    await this.prisma.order.update({
      where: { id: payment.order_id },
      data: {
        status: nextOrderStatus,
      },
    });

    return {
      success: true,
      payment: updatedPayment,
    };
  }

  async getPaymentsByOrder(orderId: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw notFound('Order not found');
    }

    if (order.user_id !== userId) {
      throw forbidden('You do not own this order');
    }

    return this.prisma.payment.findMany({
      where: { order_id: orderId },
      orderBy: { created_at: 'desc' },
    });
  }

  async getPaymentById(paymentId: string, userId: string) {
    const payment = await this.prisma.payment.findUnique({
      where: { id: paymentId },
      include: { order: true },
    });

    if (!payment) {
      throw notFound('Payment not found');
    }

    if (payment.order.user_id !== userId) {
      throw forbidden('You do not own this payment');
    }

    return payment;
  }
}
