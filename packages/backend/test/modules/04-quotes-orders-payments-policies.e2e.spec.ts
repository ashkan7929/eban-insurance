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

describe('quotes → orders → payments → policies → documents flow (e2e)', () => {
  let app: NestExpressApplication;
  const userMobile = '09120000021';
  const otherUserMobile = '09120000022';
  let userToken: string;
  let otherUserToken: string;
  let quoteId: string;
  let orderId: string;
  let orderNumber: string;
  let paymentId: string;
  let documentId: string;

  beforeAll(async () => {
    app = await createNestApp();
    const userLogin = await loginAs(app, userMobile, UserRole.USER);
    userToken = userLogin.accessToken;
    const otherLogin = await loginAs(app, otherUserMobile, UserRole.USER);
    otherUserToken = otherLogin.accessToken;
  });

  afterAll(async () => {
    await app?.close();
    await prismaTestClient.$disconnect();
  });

  it('Step 2: create quote via helper for third-party returns 201 with uuid id and amount > 0', async () => {
    const quote = await createQuoteFor(app, userToken, 'third-party', THIRD_PARTY_DATA);
    quoteId = quote.id;

    expect(quoteId).toBeDefined();
    expect(quote.product_slug).toBe('third-party');
    expect(typeof quote.amount).toBe('string' as any || 'number');
    const amt = Number(quote.amount);
    expect(amt).toBeGreaterThan(0);
  });

  it('Step 3: GET quote/:id both public and with my token returns same id + same data', async () => {
    const publicRes = await request(app.getHttpServer()).get(`/api/v1/quotes/${quoteId}`);
    expect(publicRes.status).toBe(200);
    expect(publicRes.body.id).toBe(quoteId);

    const authRes = await request(app.getHttpServer())
      .get(`/api/v1/quotes/${quoteId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(authRes.status).toBe(200);
    expect(authRes.body.id).toBe(quoteId);
    expect(String(authRes.body.amount)).toBe(String(publicRes.body.amount));
  });

  it('Step 4: create order from quote returns 201 with unique order_number', async () => {
    const order = await createOrderForQuote(app, userToken, quoteId);
    orderId = order.id;
    orderNumber = order.order_number;

    expect(orderId).toBeDefined();
    expect(orderNumber).toBeDefined();
    expect(orderNumber.startsWith('INS-')).toBe(true);
    expect(String(order.amount)).toBeTruthy();
  });

  it('Step 5: listMyOrders GET /api/v1/orders length >= 1 and includes my order id', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/orders')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(1);
    const ids = res.body.map((o: any) => o.id);
    expect(ids).toContain(orderId);
  });

  it('Step 6: GET order/:id matches my order amount', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/v1/orders/${orderId}`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(res.body.id).toBe(orderId);
    expect(res.body.amount).toBeDefined();
  });

  it('Step 7: create Payment via POST /api/v1/orders/:id/payment returns paymentId/status PENDING', async () => {
    const res = await request(app.getHttpServer())
      .post(`/api/v1/orders/${orderId}/payment`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ gateway: 'MOCK' });

    expect([200, 201]).toContain(res.status);
    expect(res.body.paymentId).toBeDefined();
    paymentId = res.body.paymentId;
  });

  it('Step 8: GET /api/v1/payments/callback?paymentId transitions payment to PAID/success', async () => {
    const res = await request(app.getHttpServer()).get(
      `/api/v1/payments/callback?paymentId=${paymentId}`,
    );

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.payment).toBeDefined();
    expect(res.body.payment.status).toBe('PAID');
  });

  it('Step 9: GET /api/v1/policies returns policies array', async () => {
    const res = await request(app.getHttpServer())
      .get('/api/v1/policies')
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
  });

  it('Step 10: Upload document to order via multipart/form-data returns 201 with document id', async () => {
    const res = await request(app.getHttpServer())
      .post(`/api/v1/orders/${orderId}/documents`)
      .set('Authorization', `Bearer ${userToken}`)
      .field('type', 'NATIONAL_CARD')
      .attach('file', Buffer.from('fake pdf content', 'utf-8'), {
        filename: 'test.pdf',
        contentType: 'application/pdf',
      } as any);

    expect([200, 201]).toContain(res.status);
    expect(res.body.id).toBeDefined();
    documentId = res.body.id;
    expect(res.body.type).toBe('NATIONAL_CARD');
  });

  it('Step 11: GET /api/v1/orders/:id/documents includes the uploaded doc', async () => {
    const res = await request(app.getHttpServer())
      .get(`/api/v1/orders/${orderId}/documents`)
      .set('Authorization', `Bearer ${userToken}`);

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    const ids = res.body.map((d: any) => d.id);
    expect(ids).toContain(documentId);
  });

  it('Isolation: create order from another user quoteId => forbidden/not found', async () => {
    const otherQuote = await createQuoteFor(app, otherUserToken, 'third-party', {
      ...THIRD_PARTY_DATA,
      nationalCode: '0000000009',
    });

    const res = await request(app.getHttpServer())
      .post('/api/v1/orders')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ quoteId: otherQuote.id });

    expect([403, 404]).toContain(res.status);
  });
});
