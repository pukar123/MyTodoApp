import { Routes } from '@angular/router';
import { authGuard } from './core/auth.guard';

export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'todos' },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login').then((m) => m.Login),
  },
  {
    path: 'todos',
    canActivate: [authGuard],
    loadComponent: () => import('./features/todos/todos').then((m) => m.Todos),
  },
  { path: '**', redirectTo: 'todos' },
];
