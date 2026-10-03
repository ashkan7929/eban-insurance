import { Controller, Get, Param, Query, UseGuards, Inject } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service.js';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../shared/guards/roles.guard.js';
import { Roles } from '../../shared/decorators/roles.decorator.js';
import { notFound } from '../../shared/errors/AppError.js';
import { AdminQueryDto } from './dto/admin-query.dto.js';

@Controller('admin/customers')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class CustomersAdminController {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  @Get()
  async listAll(@Query() query: AdminQueryDto) {
    const page = query.page ?? 1;
    const take = query.take ?? 20;
    const skip = (page - 1) * take;

    const [items, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take,
        orderBy: { created_at: 'desc' },
        include: {
          _count: {
            select: {
              orders: true,
              quotes: true,
            },
          },
        },
      }),
      this.prisma.user.count(),
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
    const customer = await this.prisma.user.findUnique({
      where: { id },
      include: {
        orders: {
          orderBy: { created_at: 'desc' },
        },
        quotes: {
          orderBy: { created_at: 'desc' },
        },
      },
    });

    if (!customer) {
      throw notFound('Customer not found');
    }

    return customer;
  }
}
