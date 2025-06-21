import { Routes } from '@angular/router';

export const lcRoutes: Routes = [
 {
  path: '', loadComponent: () => import('./login-container.page').then(m => m.LoginContainerPage), children: [
   { path: '', redirectTo: 'login', pathMatch: 'full' },
   { path: 'login', loadComponent: () => import('./login/login.page').then(m => m.LoginPage) },
   { path: 'signup', loadComponent: () => import('./signup/signup.page').then(m => m.SignupPage) },
   { path: 'forgot-password', loadComponent: () => import('./forgot-password/forgot-password.page').then(m => m.ForgotPasswordPage) }
  ]
 }
];