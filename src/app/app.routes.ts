import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', loadComponent: () => import('./features/shorten/shorten').then((m) => m.Shorten) },
  { path: 'mis-links', loadComponent: () => import('./features/my-links/my-links').then((m) => m.MyLinks) },
];
