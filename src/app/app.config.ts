import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZonelessChangeDetection,
  isDevMode,
  enableProdMode,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { provideServiceWorker } from '@angular/service-worker';

import { routes } from './app.routes';
import { environment } from '@environment/environment';
import { selfXSSWarning } from '@shared/utils';
import { authInterceptor } from '@core/interceptors';

import { provideStore } from '@ngrx/store';
import { providePrimeNG } from 'primeng/config';
import Aura from '@primeuix/themes/aura';

import { ConfirmationService, MessageService } from 'primeng/api';

if (environment.production) {
  enableProdMode();
  if (window) {
    selfXSSWarning();
  }
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideServiceWorker('ngsw-worker.js', {
      enabled: !isDevMode(),
      registrationStrategy: 'registerWhenStable:30000',
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
    ConfirmationService,
    MessageService,
  ],
};
