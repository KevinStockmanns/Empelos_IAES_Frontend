import { Route, Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { loggedGuard } from './guards/logged.guard';
import { notLoggedGuard } from './guards/not-logged.guard';
import { isAdminGuard } from './guards/is-admin.guard';
import { inject } from '@angular/core';
import { UsuarioService } from './services/usuario-service.service';
import { onExitGuard } from './guards/on-exit.guard';
import { RegisterComponent } from './pages/register/register.component';



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
      
    },{
      path: 'exp',
      title: 'Experiencia Laboral | Empleos IAES',
      loadComponent: ()=>import('./pages/usuario/experiencia-crud/experiencia-crud.component').then(el=>el.ExperienciaCrudPage)
    },{
      path: 'change-password',
      title: 'Cambiar Clave | Empleos IAES',
      loadComponent: ()=> import('./pages/usuario/change-password/change-password.component').then(el=>el.ChangePasswordPage)
    }]
  }]

}

const empresas:Route ={
  path: 'empresas',
  children: [{
    path: '',
    loadComponent: ()=> import('./pages/empresa/empresa-list-page/empresa-list-page.component').then(el=>el.EmpresaListPage),
    title: 'Empresas | Empleos IAES'
  },{
    path:'create',
    loadComponent:()=>import('./pages/empresa/create-empresa-page/create-empresa-page.component').then(el=>el.CreateEmpresaPage),
    title:'Crear Empresa | Empleos IAES'
  },{
    path: 'update',
    loadComponent:()=>import('./pages/empresa/create-empresa-page/create-empresa-page.component').then(el=>el.CreateEmpresaPage),
    title:'Actualizar Empresa | Empleos IAES',
  },{
    path: ':id',
    loadComponent: ()=> import('./pages/empresa/empresa-page/empresa-page.component').then(el=>el.EmpresaPage),
    title: 'Empresa | Empleos IAES',
    // data : {renderMode: 'ssr'}
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
      data : {renderMode: 'ssr'},
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
        },{
          path: 'exp',
          title: 'Experiencia Laboral | Empleos IAES',
          loadComponent: ()=>import('./pages/usuario/experiencia-crud/experiencia-crud.component').then(el=>el.ExperienciaCrudPage)
        }
      ],
    },
    {
      path: ':id/upload-file',
      data : {renderMode: 'ssr'},
      loadComponent: () =>
        import(
          './pages/upload-file-page/upload-file-page.component'
        ).then((el) => el.UploadFilePage),
      title: 'Archivos | Empleos IAES',
    },
    {
      path: ':id',
      data : {renderMode: 'ssr'},
      loadComponent: () =>
        import(
          './pages/usuario/profile-page/profile-page.component'
        ).then((el) => el.ProfilePageComponent),
      title: 'Perfil | Empleos IAES',
    },
  ],
};


const pasantias: Route = {
  path: 'pasantias',
  children: [{
    path: '',
    title: 'Pasantías | Empleos IAES',
    loadComponent: ()=> import('./pages/pasantia/inicio/pasantia.component').then(el=>el.PasantiaPage),
  },{
    path: 'create',
    title : 'Crear Pasantía | Empleos IAES',
    loadComponent: ()=> import('./pages/pasantia/crud-form/crud-form.component').then(el=>el.CrudFormComponent)
  },{
    path: 'edit',
    title: 'Editar Pasantía | Empleos IAES',
    loadComponent: ()=> import('./pages/pasantia/crud-form/crud-form.component').then(el=>el.CrudFormComponent)
  }]
}


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
  },{
    path:'register',
    component: RegisterComponent,
    title: 'Registrarme | Empleos IAES',
    canActivate: [notLoggedGuard]
  },{
    path: 'wait',
    title:'Empleos IAES',
    loadComponent: ()=>import('./pages/wait/wait.component').then(el=>el.WaitComponent),
    canActivate: [loggedGuard],
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
      profile,
      empresas,
      pasantias
    ],
  },
];

