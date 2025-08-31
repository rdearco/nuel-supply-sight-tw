import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStore } from '@ngrx/store';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { productsReducer } from './store/products.state';
import { uiReducer } from './store/ui.state';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideStore({
      products: productsReducer,
      ui: uiReducer
    }),
    provideStoreDevtools({
      maxAge: 25,
      logOnly: false,
      autoPause: true,
    })
  ]
};
