import { Routes } from '@angular/router';

export const homeRoutes: Routes = [
 {
  path: '', loadComponent: () => import('./home.page').then(m => m.HomePage), children: [
   { path: '', redirectTo: 'chat', pathMatch: 'full' },
   { path: 'chat', loadComponent: () => import('./chat/chat.page').then(m => m.ChatPage) },
   { path: 'groups', loadComponent: () => import('./groups/groups.page').then(m => m.GroupsPage) },
   { path: 'posts', loadComponent: () => import('./posts/posts.page').then(m => m.PostsPage) }
  ]
 }
];