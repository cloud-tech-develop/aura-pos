import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('@module-auth/login/ui/index-login/index-login').then((m) => m.IndexLogin),
  },
  {
    path: 'password-change',
    loadComponent: () =>
      import('@module-auth/password-change/ui/index-password-change/index-password-change').then(
        (m) => m.IndexPasswordChange,
      ),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class AuthRoutingModule {}
