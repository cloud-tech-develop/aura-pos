import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { UserSessionStore } from '@store/user.session';

export const authGuard: CanActivateFn = () => {
  const sessionStore = inject(UserSessionStore);
  const router = inject(Router);

  if (sessionStore.isLoggedIn()) {
    return true;
  }

  return router.createUrlTree(['/login']);
};

export const guestGuard: CanActivateFn = () => {
  const sessionStore = inject(UserSessionStore);
  const router = inject(Router);

  if (!sessionStore.isLoggedIn()) {
    return true;
  }

  return router.createUrlTree(['/dashboard']);
};

export const moduleGuard = (moduleName: string): CanActivateFn => {
  return () => {
    const sessionStore = inject(UserSessionStore);
    const router = inject(Router);

    // if (sessionStore.hasModule(moduleName)) {
    //   return true;
    // }

    return router.createUrlTree(['/unauthorized']);
  };
};
