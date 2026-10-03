import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service.js';
import { notFound, badRequest } from '../../shared/errors/AppError.js';
import { normalizeMobile } from '../../shared/utils/generators.js';
import type { TrackingDto } from './dto/tracking.dto.js';

@Injectable()
export class TrackingService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async trackOrder(dto: TrackingDto) {
    if (!dto || !dto.orderNumber || !dto.mobile ||
        typeof dto.orderNumber !== 'string' || typeof dto.mobile !== 'string') {
      throw badRequest('orderNumber and mobile are required');
    }

    const order = await this.prisma.order.findUnique({
      where: { order_number: dto.orderNumber },
      include: {
        user: true,
        payments: true,
        documents: true,
        policy: true,
      },
    });

    if (!order) {
      throw notFound('Order not found');
    }

    if (!order.user) {
      throw badRequest('Order has no associated user');
    }

    const normalizedInputMobile = normalizeMobile(dto.mobile);
    const normalizedUserMobile = normalizeMobile(order.user.mobile);

    if (normalizedInputMobile !== normalizedUserMobile) {
      throw badRequest('Mobile number does not match order');
    }

    const timeline = this.buildTimeline(order);

    return {
      orderNumber: order.order_number,
      status: order.status,
      createdAt: order.created_at,
      timeline,
    };
  }

  private buildTimeline(order: any) {
    const steps: { step: string; status: 'completed' | 'pending'; date?: Date }[] = [];

    steps.push({
      step: 'Order Created',
      status: 'completed',
      date: order.created_at,
    });

    const hasDocuments = order.documents && order.documents.length > 0;
    steps.push({
      step: 'Documents Uploaded',
      status: hasDocuments ? 'completed' : 'pending',
      date: hasDocuments ? order.documents[0].created_at : undefined,
    });

    const hasPaidPayment = order.payments && order.payments.some((p: any) => p.status === 'PAID');
    const paidPayment = order.payments?.find((p: any) => p.status === 'PAID');
    steps.push({
      step: 'Payment Completed',
      status: hasPaidPayment ? 'completed' : 'pending',
      date: paidPayment?.paid_at ?? undefined,
    });

    const hasPolicy = !!order.policy;
    steps.push({
      step: 'Policy Issued',
      status: hasPolicy ? 'completed' : 'pending',
      date: order.policy?.created_at ?? undefined,
    });

    return steps;
  }
}
