import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
  isDevMode,
  enableProdMode,
  APP_INITIALIZER,
  inject,
} from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideServiceWorker } from '@angular/service-worker';
import { provideTranslateService, TranslateLoader } from '@ngx-translate/core';
import { CustomTranslateLoader } from '@services/custom-translate-loader';

import { routes } from './app.routes';
import { IS_PRODUCTION } from '@core/environment';
import { selfXSSWarning } from '@shared/utils';
import { authInterceptor } from '@core/interceptors';

import { provideStore } from '@ngrx/store';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

import { ConfirmationService, MessageService } from 'primeng/api';
import { provideToastr } from 'ngx-toastr';
import { UserSessionStore } from '@store/user.session';

if (IS_PRODUCTION) {
  enableProdMode();
  if (window) {
    selfXSSWarning();
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes, withComponentInputBinding()),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
    }),
    provideTranslateService({
      loader: {
        provide: TranslateLoader,
        useClass: CustomTranslateLoader,
      },
      fallbackLang: 'es',
    }),
    providePrimeNG({
      theme: {
        preset: Aura,
        options: {
          darkModeSelector: '.dark',
        },
      },
    }),
    provideStore(),
    provideToastr(),
    ConfirmationService,
    MessageService,
    {
      provide: APP_INITIALIZER,
      useFactory:
        (store = inject(UserSessionStore)) =>
        () =>
          store.init(),
      multi: true,
    },
  ],
};
