import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import type { NestExpressApplication } from '@nestjs/platform-express';
import request from 'supertest';
import { UserRole } from '@prisma/client';
import {
  createNestApp,
  prismaTestClient,
  loginAs,
  createQuoteFor,
  createOrderForQuote,
  THIRD_PARTY_DATA,
} from '../helpers.js';

describe('admin (e2e)', () => {
  let app: NestExpressApplication;
  const adminMobile = '09120000001';
  const userMobile = '09120000002';
  let adminToken: string;
  let userToken: string;
  let seededOrderId: string;

  beforeAll(async () => {
    app = await createNestApp();

    const adminLogin = await loginAs(app, adminMobile, UserRole.ADMIN);
    adminToken = adminLogin.accessToken;

    const userLogin = await loginAs(app, userMobile, UserRole.USER);
    userToken = userLogin.accessToken;

    const q = await createQuoteFor(app, userToken, 'third-party', {
      ...THIRD_PARTY_DATA,
      nationalCode: '0000000011',
    });
    const o = await createOrderForQuote(app, userToken, q.id);
    seededOrderId = o.id;
  });

  afterAll(async () => {
    await app?.close();
    await prismaTestClient.$disconnect();
  });

  it('GET /api/v1/admin/dashboard as ADMIN returns 200 with required keys', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/admin/dashboard')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        todaySales: expect.any(Number),
        monthSales: expect.any(Number),
        newOrders: expect.any(Number),
        pendingOrders: expect.any(Number),
        topProducts: expect.any(Array),
        recentOrders: expect.any(Array),
      }),
    );
  });

  it('GET /api/v1/admin/customers as ADMIN returns 200 with paginated shape', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/admin/customers')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        items: expect.any(Array),
        total: expect.any(Number),
        page: expect.any(Number),
        take: expect.any(Number),
        pageCount: expect.any(Number),
      }),
    );
  });

  it('GET /api/v1/admin/customers as USER returns 403', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/admin/customers')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(403);
  });

  it('GET /api/v1/admin/customers without auth returns 401', async () => {
    const res = await request(app.getHttpServer()).get('/api/v1/admin/customers');
    expect(res.status).toBe(401);
  });

  it('GET /api/v1/admin/customers/:unknown-id returns 404', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/admin/customers/00000000-0000-0000-0000-000000000000')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(404);
  });

  it('GET /api/v1/admin/orders as ADMIN returns paginated shape (conflict resolution AC-4)', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/admin/orders')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        items: expect.any(Array),
        total: expect.any(Number),
        page: expect.any(Number),
        take: expect.any(Number),
        pageCount: expect.any(Number),
      }),
    );
  });

  it('GET /api/v1/orders as USER returns simple array (listMyOrders) and not other user orders', async () => {
    const otherUserLogin = await loginAs(app, '09120000999', UserRole.USER);
    const otherToken = otherUserLogin.accessToken;

    const res = await request(app.getHttpServer())
      .get('/api/v1/orders')
      .set('Authorization', `Bearer ${otherToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    const orderIds = res.body.map((o: any) => o.id);
    expect(orderIds).not.toContain(seededOrderId);
  });

  it('GET /api/v1/admin/orders/:id as ADMIN includes user + payments + documents + policy relations', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/v1/admin/orders/${seededOrderId}`)
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body.user).toBeDefined();
    expect(res.body.payments).toBeDefined();
    expect(Array.isArray(res.body.payments)).toBe(true);
    expect(res.body.documents).toBeDefined();
    expect(Array.isArray(res.body.documents)).toBe(true);
    expect(res.body.policy !== undefined).toBe(true);
  });

  it('PATCH /api/v1/admin/orders/:id/status as ADMIN with COMPLETED auto-creates policy', async () => {
    const res = await request(app.getHttpServer())
      .patch(`/api/v1/admin/orders/${seededOrderId}/status`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'COMPLETED' });

    expect(res.status).toBe(200);
    expect(res.body.status).toBe('COMPLETED');
    expect(res.body.policy).toBeDefined();
  });

  it('GET /api/v1/admin/payments as ADMIN returns paginated shape', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/admin/payments')
      .set('Authorization', `Bearer ${adminToken}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.objectContaining({
        items: expect.any(Array),
        total: expect.any(Number),
        page: expect.any(Number),
        take: expect.any(Number),
        pageCount: expect.any(Number),
      }),
    );
  });
});
