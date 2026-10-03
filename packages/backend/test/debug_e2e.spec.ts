import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { createNestApp } from './helpers';
import type { NestExpressApplication } from '@nestjs/platform-express';
import request from 'supertest';

describe('debug', () => {
  let app: NestExpressApplication;
  beforeAll(async () => { app = await createNestApp(); });
  afterAll(async () => { await app?.close(); });

  it('debug health', async () => {
    const res = await request(app.getHttpServer()).get('/api/v1/health');
    console.log('HEALTH:', res.status, JSON.stringify(res.body, null, 2).slice(0, 500));
  });
  it('debug products', async () => {
    const res = await request(app.getHttpServer()).get('/api/v1/products');
    console.log('PRODUCTS:', res.status, JSON.stringify(res.body, null, 2).slice(0, 800));
  });
  it('debug auth', async () => {
    const res = await request(app.getHttpServer()).post('/api/v1/auth/send-otp').send({ mobile: '09120000100' });
    console.log('AUTH:', res.status, JSON.stringify(res.body, null, 2).slice(0, 800));
  });
});
