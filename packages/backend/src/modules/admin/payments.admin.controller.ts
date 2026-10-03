import { Controller, Get, Param, Query, UseGuards, Inject } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service.js';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../shared/guards/roles.guard.js';
import { Roles } from '../../shared/decorators/roles.decorator.js';
import { notFound } from '../../shared/errors/AppError.js';
import { AdminQueryDto } from './dto/admin-query.dto.js';

@Controller('admin/payments')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class PaymentsAdminController {
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
    if (query.gateway) {
      where.gateway = query.gateway;
    }
    if (query.from || query.to) {
      const createdAtFilter: Record<string, Date> = {};
      if (query.from) {
        createdAtFilter.gte = new Date(query.from);
      }
      if (query.to) {
        createdAtFilter.lte = new Date(query.to);
      }
      where.created_at = createdAtFilter;
    }

    const [items, total] = await Promise.all([
      this.prisma.payment.findMany({
        where,
        skip,
        take,
        orderBy: { created_at: 'desc' },
        include: {
          order: true,
        },
      }),
      this.prisma.payment.count({ where }),
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
    const payment = await this.prisma.payment.findUnique({
      where: { id },
      include: {
        order: {
          include: {
            user: true,
          },
        },
      },
    });

    if (!payment) {
      throw notFound('Payment not found');
    }

    return payment;
  }
}
