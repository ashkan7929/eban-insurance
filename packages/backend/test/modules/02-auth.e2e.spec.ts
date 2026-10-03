import { describe, it, expect, beforeAll, afterAll, beforeEach } from 'vitest';
import type { NestExpressApplication } from '@nestjs/platform-express';
import request from 'supertest';
import { createNestApp, prismaTestClient, loginAs, THIRD_PARTY_DATA } from '../helpers';

describe('auth (e2e)', () => {
  let app: NestExpressApplication;
  const validMobile = '09120000100';

  beforeAll(async () => {
    app = await createNestApp();
  });

  afterAll(async () => {
    await app?.close();
    await prismaTestClient.$disconnect();
  });

  beforeEach(async () => {
    await prismaTestClient.otpCode.deleteMany({
      where: { mobile: validMobile },
    });
  });

  it('send-otp returns 201 for valid IR mobile 09120000100 + logs otp', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/send-otp')
      .send({ mobile: validMobile });

    expect([201, 200, 204]).toContain(res.status);

    let otpCode = null;
    for (let i = 0; i < 5; i++) {
      otpCode = await prismaTestClient.otpCode.findFirst({
        where: { mobile: validMobile },
        orderBy: { created_at: 'desc' },
      });
      if (otpCode) break;
      await new Promise((r) => setTimeout(r, 100));
    }

    expect(otpCode).not.toBeNull();
    expect(otpCode!.code).toHaveLength(6);
    expect(/^\d{6}$/.test(otpCode!.code)).toBe(true);
  });

  it('send-otp returns 400 for invalid mobile like "12345"', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/send-otp')
      .send({ mobile: '12345' });

    expect(res.status).toBe(400);
  });

  it('verify-otp with correct code logs in user', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/auth/send-otp')
      .send({ mobile: validMobile });

    let otpCode = null;
    for (let i = 0; i < 5; i++) {
      otpCode = await prismaTestClient.otpCode.findFirst({
        where: { mobile: validMobile },
        orderBy: { created_at: 'desc' },
      });
      if (otpCode) break;
      await new Promise((r) => setTimeout(r, 100));
    }
    expect(otpCode).not.toBeNull();

    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/verify-otp')
      .send({ mobile: validMobile, code: otpCode!.code });

    expect([200, 201]).toContain(res.status);
    expect(res.body.accessToken).toBeDefined();
    expect(res.body.user).toBeDefined();
    expect(res.body.user.mobile).toBe(validMobile);
  });

  it('verify-otp wrong code => 401', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/auth/send-otp')
      .send({ mobile: validMobile });

    const res = await request(app.getHttpServer())
      .post('/api/v1/auth/verify-otp')
      .send({ mobile: validMobile, code: '999999' });

    expect(res.status).toBe(401);
  });

  it('verify-otp with used code => 401', async () => {
    await request(app.getHttpServer())
      .post('/api/v1/auth/send-otp')
      .send({ mobile: validMobile });

    let otpCode = null;
    for (let i = 0; i < 5; i++) {
      otpCode = await prismaTestClient.otpCode.findFirst({
        where: { mobile: validMobile },
        orderBy: { created_at: 'desc' },
      });
      if (otpCode) break;
      await new Promise((r) => setTimeout(r, 100));
    }
    expect(otpCode).not.toBeNull();

    const firstRes = await request(app.getHttpServer())
      .post('/api/v1/auth/verify-otp')
      .send({ mobile: validMobile, code: otpCode!.code });
    expect([200, 201]).toContain(firstRes.status);

    const secondRes = await request(app.getHttpServer())
      .post('/api/v1/auth/verify-otp')
      .send({ mobile: validMobile, code: otpCode!.code });

    expect(secondRes.status).toBe(401);
  });

  it('login endpoint returns valid JWT accepted by protected route', async () => {
    const { accessToken } = await loginAs(app, '09120000150');

    const quoteRes = await request(app.getHttpServer())
      .post('/api/v1/quotes')
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ productSlug: 'third-party', data: THIRD_PARTY_DATA });

    const quoteId = quoteRes.body.id;
    expect(quoteId).toBeDefined();

    const withToken = await request(app.getHttpServer())
      .patch(`/api/v1/quotes/${quoteId}`)
      .set('Authorization', `Bearer ${accessToken}`)
      .send({ status: 'DRAFT' });

    expect(withToken.status).toBe(200);

    const withoutToken = await request(app.getHttpServer())
      .patch(`/api/v1/quotes/${quoteId}`)
      .send({ status: 'DRAFT' });

    expect(withoutToken.status).toBe(401);
  });
});
