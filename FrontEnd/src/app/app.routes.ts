import { Routes } from '@angular/router';
import { AdminAuthGuard } from './pages/admin/AdminAuth.guard';
import { UserAuthGuard } from './pages/profile/UserAuth.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    loadComponent: async () => {
      const m = await import('./pages/home/home');
      return m.Home;
    },
  },
  {
    path: 'login',
    loadComponent: async () => {
      const m = await import('./pages/login/login');
      return m.Login;
    },
  },
  {
    path: 'register',
    loadComponent: async () => {
      const m = await import('./pages/register/register');
      return m.Register;
    },
  },
  {
    path: 'admin',
    loadComponent: async () => {
      const m = await import('./pages/admin/admin');
      return m.Admin;
    },
    canActivate: [AdminAuthGuard],
  },
  {
    path: 'profile',
    loadComponent: async () => {
      const m = await import('./pages/profile/profile');
      return m.Profile;
    },
    canActivate: [UserAuthGuard],
  },
];
