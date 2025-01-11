import { Route, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { loggedGuard } from './guards/logged.guard';
import { notLoggedGuard } from './guards/not-logged.guard';
import { isAdminGuard } from './guards/is-admin.guard';
import { inject } from '@angular/core';
import { UsuarioService } from './services/usuario-service.service';
import { onExitGuard } from './guards/on-exit.guard';



const profile:Route= {
  path: 'profile',
  children: [{
    path: '',
    pathMatch: 'full',
    loadComponent:()=> import('./pages/usuario/profile-page/profile-page.component').then(el=>el.ProfilePageComponent),
    title: 'Perfil',
  },{
    path:'edit',
    loadComponent: ()=> import('./pages/usuario/edit-profil-page/edit-profil-page.component').then(el=>el.EditProfilPage),
    title: 'Editar Perfil',
    children: [{
      path:'education',
      loadComponent: ()=> import('./pages/usuario/education/education.component').then(el=>el.EducationPage),
      title: 'Educación | Empleos IAES',
      canDeactivate: [onExitGuard]
    },{
      path: 'skills',
      title: 'Habilidades | Empleos IAES',
          loadComponent: () =>
            import(
              './pages/usuario/edit-skills-page/edit-skills-page.component'
            ).then((el) => el.EditSkillsPage),
          canDeactivate: [onExitGuard]
      
    }]
  }]

}

const users:Route= {
  path: 'users',
  children: [
    {
      path: '',
      loadComponent: () =>
        import(
          './pages/usuario/users-list-page/users-list-page.component'
        ).then((el) => el.UsersListPage),
      title: 'Usuarios | Empleos IAES',
      canActivate: [loggedGuard],
    },
    {
      path: 'create',
      loadComponent: () =>
        import(
          './pages/usuario/create-usuario-page/create-usuario-page.component'
        ).then((el) => el.CreateUsuarioPage),
      title: 'Crear Usuario | Empleos IAES',
    },
    {
      path: ':id/edit',
      loadComponent: () =>
        import(
          './pages/usuario/edit-profil-page/edit-profil-page.component'
        ).then((el) => el.EditProfilPage),
      title: 'Editar Perfil | Empleos IAES',
      children: [
        {
          path: 'skills',
          title: 'Habilidades | Empleos IAES',
          loadComponent: () =>
            import(
              './pages/usuario/edit-skills-page/edit-skills-page.component'
            ).then((el) => el.EditSkillsPage),
          canDeactivate: [onExitGuard]
        },{
          path:'education',
          title: 'Educación | Empleos IAES',
          loadComponent: ()=>import('./pages/usuario/education/education.component').then(el=>el.EducationPage),
          canDeactivate: [onExitGuard]
        }
      ],
    },
    {
      path: ':id/upload-file',
      loadComponent: () =>
        import(
          './pages/upload-file-page/upload-file-page.component'
        ).then((el) => el.UploadFilePage),
      title: 'Archivos | Empleos IAES',
    },
    {
      path: ':id',
      loadComponent: () =>
        import(
          './pages/usuario/profile-page/profile-page.component'
        ).then((el) => el.ProfilePageComponent),
      title: 'Perfil | Empleos IAES',
    },
  ],
};


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
    canActivate: [notLoggedGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    title: 'Dashboard | Empleos IAES',
    canActivate: [loggedGuard],
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: ()=>{
          let usuarioService = inject(UsuarioService);
          if(usuarioService.isAdmin()){
            return 'users';
          }else{
            return `users/${usuarioService.getUsuario()?.id}`
          }
        }
      },
      users,
      profile
      ,
    ],
  },
];

