import { test, expect } from '@playwright/test';

test.describe('Auth Login', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/auth/login');
  });

  test.describe('Page Load', () => {
    test('should display login title', async ({ page }) => {
      await expect(page.getByRole('heading', { name: /sign in/i })).toBeVisible();
    });

    test('should display email input field', async ({ page }) => {
      const emailInput = page.getByLabel(/email/i);
      await expect(emailInput).toBeVisible();
    });

    test('should display password input field', async ({ page }) => {
      // Password field uses PrimeNG password component
      const passwordInput = page.locator('p-password input');
      await expect(passwordInput).toBeVisible();
    });

    test('should display submit button', async ({ page }) => {
      const submitButton = page.getByRole('button', { name: /sign in/i });
      await expect(submitButton).toBeVisible();
    });

    test('should display change password link', async ({ page }) => {
      const changePasswordLink = page.getByRole('link', { name: /change password/i });
      await expect(changePasswordLink).toBeVisible();
    });
  });

  test.describe('Form Validation', () => {
    test('should show validation errors when form is submitted empty', async ({ page }) => {
      const submitButton = page.getByRole('button', { name: /sign in/i });
      await submitButton.click();

      // Should show required field errors
      await expect(page.locator('.text-red-500').first()).toBeVisible();
    });

    test('should show validation error for invalid email format', async ({ page }) => {
      const emailInput = page.getByLabel(/email/i);
      const submitButton = page.getByRole('button', { name: /sign in/i });

      await emailInput.fill('invalid-email');
      await submitButton.click();

      // Should show email validation error
      await expect(page.locator('.text-red-500').first()).toBeVisible();
    });

    test('should show validation error for short password', async ({ page }) => {
      const emailInput = page.getByLabel(/email/i);
      const passwordInput = page.locator('p-password input');
      const submitButton = page.getByRole('button', { name: /sign in/i });

      await emailInput.fill('test@example.com');
      await passwordInput.fill('123');
      await submitButton.click();

      // Should show password validation error
      await expect(page.locator('.text-red-500').first()).toBeVisible();
    });

    test('should not show error when valid email and password are entered', async ({ page }) => {
      const emailInput = page.getByLabel(/email/i);
      const passwordInput = page.locator('p-password input');
      const submitButton = page.getByRole('button', { name: /sign in/i });

      await emailInput.fill('test@example.com');
      await passwordInput.fill('password123');

      // Clear errors by re-triggering validation
      await submitButton.click();

      // Should not show required field errors (but may show auth error)
      const errorMessages = page.locator('.text-red-500');
      const errorCount = await errorMessages.count();
      expect(errorCount).toBeLessThanOrEqual(1); // At most one error for invalid credentials
    });
  });

  test.describe('Login Functionality', () => {
    test('should show loading state when submitting', async ({ page }) => {
      const emailInput = page.getByLabel(/email/i);
      const passwordInput = page.locator('p-password input');
      const submitButton = page.getByRole('button', { name: /sign in/i });

      await emailInput.fill('test@example.com');
      await passwordInput.fill('password123');
      await submitButton.click();

      // Button should show loading state (disabled)
      await expect(submitButton).toBeDisabled();
    });

    test('should navigate to change password page when link is clicked', async ({ page }) => {
      const changePasswordLink = page.getByRole('link', { name: /change password/i });
      await changePasswordLink.click();

      await expect(page).toHaveURL(/.*\/auth\/password-change/);
    });

    test('should login successfully with valid credentials', async ({ page }) => {
      const emailInput = page.getByLabel(/email/i);
      const passwordInput = page.locator('p-password input');
      const submitButton = page.getByRole('button', { name: /sign in/i });

      // Use valid credentials
      await emailInput.fill('camiloolea200@gmail.com');
      await passwordInput.fill('123456');
      await submitButton.click();

      // Should navigate to dashboard after successful login
      await expect(page).toHaveURL(/.*\/dashboard/, { timeout: 10000 });
    });

    test('should show error with invalid credentials', async ({ page }) => {
      const emailInput = page.getByLabel(/email/i);
      const passwordInput = page.locator('p-password input');
      const submitButton = page.getByRole('button', { name: /sign in/i });

      // Use invalid credentials
      await emailInput.fill('invalid@test.com');
      await passwordInput.fill('wrongpassword');
      await submitButton.click();

      // Should show error toast message
      await expect(page.locator('.toast-error').first()).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Accessibility', () => {
    test('should have proper labels for form fields', async ({ page }) => {
      const emailInput = page.getByLabel(/email/i);
      const passwordInput = page.locator('p-password input');

      await expect(emailInput).toHaveAttribute('type', 'email');
      await expect(passwordInput).toBeVisible();
    });

    test('should have submit button with type submit', async ({ page }) => {
      const submitButton = page.getByRole('button', { name: /sign in/i });
      await expect(submitButton).toHaveAttribute('type', 'submit');
    });
  });
});
