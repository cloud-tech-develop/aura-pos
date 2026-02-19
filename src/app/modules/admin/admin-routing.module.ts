import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'panel',
    loadComponent: () =>
      import('@module-admin/panel/ui/index-admin/index-admin').then((m) => m.IndexAdmin),
  },
  {
    path: '',
    redirectTo: 'panel',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AdminRoutingModule {}
