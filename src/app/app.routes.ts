import { Routes } from '@angular/router';
import { MainLayoutComponent } from '@shared/components/main-layout/main-layout.component';

export const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('@module-auth/auth-routing.module').then((m) => m.AuthRoutingModule),
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'admin',
        loadChildren: () =>
          import('@module-admin/admin-routing.module').then((m) => m.AdminRoutingModule),
      },
      {
        path: 'customers',
        loadChildren: () =>
          import('@module-customers/customers-routing.module').then(
            (m) => m.CustomersRoutingModule,
          ),
      },
      {
        path: 'dashboard',
        loadComponent: () =>
          import('@module-dashboard/dashboard.component').then((m) => m.DashboardComponent),
      },
      {
        path: 'inventory',
        loadChildren: () =>
          import('@module-inventory/inventory-routing.module').then(
            (m) => m.InventoryRoutingModule,
          ),
      },
      {
        path: 'reports',
        loadChildren: () =>
          import('@module-reports/reports-routing.module').then((m) => m.ReportsRoutingModule),
      },
      {
        path: 'sales',
        loadChildren: () =>
          import('@module-sales/sales-routing.module').then((m) => m.SalesRoutingModule),
      },
      {
        path: 'settings',
        loadComponent: () =>
          import('@module-settings/settings.component').then((m) => m.SettingsComponent),
      },
    ],
  },
  {
    path: '**',
    redirectTo: 'dashboard',
  },
];
