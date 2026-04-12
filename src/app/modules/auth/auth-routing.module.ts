import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard, loginGuestGuard } from '@core/guards';
import { AUTH } from '@core/constants';

export const routes: Routes = [
  {
    path: AUTH.LOGIN,
    canActivate: [loginGuestGuard],
    loadComponent: () =>
      import('@module-auth/login/ui/index-login/index-login').then((m) => m.IndexLogin),
  },
  {
    path: AUTH.LOGOUT,
    canActivate: [authGuard],
    loadComponent: () =>
      import('@module-auth/logout/ui/index-logout/index-logout').then((m) => m.IndexLogout),
  },
  {
    path: AUTH.PASSWORD_CHANGE,
    canActivate: [authGuard],
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
