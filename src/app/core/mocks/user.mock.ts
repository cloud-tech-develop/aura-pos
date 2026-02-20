import { User } from '@core/interfaces/user.interface';

export const MOCK_USERS: User[] = [
  {
    id: '1',
    email: 'admin@aura.com',
    name: 'Admin User',
    role: 'admin',
    modules: ['dashboard', 'sales', 'inventory', 'customers', 'reports', 'settings', 'admin'],
    avatar: 'avatar-admin.png',
    permissions: ['*'],
  },
  {
    id: '2',
    email: 'manager@aura.com',
    name: 'Manager User',
    role: 'manager',
    modules: ['dashboard', 'sales', 'inventory', 'customers', 'reports'],
    avatar: 'avatar-manager.png',
    permissions: ['sales.read', 'sales.write', 'inventory.read', 'inventory.write'],
  },
  {
    id: '3',
    email: 'cashier@aura.com',
    name: 'Cashier User',
    role: 'cashier',
    modules: ['sales', 'customers'],
    avatar: 'avatar-cashier.png',
    permissions: ['sales.read', 'sales.write', 'customers.read'],
  },
];

export const MOCK_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-token';
