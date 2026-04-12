import { User } from '@core/interfaces/user.interface';

export const MOCK_USERS: User[] = [
  {
    id: 1,
    email: 'superadmin@cloudtecno.com',
    first_name: 'Admin',
    last_name: 'Cloud Tecno SAS',
    roles: ['SUPERADMIN'],
    token: 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxLCJlbnRlcnByaXNlX2lkIjoxLCJ0ZW5hbnRfaWQiOjEsInNsdWciOiJjbG91ZF90ZWNubyIsImVtYWlsIjoic3VwZXItYWRtaW5AY2xvdWR0ZWNuby5jb20iLCJyb2xlcyI6WyJTVVBFUkFETUlOIl0sImlhdCI6MTc3NTk2OTMzOSwiZXhwIjoxNzc2MDU1NzM5fQ.mDhM2ZHrmAbsFux9EokVhRkyoRhK2RhBSaGBAWtd-dk',
    enterprise: {
      id: 1,
      slug: 'cloud_tecno',
      tenant_id: 1,
    },
  },
  {
    id: 2,
    email: 'admin@gmail.com',
    first_name: 'Admin',
    last_name: 'Pérez',
    roles: ['ADMIN'],
    token: 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoyLCJlbnRlcnByaXNlX2lkIjoxLCJ0ZW5hbnRfaWQiOjEsInNsdWciOiJjbG91ZF90ZWNubyIsImVtYWlsIjoiYWRtaW5AZ21haWwuY29tIiwicm9sZXMiOlsiQURNSU4iXSwiaWF0IjoxNzc1OTY5MzM5LCJleHAiOjE3NzYwNTU3Mzl9.mock-token',
    enterprise: {
      id: 1,
      slug: 'cloud_tecno',
      tenant_id: 1,
    },
  },
  {
    id: 3,
    email: 'cajero@gmail.com',
    first_name: 'Cajero',
    last_name: 'Pérez',
    roles: ['CAJERO'],
    token: 'eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjozLCJlbnRlcnByaXNlX2lkIjoxLCJ0ZW5hbnRfaWQiOjEsInNsdWciOiJjbG91ZF90ZWNubyIsImVtYWlsIjoiY2FqZXJvQGdtYWlsLmNvbSIsInJvbGVzIjpbIkNBSkVSTyJdLCJpYXQiOjE3NzU5NjkzMzksImV4cCI6MTc3NjA1NTczOX0.mock_token',
    enterprise: {
      id: 1,
      slug: 'cloud_tecno',
      tenant_id: 1,
    },
  },
];

export const MOCK_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.mock-token';