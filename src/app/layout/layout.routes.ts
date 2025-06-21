import { Routes } from '@angular/router';

export const layoutRoutes: Routes = [
 {
  path: '', loadComponent: () => import('./layout.page').then(m => m.LayoutPage), children: [
   { path: '', redirectTo: 'home', pathMatch: 'full' },
   { path: 'home', loadComponent: () => import('./home/home.page').then(m => m.HomePage) }
  ]
 }
];