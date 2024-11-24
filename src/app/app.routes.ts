import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { loggedGuard } from './guards/logged.guard';
import { notLoggedGuard } from './guards/not-logged.guard';
import { isAdminGuard } from './guards/is-admin.guard';

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
    canActivate: [notLoggedGuard]
  },{
    path: 'dashboard',
    component: DashboardComponent,
    title: 'Dashboard | Empleos IAES',
    canActivate: [loggedGuard]
  },{
    path: 'users',
    children: [{
      path: '',
      loadComponent: ()=> import('./pages/usuario/users-list-page/users-list-page.component').then(el=>el.UsersListPage),
      title : 'Usuarios | Empleos IAES',
      canActivate: [loggedGuard, isAdminGuard]
    },{
      path: 'create',
      loadComponent: ()=> import('./pages/usuario/create-usuario-page/create-usuario-page.component').then(el=>el.CreateUsuarioPage),
      title: 'Crear Usuario | Empleos IAES'
    },{
      path: ':id/edit',
      loadComponent: ()=>import('./pages/usuario/edit-profil-page/edit-profil-page.component').then(el=>el.EditProfilPage),
      title: 'Editar Perfil | Empleos IAES'
    },{
      path: ':id/upload-file',
      loadComponent: ()=>import('./pages/upload-file-page/upload-file-page.component').then(el=>el.UploadFilePage),
      title: 'Archivos | Empleos IAES'
    },{
      path: ':id',
      loadComponent: ()=> import('./pages/usuario/profile-page/profile-page.component').then(el=>el.ProfilePageComponent),
      title: 'Perfil | Empleos IAES'
    }],
  }
];
