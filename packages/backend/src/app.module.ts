import { Module, ValidationPipe } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD, APP_PIPE } from '@nestjs/core';
import { PrismaModule } from './infrastructure/database/prisma.module.js';
import { HealthModule } from './modules/health/health.module.js';
import { AuthModule } from './modules/auth/auth.module.js';
import { ProductsModule } from './modules/products/products.module.js';
import { QuotesModule } from './modules/quotes/quotes.module.js';
import { OrdersModule } from './modules/orders/orders.module.js';
import { PaymentsModule } from './modules/payments/payments.module.js';
import { DocumentsModule } from './modules/documents/documents.module.js';
import { PoliciesModule } from './modules/policies/policies.module.js';
import { TrackingModule } from './modules/tracking/tracking.module.js';
import { AdminModule } from './modules/admin/admin.module.js';
import { JwtAuthGuard } from './shared/guards/jwt-auth.guard.js';
import { AllExceptionsFilter } from './shared/filters/all-exceptions.filter.js';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    PrismaModule,
    HealthModule,
    AuthModule,
    ProductsModule,
    QuotesModule,
    OrdersModule,
    PaymentsModule,
    DocumentsModule,
    PoliciesModule,
    TrackingModule,
    AdminModule,
  ],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard,
    },
    {
      provide: APP_PIPE,
      useFactory: () =>
        new ValidationPipe({
          whitelist: true,
          transform: true,
          forbidNonWhitelisted: true,
        }),
    },
    {
      provide: APP_FILTER,
      useClass: AllExceptionsFilter,
    },
  ],
})
export class AppModule {}
