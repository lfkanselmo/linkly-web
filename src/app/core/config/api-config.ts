import { InjectionToken } from '@angular/core';

import { environment } from '../../../environments/environment';

const UNSUBSTITUTED_PLACEHOLDER = '__API_BASE_URL__';

export const API_BASE_URL = new InjectionToken<string>('API_BASE_URL', {
  providedIn: 'root',
  factory: () => {
    if (environment.apiBaseUrl === UNSUBSTITUTED_PLACEHOLDER) {
      throw new Error(
        'API_BASE_URL no fue reemplazado en build time. Este bundle se generó fuera del Dockerfile ' +
          '(que sustituye el placeholder con sed) — usar "docker build" o completar environment.prod.ts a mano.',
      );
    }
    return environment.apiBaseUrl;
  },
});
