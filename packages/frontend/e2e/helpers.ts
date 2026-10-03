import { execSync } from 'child_process';
import type { Page, APIRequestContext } from '@playwright/test';

const PG_CONFIG = {
  host: 'localhost',
  port: '5432',
  user: 'postgres',
  password: 'postgres',
  dbname: 'eban_insurance',
};

const PSQL_ENV = `PGPASSWORD=${PG_CONFIG.password}`;
const PSQL_CONN = `"host=${PG_CONFIG.host} port=${PG_CONFIG.port} user=${PG_CONFIG.user} dbname=${PG_CONFIG.dbname}"`;

let psqlAvailable: boolean | null = null;

function checkPsqlAvailable(): boolean {
  if (psqlAvailable !== null) return psqlAvailable;
  try {
    execSync('which psql', { stdio: 'ignore' });
    psqlAvailable = true;
  } catch {
    psqlAvailable = false;
  }
  return psqlAvailable;
}

function runPsqlQuery(sql: string): string {
  if (!checkPsqlAvailable()) return '';
  try {
    const escapedSql = sql.replace(/"/g, '\\"');
    const cmd = `${PSQL_ENV} psql ${PSQL_CONN} -Atc "${escapedSql}"`;
    const result = execSync(cmd, {
      encoding: 'utf-8',
      timeout: 5000,
      stdio: ['ignore', 'pipe', 'ignore'],
    });
    return result.trim();
  } catch {
    return '';
  }
}

export function getLatestOtpCode(mobile: string): string {
  const safeMobile = mobile.replace(/'/g, "''");
  const sql = `SELECT code FROM "OtpCode" WHERE mobile='${safeMobile}' ORDER BY created_at DESC LIMIT 1;`;
  const code = runPsqlQuery(sql);
  return code || '';
}

export function listSeededOrderNumber(): string {
  const sql = `SELECT order_number FROM "Order" ORDER BY created_at LIMIT 1;`;
  return runPsqlQuery(sql);
}

export interface AuthResult {
  accessToken: string;
  user: any;
}

async function sendOtpApi(
  ctx: { post: (url: string, opts?: any) => Promise<any> },
  backendApiBase: string,
  mobile: string
): Promise<boolean> {
  try {
    const res = await ctx.post(`${backendApiBase}/auth/send-otp`, {
      data: { mobile },
    });
    if (!res) return false;
    const status = typeof res.status === 'function' ? res.status() : (res.status ?? 0);
    return status === 200 || status === 201;
  } catch {
    return false;
  }
}

async function verifyOtpApi(
  ctx: { post: (url: string, opts?: any) => Promise<any> },
  backendApiBase: string,
  mobile: string,
  code: string
): Promise<{ accessToken: string; user: any } | null> {
  try {
    const res = await ctx.post(`${backendApiBase}/auth/verify-otp`, {
      data: { mobile, code },
    });
    if (!res) return null;
    const status = typeof res.status === 'function' ? res.status() : (res.status ?? 0);
    if (status < 200 || status >= 300) return null;
    const body = res?.json ? await res.json() : res?.data ?? res;
    const accessToken = body?.accessToken ?? body?.access_token ?? body?.token ?? '';
    const user = body?.user ?? null;
    if (accessToken) return { accessToken, user };
    return null;
  } catch {
    return null;
  }
}

export async function authenticateUser(
  pageOrApiRequestContext: Page | APIRequestContext,
  mobile: string,
  backendApiBase: string = 'http://localhost:3001/api/v1'
): Promise<AuthResult | null> {
  const isPage = (x: any): x is Page => typeof x?.goto === 'function';

  let apiCtx: { post: (url: string, opts?: any) => Promise<any> };
  if (isPage(pageOrApiRequestContext)) {
    apiCtx = pageOrApiRequestContext.request;
  } else {
    apiCtx = pageOrApiRequestContext as APIRequestContext;
  }

  const sent = await sendOtpApi(apiCtx, backendApiBase, mobile);

  let otpCode = '';
  if (sent) {
    for (let i = 0; i < 5; i++) {
      otpCode = getLatestOtpCode(mobile);
      if (otpCode && otpCode.length >= 4) break;
      await new Promise((r) => setTimeout(r, 500));
    }
  }

  if (!otpCode) {
    otpCode = '123456';
  }

  const verified = await verifyOtpApi(apiCtx, backendApiBase, mobile, otpCode);

  if (!verified) {
    return null;
  }

  const { accessToken, user } = verified;

  if (isPage(pageOrApiRequestContext)) {
    const page = pageOrApiRequestContext as Page;
    const curUrl = page.url();
    if (!curUrl || curUrl.startsWith('about:') || curUrl.startsWith('data:') || !curUrl.startsWith('http')) {
      try {
        await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 20000 });
      } catch (err: any) {
        const aborted = String(err?.message || '').includes('ERR_ABORTED');
        if (!aborted) {
          try { await page.goto('/auth', { waitUntil: 'domcontentloaded', timeout: 20000 }); } catch {}
        }
      }
    }
    try {
      await page.evaluate(
        ({ storageKey, payload }) => {
          localStorage.setItem(storageKey, JSON.stringify(payload));
        },
        {
          storageKey: 'eban-auth',
          payload: {
            accessToken: accessToken,
            user: user,
          },
        }
      );
    } catch {
      try {
        await page.goto('/', { waitUntil: 'domcontentloaded', timeout: 20000 }).catch(() => {});
        await page.waitForTimeout(500);
        await page.evaluate(
          ({ storageKey, payload }) => {
            localStorage.setItem(storageKey, JSON.stringify(payload));
          },
          {
            storageKey: 'eban-auth',
            payload: { accessToken, user },
          }
        );
      } catch {}
    }
  }

  return { accessToken, user };
}

export function setAuthOnPage(page: Page, accessToken: string, user: any): Promise<void> {
  return page.evaluate(
    ({ storageKey, payload }) => {
      localStorage.setItem(storageKey, JSON.stringify(payload));
    },
    {
      storageKey: 'eban-auth',
      payload: { accessToken, user },
    }
  );
}
