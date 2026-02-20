import { test, expect } from '@playwright/test';
import { MOCK_USERS, MOCK_TOKEN } from '../src/app/core/mocks/user.mock';

test.describe('User Session Store', () => {
  test('should have mock users defined', () => {
    expect(MOCK_USERS).toHaveLength(3);
    expect(MOCK_USERS[0].role).toBe('admin');
    expect(MOCK_USERS[1].role).toBe('manager');
    expect(MOCK_USERS[2].role).toBe('cashier');
  });

  test('should have mock token defined', () => {
    expect(MOCK_TOKEN).toBeTruthy();
    expect(MOCK_TOKEN.length).toBeGreaterThan(0);
  });

  test('admin user should have all modules', () => {
    const admin = MOCK_USERS.find((u) => u.role === 'admin');
    expect(admin?.modules).toContain('dashboard');
    expect(admin?.modules).toContain('sales');
    expect(admin?.modules).toContain('inventory');
    expect(admin?.modules).toContain('customers');
    expect(admin?.modules).toContain('reports');
    expect(admin?.modules).toContain('settings');
    expect(admin?.modules).toContain('admin');
  });

  test('cashier user should have limited modules', () => {
    const cashier = MOCK_USERS.find((u) => u.role === 'cashier');
    expect(cashier?.modules).toContain('sales');
    expect(cashier?.modules).toContain('customers');
    expect(cashier?.modules).not.toContain('admin');
    expect(cashier?.modules).not.toContain('inventory');
  });
});
