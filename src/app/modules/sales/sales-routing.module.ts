import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'point-of-sale',
    loadComponent: () =>
      import('@module-sales/point-of-sale/ui/index-point-of-sale/index-point-of-sale').then((m) => m.IndexPointOfSale),
  },
  {
    path: 'clients',
    loadComponent: () =>
      import('@module-sales/clients/ui/index-clients/index-clients').then((m) => m.IndexClients),
  },
  {
    path: '',
    redirectTo: 'point-of-sale',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SalesRoutingModule {}
