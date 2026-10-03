import { Module } from '@nestjs/common';
import { DashboardController } from './dashboard.controller.js';
import { OrdersAdminController } from './orders.admin.controller.js';
import { CustomersAdminController } from './customers.admin.controller.js';
import { PaymentsAdminController } from './payments.admin.controller.js';

@Module({
  controllers: [
    DashboardController,
    OrdersAdminController,
    CustomersAdminController,
    PaymentsAdminController,
  ],
})
export class AdminModule {}
