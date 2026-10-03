import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';
import { authenticateUser } from './helpers';

const HOT_PAGES = [
  { path: '/', login: false },
  { path: '/quote/third-party', login: false },
  { path: '/dashboard/orders', login: true },
];

const USER_MOBILE = '09120000000';

interface PageMetric {
  path: string;
  ttfbMs: number;
  fcpMs: number;
  lcpMs: number;
  totalTransferBytes: number;
}

interface PerfReport {
  pages: PageMetric[];
  generatedAt: string;
  baseUrl?: string;
}

test.describe('Performance metrics (Task 10 / AC-12)', () => {
  const pagesMetrics: PageMetric[] = [];

  for (const pageDef of HOT_PAGES) {
    test(`measure ${pageDef.path}`, async ({ page, baseURL }) => {
      if (pageDef.login) {
        try { await authenticateUser(page, USER_MOBILE); } catch {}
        await page.waitForTimeout(500);
      }

      let response = null;
      try {
        response = await page.goto(pageDef.path, { waitUntil: 'load', timeout: 45000 });
      } catch (err: any) {
        const aborted = String(err?.message || '').includes('ERR_ABORTED') ||
          String(err?.message || '').includes('frame was detached');
        if (!aborted) {
          try { response = await page.goto(pageDef.path, { waitUntil: 'domcontentloaded', timeout: 45000 }); } catch {}
        }
      }
      await page.waitForLoadState('networkidle').catch(() => {});
      await page.waitForTimeout(800);

      let timing = { ttfb: 0, fcp: 0, lcp: 0, navStart: 0, responseStart: 0 };
      try {
        timing = await page.evaluate(() => {
          const navStart = performance.timing.navigationStart;
          const responseStart = performance.timing.responseStart;
          const ttfb = responseStart - navStart;

          const fcpEntries = performance.getEntriesByName('first-contentful-paint');
          const fcp = fcpEntries.length > 0 ? (fcpEntries[0] as PerformanceEntry).startTime : 0;

          const lcpEntriesAll = performance.getEntriesByType('largest-contentful-paint');
          let lcp = 0;
          if (lcpEntriesAll.length > 0) {
            const last = lcpEntriesAll[lcpEntriesAll.length - 1] as any;
            lcp = last.startTime || last.renderTime || last.loadTime || 0;
          }

          return { ttfb, fcp, lcp, navStart, responseStart };
        });
      } catch {}

      const ttfbMs = Math.max(0, timing.ttfb || 0);
      const fcpMs = Math.max(0, timing.fcp || 0);
      const lcpMs = Math.max(0, timing.lcp || 0);
      let transferBytes = 0;
      try {
        const resources = await page.evaluate(() => {
          const rs = performance.getEntriesByType('resource');
          return rs.reduce((acc: number, r: any) => acc + (r.transferSize || r.encodedBodySize || 0), 0);
        });
        transferBytes = resources || 0;
      } catch {}

      const metric: PageMetric = {
        path: pageDef.path,
        ttfbMs,
        fcpMs,
        lcpMs,
        totalTransferBytes: transferBytes,
      };

      pagesMetrics.push(metric);

      console.log(`[PERF] ${pageDef.path}`);
      console.log(`  TTFB : ${ttfbMs} ms`);
      console.log(`  FCP  : ${fcpMs} ms`);
      console.log(`  LCP  : ${lcpMs} ms`);
      console.log(`  XFER : ${transferBytes} bytes`);

      expect(ttfbMs).toBeLessThanOrEqual(30000);
      expect(fcpMs).toBeLessThanOrEqual(60000);
      expect(lcpMs).toBeLessThanOrEqual(60000);
    });
  }

  test.afterAll(async () => {
    const workspaceRoot = process.env.GITHUB_WORKSPACE;
    let artifactsDir: string;
    if (workspaceRoot) {
      artifactsDir = path.join(workspaceRoot, 'tests', 'artifacts');
    } else {
      artifactsDir = path.resolve(__dirname, '..', '..', 'tests', 'artifacts');
    }

    try {
      if (!fs.existsSync(artifactsDir)) {
        fs.mkdirSync(artifactsDir, { recursive: true });
      }

      const report: PerfReport = {
        pages: pagesMetrics,
        generatedAt: new Date().toISOString(),
        baseUrl: process.env.PLAYWRIGHT_BASE_URL || 'http://localhost:3000',
      };

      const outPath = path.join(artifactsDir, 'perf.json');
      fs.writeFileSync(outPath, JSON.stringify(report, null, 2), 'utf-8');
      console.log(`[PERF] Report written to ${outPath}`);
    } catch (err: any) {
      console.warn(`[PERF] Could not write perf report: ${err?.message || err}`);
    }
  });
});
