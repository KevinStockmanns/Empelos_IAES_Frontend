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
  },{
    path: 'users',
    children: [{
      path: '',
      loadComponent: ()=> import('./pages/usuario/users-list-page/users-list-page.component').then(el=>el.UsersListPage),
      title : 'Usuarios | Empleos IAES',
      canActivate: [loggedGuard]
    },{
      path: 'create',
      loadComponent: ()=> import('./pages/usuario/create-usuario-page/create-usuario-page.component').then(el=>el.CreateUsuarioPage),
      title: 'Crear Usuario | Empleos IAES'
    },{
      path: ':id',
      loadComponent: ()=> import('./pages/usuario/profile-page/profile-page.component').then(el=>el.ProfilePageComponent),
      title: 'Perfil | Empleos IAES'
    }]
  }
];
