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
} from '../helpers';

describe('tracking (e2e)', () => {
  let app: NestExpressApplication;
  const userMobile = '09120000050';
  let seededOrderNumber: string;

  beforeAll(async () => {
    app = await createNestApp();

    await loginAs(app, userMobile, UserRole.USER);
    const userLogin = await loginAs(app, userMobile, UserRole.USER);
    const q = await createQuoteFor(app, userLogin.accessToken, 'third-party', {
      ...THIRD_PARTY_DATA,
      nationalCode: '0000000022',
      mobile: userMobile,
    });
    const o = await createOrderForQuote(app, userLogin.accessToken, q.id);

    const dbOrder = await prismaTestClient.order.findFirst({
      where: { id: o.id },
    });
    seededOrderNumber = dbOrder?.order_number ?? o.order_number;
  });

  afterAll(async () => {
    await app?.close();
    await prismaTestClient.$disconnect();
  });

  it('POST /api/v1/tracking public returns 200 with timeline/status for valid orderNumber + mobile', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/tracking')
      .send({ orderNumber: seededOrderNumber, mobile: userMobile });

    expect([200, 201]).toContain(res.status);
    expect(res.body.orderNumber).toBe(seededOrderNumber);
    expect(res.body.status).toBeDefined();
    expect(res.body.createdAt).toBeDefined();
    expect(Array.isArray(res.body.timeline)).toBe(true);
    expect(res.body.timeline.length).toBeGreaterThan(0);
    for (const step of res.body.timeline) {
      expect(step.step).toBeDefined();
      expect(['completed', 'pending']).toContain(step.status);
    }
  });

  it('POST /api/v1/tracking returns 400 for mismatched mobile', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/tracking')
      .send({ orderNumber: seededOrderNumber, mobile: '09120000999' });

    expect(res.status).toBe(400);
  });

  it('POST /api/v1/tracking returns 404 for unknown orderNumber', async () => {
    const res = await request(app.getHttpServer())
      .post('/api/v1/tracking')
      .send({ orderNumber: 'INS-UNKNOWN', mobile: userMobile });

    expect(res.status).toBe(404);
  });
});
