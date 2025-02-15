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
import { Filtro, getDataOfFiltro } from '../../../models/filter.model';

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
  currentPage = 1;

  filtros:Filtro[] = [
    {type:'option', name:'rol', nameText:'Roles', values: [{value: 'ALUMNO', selected: false}, {value: 'EGRESADO', selected: true}, {value: 'ADMIN', selected: false}, {value: 'EMPRESA', selected: false}]},
    {type: 'text', name:'nombre', nameText: 'Usuario'}
  ];

  constructor(
    protected usuarioService: UsuarioService,
    private noti:NotificationService
  ){
    this.usuarioService.listarUsuarios(this.currentPage, {rol: 'EGRESADO'}).subscribe({
      next: (res)=>{
        this.usuarios.update(prev=> [...prev, ...res.content as UsuarioListado[]])
        this.loading = false;
        this.currentPage++;

        
      },
      error:err=>{
        this.loading = false;
        noti.notificateErrorsResponse(err.error, 'Ocurrio un error al cargar los usuarios')
      }
    })
  }

  changeFiltros(e:any){
    this.currentPage = 1;
    this.usuarios.set([])
    this.filtros = e;
    

    let filterData = getDataOfFiltro(this.filtros);
    
    this.loadUsers(this.currentPage, filterData)
  }

  private loadUsers(page:number, data:any){
    this.loading = true;
    this.usuarioService.listarUsuarios(page, data).subscribe({
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
}
