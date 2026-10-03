import { Controller, Get, UseGuards, Inject } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service.js';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard.js';
import { RolesGuard } from '../../shared/guards/roles.guard.js';
import { Roles } from '../../shared/decorators/roles.decorator.js';

@Controller('admin/dashboard')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('ADMIN')
export class DashboardController {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  @Get()
  async getDashboard() {
    const now = new Date();
    const startOfToday = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
    const twentyFourHoursAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    const [todaySalesResult, monthSalesResult, newOrders, pendingOrders, quotesGrouped, ordersWithQuotes, recentOrders] =
      await Promise.all([
        this.prisma.payment.aggregate({
          _sum: { amount: true },
          where: {
            status: 'PAID',
            paid_at: { gte: startOfToday },
          },
        }),
        this.prisma.payment.aggregate({
          _sum: { amount: true },
          where: {
            status: 'PAID',
            paid_at: { gte: startOfMonth, lte: endOfMonth },
          },
        }),
        this.prisma.order.count({
          where: { created_at: { gte: twentyFourHoursAgo } },
        }),
        this.prisma.order.count({
          where: { status: { in: ['DRAFT', 'PENDING_PAYMENT', 'PROCESSING'] } },
        }),
        this.prisma.quote.groupBy({
          by: ['product_slug'],
          _count: { product_slug: true },
          orderBy: { _count: { product_slug: 'desc' } },
          take: 100,
        }),
        this.prisma.order.findMany({
          include: { quote: { select: { product_slug: true } } },
          take: 1000,
          orderBy: { created_at: 'desc' },
        }),
        this.prisma.order.findMany({
          take: 10,
          orderBy: { created_at: 'desc' },
          include: {
            user: true,
            payments: true,
          },
        }),
      ]);

    const productMap = new Map<string, number>();
    for (const q of quotesGrouped) {
      productMap.set(q.product_slug, (productMap.get(q.product_slug) ?? 0) + q._count.product_slug);
    }
    for (const o of ordersWithQuotes) {
      const slug = o.quote?.product_slug;
      if (slug) {
        productMap.set(slug, (productMap.get(slug) ?? 0) + 1);
      }
    }
    const topProducts = Array.from(productMap.entries())
      .map(([product_slug, count]) => ({ product_slug, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    return {
      todaySales: todaySalesResult._sum.amount?.toNumber() ?? 0,
      monthSales: monthSalesResult._sum.amount?.toNumber() ?? 0,
      newOrders,
      pendingOrders,
      topProducts,
      recentOrders,
    };
  }
}
