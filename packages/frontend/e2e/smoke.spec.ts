import { test, expect } from '@playwright/test';
test('home smoke', async ({ page }) => {
  await page.goto('/');
  const title = await page.title();
  expect(title.length).toBeGreaterThan(0);
});
