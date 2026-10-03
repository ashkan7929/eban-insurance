import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import type { NestExpressApplication } from '@nestjs/platform-express';
import request from 'supertest';
import { createNestApp, prismaTestClient, THIRD_PARTY_DATA, BODY_DATA, LIFE_DATA, TRAVEL_DATA } from '../helpers';

describe('products (e2e)', () => {
  let app: NestExpressApplication;

  beforeAll(async () => {
    app = await createNestApp();
  });

  afterAll(async () => {
    await app?.close();
    await prismaTestClient.$disconnect();
  });

  const expectedSlugs = ['third-party', 'body', 'life', 'travel'];

  it('GET /api/v1/products returns 200 with array of 4 products', async () => {
    const res = await request(app.getHttpServer()).get('/api/v1/products');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThanOrEqual(4);
    const slugs = res.body.map((p: any) => p.slug);
    for (const slug of expectedSlugs) {
      expect(slugs).toContain(slug);
    }
  });

  it.each(expectedSlugs)('GET /api/v1/products/%s returns 200 with matching slug', async (slug) => {
    const res = await request(app.getHttpServer()).get(`/api/v1/products/${slug}`);
    expect(res.status).toBe(200);
    expect(res.body.slug).toBe(slug);
  });

  it('GET /api/v1/products/invalid returns 404', async () => {
    const res = await request(app.getHttpServer()).get('/api/v1/products/invalid-product-slug');
    expect(res.status).toBe(404);
  });

  const productDataCases: [string, Record<string, any>][] = [
    ['third-party', THIRD_PARTY_DATA],
    ['body', BODY_DATA],
    ['life', LIFE_DATA],
    ['travel', TRAVEL_DATA],
  ];

  it.each(productDataCases)(
    'POST /api/v1/products/%s/calculate with valid data returns 200 with amount > 0 and breakdown array',
    async (slug, data) => {
      const res = await request(app.getHttpServer())
        .post(`/api/v1/products/${slug}/calculate`)
        .send({ data });

      expect([200, 201]).toContain(res.status);
      expect(typeof res.body.amount).toBe('number');
      expect(res.body.amount).toBeGreaterThan(0);
      expect(Array.isArray(res.body.breakdown)).toBe(true);
      expect(res.body.breakdown.length).toBeGreaterThan(0);
    },
  );
});
