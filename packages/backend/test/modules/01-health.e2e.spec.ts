import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import type { NestExpressApplication } from '@nestjs/platform-express';
import request from 'supertest';
import { createNestApp, prismaTestClient } from '../helpers.js';

describe('health (e2e)', () => {
  let app: NestExpressApplication;

  beforeAll(async () => {
    app = await createNestApp();
  });

  afterAll(async () => {
    await app?.close();
    await prismaTestClient.$disconnect();
  });

  it('GET /api/v1/health returns 200 with status=ok and db=connected', async () => {
    const res = await request(app.getHttpServer()).get('/api/v1/health');
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('ok');
    expect(res.body.db).toBe('connected');
  });
});
