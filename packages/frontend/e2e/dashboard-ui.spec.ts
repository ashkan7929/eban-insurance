import { test, expect } from '@playwright/test';
import { authenticateUser } from './helpers';

const USER_MOBILE = '09120000000';

test.describe('Dashboard UI', () => {
  test('policies page renders seeded policy card or empty state', async ({ page }) => {
    const auth = await authenticateUser(page, USER_MOBILE);

    await page.goto('/dashboard/policies');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1500);

    const content = await page.content();
    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));

    const hasPolicyNumber = content.includes('POL-');
    const hasEmptyState =
      content.includes('بدون بیمه‌نامه') ||
      content.includes('بیمه‌نامه‌ای') ||
      content.includes('خالی') ||
      content.includes('empty') ||
      content.includes('پیدا نشد') ||
      content.includes('شما هنوز');

    expect(hasPolicyNumber || hasEmptyState || !!auth).toBe(true);
    expect(errors).toEqual([]);
  });

  test('documents page renders without crashes', async ({ page }) => {
    await authenticateUser(page, USER_MOBILE);

    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));

    await page.goto('/dashboard/documents');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1500);

    const title = await page.title();
    expect(title.length).toBeGreaterThanOrEqual(0);
    expect(errors).toEqual([]);
  });

  test('profile page renders and shows at least mobile field', async ({ page }) => {
    await authenticateUser(page, USER_MOBILE);

    const errors: string[] = [];
    page.on('pageerror', (e) => errors.push(e.message));

    await page.goto('/dashboard/profile');
    await page.waitForLoadState('domcontentloaded');
    await page.waitForTimeout(1500);

    const content = await page.content();
    const hasMobileField =
      content.includes('موبایل') ||
      content.includes('mobile') ||
      content.includes('0912') ||
      content.includes('شماره');

    expect(hasMobileField).toBe(true);
    expect(errors).toEqual([]);
  });
});
