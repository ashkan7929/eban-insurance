import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service.js';
import { notFound, forbidden } from '../../shared/errors/AppError.js';

@Injectable()
export class PoliciesService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async getPolicyByOrder(orderId: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw notFound('Order not found');
    }

    if (order.user_id !== userId) {
      throw forbidden('You do not own this order');
    }

    const policy = await this.prisma.insurancePolicy.findUnique({
      where: { order_id: orderId },
      include: { order: true },
    });

    if (!policy) {
      throw notFound('Policy not found for this order');
    }

    return policy;
  }

  async listMyPolicies(userId: string) {
    return this.prisma.insurancePolicy.findMany({
      where: {
        order: {
          user_id: userId,
        },
      },
      include: { order: true },
      orderBy: { created_at: 'desc' },
    });
  }
}
