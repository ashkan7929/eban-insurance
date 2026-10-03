import { Controller, Get, ServiceUnavailableException, Inject } from '@nestjs/common';
import { PrismaService } from '../../infrastructure/database/prisma.service.js';
import { Public } from '../../shared/decorators/public.decorator.js';

@Controller('health')
export class HealthController {
  constructor(@Inject(PrismaService) private readonly prisma: PrismaService) {}

  @Get()
  @Public()
  async check() {
    try {
      await this.prisma.$queryRaw`SELECT 1`;
      return {
        status: 'ok',
        db: 'connected',
      };
    } catch (error) {
      throw new ServiceUnavailableException({
        status: 'degraded',
        db: 'disconnected',
      });
    }
  }
}
