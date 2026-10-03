import { Controller, Post, Get, Param, Body, UseGuards, Query, Inject } from '@nestjs/common';
import { PaymentsService } from './payments.service.js';
import { CreatePaymentDto } from './dto/create-payment.dto.js';
import { JwtAuthGuard } from '../../shared/guards/jwt-auth.guard.js';
import { CurrentUser } from '../../shared/decorators/current-user.decorator.js';
import { Public } from '../../shared/decorators/public.decorator.js';

@UseGuards(JwtAuthGuard)
@Controller()
export class PaymentsController {
  constructor(@Inject(PaymentsService) private readonly paymentsService: PaymentsService) {}

  @Post('orders/:id/payment')
  createPayment(
    @Param('id') orderId: string,
    @CurrentUser() user: { id: string },
    @Body() dto: CreatePaymentDto,
  ) {
    return this.paymentsService.createPayment(orderId, user.id, dto);
  }

  @Public()
  @Get('payments/callback')
  verifyCallback(
    @Query('paymentId') paymentId: string,
    @Query() gatewayParams: Record<string, any>,
  ) {
    return this.paymentsService.verifyPaymentCallback(paymentId, gatewayParams);
  }

  @Get('payments/:id')
  getPayment(
    @Param('id') paymentId: string,
    @CurrentUser() user: { id: string },
  ) {
    return this.paymentsService.getPaymentById(paymentId, user.id);
  }
}
