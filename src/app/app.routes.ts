import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { loggedGuard } from './guards/logged.guard';

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'login',
    component: LoginComponent,
    title: 'Iniciar Sesión',
  },
  {
    path: 'asd',
    component: LoginComponent,
  },{
    path: 'dashboard',
    component: DashboardComponent,
    title: 'Dashboard',
    canActivate: [loggedGuard]
  }
];
