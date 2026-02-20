import { test, expect } from '@playwright/test';

test.describe('App Navigation', () => {
  test('should load dashboard', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveTitle(/Aura POS/);
  });

  test('should navigate to sales', async ({ page }) => {
    await page.goto('/dashboard');
    await page.getByRole('link', { name: /sales/i }).click();
    await expect(page).toHaveURL(/.*sales/);
  });

  test('should navigate to inventory', async ({ page }) => {
    await page.goto('/dashboard');
    await page.getByRole('link', { name: /inventory/i }).click();
    await expect(page).toHaveURL(/.*inventory/);
  });

  test('should navigate to customers', async ({ page }) => {
    await page.goto('/dashboard');
    await page.getByRole('link', { name: /customers/i }).click();
    await expect(page).toHaveURL(/.*customers/);
  });

  test('should navigate to reports', async ({ page }) => {
    await page.goto('/dashboard');
    await page.getByRole('link', { name: /reports/i }).click();
    await expect(page).toHaveURL(/.*reports/);
  });

  test('should navigate to settings', async ({ page }) => {
    await page.goto('/settings');
    await expect(page.getByRole('heading', { name: /settings/i })).toBeVisible();
  });
});
