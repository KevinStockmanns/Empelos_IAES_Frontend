import { Component, signal, Signal, WritableSignal } from '@angular/core';
import { HeaderComponent } from '../../../components/header/header.component';
import { UsuarioService } from '../../../services/usuario-service.service';
import { ButtonComponent } from '../../../components/button/button.component';
import { Usuario, UsuarioListado } from '../../../models/usuario.model';
import { LoaderComponent } from '../../../components/loader/loader.component';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { NotificationService } from '../../../services/notification.service';
import { DecimalPipe } from '@angular/common';

@Component({
    selector: 'app-users-list-page',
    imports: [HeaderComponent, ButtonComponent, LoaderComponent, RouterModule, DecimalPipe],
    templateUrl: './users-list-page.component.html',
    styleUrl: './users-list-page.component.css'
})
export class UsersListPage {
  loading = true;
  usuarios: WritableSignal<UsuarioListado[]> = signal([]);
  roles:string [] = [];
  selectedRol:string = 'EGRESADO';
  currentPage = 1;

  constructor(
    protected usuarioService: UsuarioService,
    private noti:NotificationService
  ){
    forkJoin([
      this.usuarioService.getRoles(),
      this.usuarioService.listarUsuarios(this.currentPage, this.selectedRol)
    ]).subscribe({
      next: ([roles, ususarios])=>{
        this.roles = roles.roles;
        this.usuarios.update(prev=> [...prev, ...ususarios.content as UsuarioListado[]])
        this.loading = false;
        this.currentPage++;
      },
      error:err=>{
        this.loading = false;
        noti.notificateErrorsResponse(err.error, 'Ocurrio un error al cargar los usuarios')
      }
    })
  }


  applyFilters(rol:string){
    this.selectedRol = rol;
    this.currentPage = 1;
    this.usuarios.set([]);
    this.loadUsers(this.currentPage, this.selectedRol);
  }

  private loadUsers(page:number, rol:string){
    this.loading = true;
    this.usuarioService.listarUsuarios(page, rol).subscribe({
      next: res=>{
        this.loading = false;
        this.usuarios.update(prev=> [...prev, ...res.content as UsuarioListado[]]);
        this.currentPage++;
      },
      error: err=>{
        this.loading=false;
        this.noti.notificateErrorsResponse(err.error, 'Ocurrio un error al cargar los usuarios')
      }
    })
  }
}
