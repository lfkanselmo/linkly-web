# linkly-web

Dashboard de Linkly: acortar URLs, ver el código QR, copiar el link y revisar la analítica de
clics. Angular 21, standalone, Signals — sin NgRx ni Angular Material, con un sistema de
componentes propio ("Voltaje", violeta eléctrico). El diseño completo está en
[`SAD_Linkly_Acortador_Analitica.md`](../SAD_Linkly_Acortador_Analitica.md).

## Desarrollo local

Necesita `linkly-api` corriendo en `http://localhost:8080` (ver su propio README) con CORS
habilitado para `http://localhost:4200`, que es el default.

```bash
npm install
ng serve
```

Abrir `http://localhost:4200`.

## Tests y build

```bash
ng lint
ng test
ng build
```

`ng test` corre con Vitest sobre jsdom — hay dos polyfills en `src/test-setup.ts`
(`matchMedia`, `ResizeObserver`) porque jsdom no los implementa y el `ThemeService` y
`ngx-echarts` los necesitan.

## Variables de entorno

La URL de la API se resuelve en tiempo de build, no en tiempo de ejecución — es una SPA estática
sin backend propio. En desarrollo usa `src/environments/environment.ts`
(`http://localhost:8080/api/v1`); en el build de Docker, el `Dockerfile` reemplaza el placeholder
de `src/environments/environment.prod.ts` con el build arg `API_BASE_URL`.
