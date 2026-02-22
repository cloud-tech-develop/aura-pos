import { User } from '@core/interfaces/user.interface';

export const MOCK_USERS: User[] = [
  {
    token:
      'eyJhbGciOiJIUzI1NiJ9.eyJlbXByZXNhSWQiOjEsInN1Y3VybSIsImlhdCI6MTc3MTc0MTQ1OSwiZXhwIjoxNzcyMDAwNjU5fQ..mock-token',
    tipoToken: 'Bearer',
    usuarioId: 1,
    username: 'superadmin@gmail.com',
    nombreCompleto: 'Super Admin',
    rol: 'SUPER_ADMIN',
    sucursales: [
      {
        id: 1,
        nombre: 'Sede Centro',
        esDefault: null,
      },
    ],
  },
  {
    token:
      'eyJhbGciOiJIUzI1NiJ9.eyJlbXByZXNhSWQiOjEsInN1Y3VybSIsImlhdCI6MTc3MTc0MTQ1OSwiZXhwIjoxNzcyMDAwNjU5fQ..mock-token',
    tipoToken: 'Bearer',
    usuarioId: 2,
    username: 'admin@gmail.com',
    nombreCompleto: 'Admin Pérez',
    rol: 'ADMIN',
    sucursales: [
      {
        id: 2,
        nombre: 'Sede 2',
        esDefault: null,
      },
    ],
  },
  {
    token:
      'eyJhbGciOiJIUzI1NiJ9.eyJlbXByZXNhSWQiOjEsInN1Y3VybSIsImlhdCI6MTc3MTc0MTQ1OSwiZXhwIjoxNzcyMDAwNjU5fQ..mock-token',
    tipoToken: 'Bearer',
    usuarioId: 3,
    username: 'cajero@gmail.com',
    nombreCompleto: 'Cajero Pérez',
    rol: 'CAJERO',
    sucursales: [
      {
        id: 3,
        nombre: 'Sede 3',
        esDefault: null,
      },
    ],
  },
];

export const MOCK_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-token';
