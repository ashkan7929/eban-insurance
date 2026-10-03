import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import type { NestExpressApplication } from '@nestjs/platform-express';
import { AppModule } from '../src/app.module.js';
import { AllExceptionsFilter } from '../src/shared/filters/all-exceptions.filter.js';
import { PrismaClient, UserRole } from '@prisma/client';
import request from 'supertest';
import { normalizeMobile } from '../src/shared/utils/generators.js';

export const prismaTestClient = new PrismaClient();

export async function createNestApp(): Promise<NestExpressApplication> {
  const app = await NestFactory.create(AppModule, {
    logger: ['error', 'warn'],
  });

  app.setGlobalPrefix('api/v1');

  app.enableCors();

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    }),
  );

  app.useGlobalFilters(new AllExceptionsFilter());

  await app.init();
  return app;
}

export async function seedTestUser(
  prisma: PrismaClient,
  mobile: string,
  role: UserRole = UserRole.USER,
) {
  const normalized = normalizeMobile(mobile);
  const user = await prisma.user.upsert({
    where: { mobile: normalized },
    create: { mobile: normalized, role },
    update: { role },
  });
  return { user, rawPassword: undefined };
}

export function authHeader(token: string) {
  return { Authorization: `Bearer ${token}` };
}

export interface LoginResult {
  accessToken: string;
  user: any;
}

export async function loginAs(
  app: NestExpressApplication,
  mobile: string,
  role?: UserRole,
  overrideData?: Record<string, any>,
): Promise<LoginResult> {
  const server = app.getHttpServer();
  const normalized = normalizeMobile(mobile);

  if (role) {
    await seedTestUser(prismaTestClient, normalized, role);
  }

  await request(server)
    .post('/api/v1/auth/send-otp')
    .send({ mobile: normalized, ...(overrideData ?? {}) });

  const otpCode = await prismaTestClient.otpCode.findFirst({
    where: { mobile: normalized },
    orderBy: { created_at: 'desc' },
  });

  if (!otpCode) {
    throw new Error(`No OTP found for mobile ${normalized}`);
  }

  const verifyRes = await request(server)
    .post('/api/v1/auth/verify-otp')
    .send({ mobile: normalized, code: otpCode.code });

  return {
    accessToken: verifyRes.body.accessToken,
    user: verifyRes.body.user,
  };
}

export async function createQuoteFor(
  app: NestExpressApplication,
  token: string | undefined,
  productSlug: string,
  dataPayload: Record<string, any>,
) {
  const server = app.getHttpServer();
  const req = request(server).post('/api/v1/quotes');
  if (token) {
    req.set('Authorization', `Bearer ${token}`);
  }
  const res = await req.send({ productSlug, data: dataPayload });
  return res.body;
}

export async function createOrderForQuote(
  app: NestExpressApplication,
  token: string,
  quoteId: string,
) {
  const server = app.getHttpServer();
  const res = await request(server)
    .post('/api/v1/orders')
    .set('Authorization', `Bearer ${token}`)
    .send({ quoteId });
  return res.body;
}

export const THIRD_PARTY_DATA: Record<string, any> = {
  plate: '12الف345-78',
  brand: 'Peugeot',
  model: '206',
  year: 1400,
  previousCompany: 'iran',
  expirationDate: '2026-01-01',
  discountPercent: 0,
  firstName: 'Test',
  lastName: 'Testian',
  nationalCode: '0000000001',
  birthDate: '1990-01-01',
  mobile: '09120000100',
};

export const BODY_DATA: Record<string, any> = {
  plate: '12الف345-78',
  brand: 'Peugeot',
  model: '206',
  year: 1400,
  vehicleValue: 500000000,
  plan: 'complete',
  theft: 'true',
  fire: 'true',
  naturalDisaster: 'true',
  firstName: 'Test',
  lastName: 'Testian',
  nationalCode: '0000000002',
  birthDate: '1990-01-01',
  mobile: '09120000100',
};

export const LIFE_DATA: Record<string, any> = {
  age: 35,
  gender: 'male',
  occupation: 'office',
  coverageAmount: 2000000000,
  coverageYears: '10',
  firstName: 'Test',
  lastName: 'Testian',
  nationalCode: '0000000003',
  birthDate: '1990-01-01',
  mobile: '09120000100',
};

export const TRAVEL_DATA: Record<string, any> = {
  destination: 'europe',
  departureDate: '2026-01-10',
  returnDate: '2026-01-20',
  count: 2,
  plan: 'standard',
};

export const PRODUCT_DATA_MAP: Record<string, Record<string, any>> = {
  'third-party': THIRD_PARTY_DATA,
  body: BODY_DATA,
  life: LIFE_DATA,
  travel: TRAVEL_DATA,
};
