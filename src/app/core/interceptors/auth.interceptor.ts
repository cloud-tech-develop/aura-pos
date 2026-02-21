import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { UserSessionStore } from '@store/user.session';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const sessionStore = inject(UserSessionStore);
  const token = sessionStore.getToken();

  if (token) {
    const authReq = req.clone({
      setHeaders: {
        Authorization: `${token}`,
      },
    });
    return next(authReq);
  }

  return next(req);
};

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe();
};
