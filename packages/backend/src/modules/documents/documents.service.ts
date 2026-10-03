import { Injectable, Inject } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service.js';
import { notFound, forbidden } from '../../shared/errors/AppError.js';

@Injectable()
export class DocumentsService {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  async uploadDocument(
    orderId: string,
    userId: string,
    type: string,
    file: Express.Multer.File,
  ) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw notFound('Order not found');
    }

    if (order.user_id !== userId) {
      throw forbidden('You do not own this order');
    }

    const fileUrl = `/uploads/${Date.now()}-${file.originalname}`;

    return this.prisma.document.create({
      data: {
        order_id: orderId,
        type,
        file_url: fileUrl,
      },
    });
  }

  async getDocumentsByOrder(orderId: string, userId: string) {
    const order = await this.prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      throw notFound('Order not found');
    }

    if (order.user_id !== userId) {
      throw forbidden('You do not own this order');
    }

    return this.prisma.document.findMany({
      where: { order_id: orderId },
      orderBy: { created_at: 'desc' },
    });
  }
}
