import { Routes } from '@angular/router';

export const routes: Routes = [
 { path: '', redirectTo: '', pathMatch: 'full' },
 { path: '', loadChildren: () => import('./login-container/login-container.routes').then(m => m.lcRoutes) },
 { path: 'layout', loadChildren: () => import('./layout/layout.routes').then(m => m.layoutRoutes) },
];
