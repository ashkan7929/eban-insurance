import { Controller, Get, Patch, Param, Body, Query, UseGuards, Inject } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service.js';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../shared/guards/roles.guard.js';
import { Roles } from '../../shared/decorators/roles.decorator.js';
import { notFound } from '../../shared/errors/AppError.js';
import { AdminQueryDto } from './dto/admin-query.dto.js';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto.js';

@Controller('admin/orders')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class OrdersAdminController {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  @Get()
  async listAll(@Query() query: AdminQueryDto) {
    const page = query.page ?? 1;
    const take = query.take ?? 20;
    const skip = (page - 1) * take;

    const where: Record<string, unknown> = {};
    if (query.status) {
      where.status = query.status;
    }

    const [items, total] = await Promise.all([
      this.prisma.order.findMany({
        where,
        skip,
        take,
        orderBy: { created_at: 'desc' },
        include: {
          user: true,
          payments: true,
        },
      }),
      this.prisma.order.count({ where }),
    ]);

    return {
      items,
      total,
      page,
      take,
      pageCount: Math.ceil(total / take) || 0,
    };
  }

  @Get(':id')
  async getDetail(@Param('id') id: string) {
    const order = await this.prisma.order.findUnique({
      where: { id },
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

    return order;
  }

  @Patch(':id/status')
  async updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    const order = await this.prisma.order.findUnique({
      where: { id },
      include: { policy: true },
    });

    if (!order) {
      throw notFound('Order not found');
    }

    const previousStatus = order.status;
    const newStatus = dto.status;

    const updatedOrder = await this.prisma.order.update({
      where: { id },
      data: { status: newStatus },
      include: {
        user: true,
        payments: true,
        documents: true,
        policy: true,
      },
    });

    if (newStatus === 'COMPLETED' && previousStatus !== 'COMPLETED') {
      const policyNumber = 'POL-' + Math.random().toString(36).substring(2, 10).toUpperCase();
      await this.prisma.insurancePolicy.upsert({
        where: { order_id: id },
        create: {
          order_id: id,
          policy_number: policyNumber,
          status: 'ACTIVE',
        },
        update: {
          status: 'ACTIVE',
        },
      });

      const orderWithPolicy = await this.prisma.order.findUnique({
        where: { id },
        include: {
          user: true,
          payments: true,
          documents: true,
          policy: true,
        },
      });

      return orderWithPolicy;
    }

    return updatedOrder;
  }
}
