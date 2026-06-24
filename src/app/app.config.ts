import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideAnimations } from '@angular/platform-browser/animations';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';

import { authInterceptor } from './interceptors/auth-interceptor';

import { providePrimeNG } from 'primeng/config';
import Lara from '@primeng/themes/lara';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

    provideRouter(routes),

    provideAnimations(),   

    provideClientHydration(withEventReplay()),

    provideHttpClient(
      withFetch(),
      withInterceptors([authInterceptor])
    ),

   
    providePrimeNG({
      theme: {
        preset: Lara
      }
    })
  ]
};
