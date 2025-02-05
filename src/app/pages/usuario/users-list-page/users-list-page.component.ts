import { Component, signal, Signal, WritableSignal } from '@angular/core';
import { UsuarioService } from '../../../services/usuario-service.service';
import { ButtonComponent } from '../../../components/button/button.component';
import {  UsuarioListado } from '../../../models/usuario.model';
import { LoaderComponent } from '../../../components/loader/loader.component';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { NotificationService } from '../../../services/notification.service';
import { DecimalPipe } from '@angular/common';
import { FiltersComponent } from '../../../components/filters/filters.component';

@Component({
    selector: 'app-users-list-page',
    imports: [ButtonComponent, LoaderComponent, RouterModule, DecimalPipe, FiltersComponent],
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
      this.usuarioService.listarUsuarios(this.currentPage, {rol: this.selectedRol})
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
    this.usuarioService.listarUsuarios(page, {rol}).subscribe({
      next: res=>{
        this.loading = false;
        this.usuarios.update(prev=> [...prev, ...res.content as UsuarioListado[]]);
        this.currentPage++;
      },
      error: err=>{
        this.loading=false;
        console.log(err);
        
        this.noti.notificateErrorsResponse(err.error, 'Ocurrio un error al cargar los usuarios')
      }
    })
  }


  rolesToFilter(){
    return this.roles.map(el=> {
      let data: {value:any, selected?:boolean} = {value:el, selected:false};
      if(el=='EGRESADO'){
        data.selected = true;
      }
      return data;
    });
  }
}
