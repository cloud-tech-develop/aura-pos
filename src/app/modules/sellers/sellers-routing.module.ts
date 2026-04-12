import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'list',
    loadComponent: () =>
      import('@module-sellers/list/ui/index-list/index-list').then((m) => m.IndexList),
  },
  {
    path: 'form',
    loadComponent: () =>
      import('@module-sellers/form/ui/index-form/index-form').then((m) => m.IndexForm),
  },
  {
    path: 'form/:id',
    loadComponent: () =>
      import('@module-sellers/form/ui/index-form/index-form').then((m) => m.IndexForm),
  },
  {
    path: '',
    redirectTo: 'list',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SellersRoutingModule {}
