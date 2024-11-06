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
    title: 'Iniciar Sesión | Empleos IAES',
  },
  {
    path: 'asd',
    component: LoginComponent,
  },{
    path: 'dashboard',
    component: DashboardComponent,
    title: 'Dashboard | Empleos IAES',
    canActivate: [loggedGuard]
  },{
    path: 'profile',
    loadComponent: ()=> import("./pages/profile/profile.component").then(el=>el.ProfileComponent),
    title: 'Perfil | Empleos IAES'
  }
];
