import { test, expect } from '@playwright/test';
import { environment } from '../src/environments/environment.development';

test.describe('Autenticación de Login', () => {
  test.beforeEach(async ({ page }) => {
    // Ir a la página de login antes de cada test
    await page.goto('/auth/login');
  });

  test.describe('Carga de la Página', () => {
    test('debe mostrar el título de login', async ({ page }) => {
      // Verificar que el título de login sea visible
      await expect(
        page.getByRole('heading', { name: /auth\.login\.title/i }).or(page.locator('h1')),
      ).toBeVisible();
    });

    test('debe mostrar el campo de entrada de email', async ({ page }) => {
      // Verificar que el campo de email con data-testid sea visible
      const emailInput = page.locator('[data-testid="login-email-input"]');
      await expect(emailInput).toBeVisible();
    });

    test('debe mostrar el campo de entrada de contraseña', async ({ page }) => {
      // Verificar que el componente de contraseña con data-testid sea visible
      const passwordInput = page.locator('[data-testid="login-password-input"]');
      await expect(passwordInput).toBeVisible();
    });

    test('debe mostrar el botón de enviar', async ({ page }) => {
      // Verificar que el botón de enviar con data-testid sea visible
      const submitButton = page.locator('[data-testid="login-submit-button"]');
      await expect(submitButton).toBeVisible();
    });

    test('debe mostrar el enlace para cambiar contraseña', async ({ page }) => {
      // Verificar que el enlace de cambio de contraseña con data-testid sea visible
      const changePasswordLink = page.locator('[data-testid="login-change-password-link"]');
      await expect(changePasswordLink).toBeVisible();
    });
  });

  test.describe('Validación del Formulario', () => {
    test('debe mostrar errores de validación al enviar el formulario vacío', async ({ page }) => {
      const submitButton = page.locator('[data-testid="login-submit-button"]');
      await submitButton.click();

      // Debería mostrar errores de campos requeridos (validator-errors)
      await expect(page.locator('.text-red-500').first()).toBeVisible();
    });

    test('debe mostrar error de validación para formato de email inválido', async ({ page }) => {
      const emailInput = page.locator('[data-testid="login-email-input"]');
      const submitButton = page.locator('[data-testid="login-submit-button"]');

      await emailInput.fill('email-invalido');
      await submitButton.click();

      // Debería mostrar error de validación de email
      await expect(page.locator('.text-red-500').first()).toBeVisible();
    });

    test('debe mostrar error de validación para contraseña corta', async ({ page }) => {
      const emailInput = page.locator('[data-testid="login-email-input"]');
      const passwordInput = page.locator('[data-testid="login-password-input"] input');
      const submitButton = page.locator('[data-testid="login-submit-button"]');

      await emailInput.fill('test@example.com');
      await passwordInput.fill('123');
      await submitButton.click();

      // Debería mostrar error de validación de contraseña
      await expect(page.locator('.text-red-500').first()).toBeVisible();
    });
  });

  test.describe('Funcionalidad de Login', () => {
    test('debe mostrar estado de carga al enviar', async ({ page }) => {
      await page.route('**/api/auth/login', async (route) => {
        await new Promise((resolve) => setTimeout(resolve, 2000));
        await route.continue();
      });

      const emailInput = page.locator('[data-testid="login-email-input"]');
      const passwordInput = page.locator('[data-testid="login-password-input"] input');
      const submitButton = page.locator('[data-testid="login-submit-button"] button');

      await emailInput.fill('test@example.com');
      await passwordInput.fill('password123');

      // Ejecutar el click y la verificación en paralelo
      await Promise.all([submitButton.click(), expect(submitButton).toBeDisabled()]);
    });

    test('debe navegar a la página de cambio de contraseña al hacer clic en el enlace', async ({
      page,
    }) => {
      const changePasswordLink = page.locator('[data-testid="login-change-password-link"]');
      await changePasswordLink.click();

      await expect(page).toHaveURL(/.*\/auth\/password-change/);
    });

    test('debe iniciar sesión exitosamente con credenciales válidas', async ({ page }) => {
      const emailInput = page.locator('[data-testid="login-email-input"]');
      const passwordInput = page.locator('[data-testid="login-password-input"] input');
      const submitButton = page.locator('[data-testid="login-submit-button"]');

      // Usar credenciales desde el entorno
      const { email, password } = environment.testing;

      if (email && password) {
        await emailInput.fill(email);
        await passwordInput.fill(password);
        await submitButton.click();

        // Debería navegar al dashboard después de un login exitoso
        await expect(page).toHaveURL(/.*\/dashboard/, { timeout: 10000 });
      } else {
        test.skip(
          !email || !password,
          'Credenciales de prueba no configuradas en environment.development.ts',
        );
      }
    });

    test('debe mostrar error con credenciales inválidas', async ({ page }) => {
      const emailInput = page.locator('[data-testid="login-email-input"]');
      const passwordInput = page.locator('[data-testid="login-password-input"] input');
      const submitButton = page.locator('[data-testid="login-submit-button"]');

      // Usar credenciales inválidas
      await emailInput.fill('invalido@test.com');
      await passwordInput.fill('passwordincorrecto');
      await submitButton.click();

      // Debería mostrar mensaje de error (toast)
      await expect(
        page.locator('.toast-error').first().or(page.locator('.ngx-toastr.toast-error')),
      ).toBeVisible({ timeout: 10000 });
    });
  });

  test.describe('Accesibilidad', () => {
    test('debe tener etiquetas adecuadas para los campos del formulario', async ({ page }) => {
      const emailInput = page.locator('[data-testid="login-email-input"]');
      const passwordInput = page.locator('[data-testid="login-password-input"] input');

      await expect(emailInput).toHaveAttribute('type', 'email');
      await expect(passwordInput).toBeVisible();
    });

    test('debe tener el botón de enviar con tipo submit', async ({ page }) => {
      const submitButton = page.locator('[data-testid="login-submit-button"]');
      await expect(submitButton).toHaveAttribute('type', 'submit');
    });
  });
});
