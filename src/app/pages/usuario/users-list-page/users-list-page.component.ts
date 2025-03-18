import { Component, ElementRef, inject, PLATFORM_ID, signal, Signal, viewChild, WritableSignal } from '@angular/core';
import { UsuarioService } from '../../../services/usuario-service.service';
import { ButtonComponent } from '../../../components/button/button.component';
import {  UsuarioDetalle, UsuarioListado } from '../../../models/usuario.model';
import { LoaderComponent } from '../../../components/loader/loader.component';
import { RouterModule } from '@angular/router';
import { forkJoin } from 'rxjs';
import { NotificationService } from '../../../services/notification.service';
import { DecimalPipe, isPlatformBrowser } from '@angular/common';
import { FiltersComponent } from '../../../components/filters/filters.component';
import { Filtro, getDataOfFiltro } from '../../../models/filter.model';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatDialog } from '@angular/material/dialog';
import { GenericModal } from '../../../modals/generic-modal.component';
import { AdminInfo } from '../../../models/paginacion.model';
import Aos from 'aos';


@Component({
    selector: 'app-users-list-page',
    imports: [ButtonComponent, LoaderComponent, RouterModule, DecimalPipe, FiltersComponent, MatIconModule, MatTooltipModule, MatMenuModule, MatTooltipModule],
    templateUrl: './users-list-page.component.html',
    styleUrl: './users-list-page.component.css'
})
export class UsersListPage {
  loading = true;
  usuarios: WritableSignal<UsuarioListado[]> = signal([]);
  roles:string [] = [];
  currentPage = 1;
  usuarioActual;

  adminInfo: AdminInfo|undefined = undefined;


  pagination = signal({
    usuarios: {page:0, totalPages:0, hasMore:true}
  })
  loaders = signal({
    usuarios: false
  })
  centinelaUsuarios = viewChild<ElementRef<HTMLDivElement>>('centinelaUsuarios')

  toolTipEstado = 'SOLICITADO: Usuario se registró y esta a la espera del alta.&#10;ALTA: Usuario fue cargado por adminsitrador';

  initFiltros = [
    {type:'option', name:'rol', nameText:'Roles', multiple:true, values: [{value: 'ALUMNO', selected: false}, {value: 'EGRESADO', selected: false}, {value: 'ADMIN', selected: false}, {value: 'EMPRESA', selected: false}]},
    {type: 'text', name:'nombre', nameText: 'Usuario', value: ''},
    {type: 'text', name:'dni', nameText: 'DNI', value: ''},
    {type: 'text', name:'correo', nameText: 'Correo', value: ''},
    {type: 'text', name:'cargo', nameText: 'Cargo/Puesto', value: ''},
    {type: 'text', name:'educacion', nameText: 'Educación', value: ''},
    {type: 'text', name:'habilidad', nameText: 'Habilidad', value: ''},
    {type: 'option', name:'licencia', nameText: 'Con Licencia de Conducir', values: [{value: 'NO', selected:false}, {value:'SI', selected:false}]},
    {type:'option', name:'estado', nameText:'Estado', multiple:false, values: [{value: 'SOLICITADO', selected: false}, {value: 'ALTA', selected: false}, {value: 'PUBLICO', selected: false}, {value: 'PRIVADO', selected: false}, {value: 'BLOQUEADO', selected: false},{value: 'BAJA', selected: false}, {value: 'RECHAZADO', selected: false}]},
    {type: 'range', name:'edad', nameText: 'Edad', values: [{value: ''},{value:''}]},
    {type:'option', name:'orderBy', nameText:'Ordenar Por', multiple:false, values: [{value: 'NOMBRE', selected: true}, {value: 'EDAD', selected: false}]},
    {type:'option', name:'order', nameText:'Orden', multiple:false, values: [{value: 'ASCENDENTE', selected: true}, {value: 'DESCENDENTE', selected: false}]},

  ];;
  filtros:Filtro[] = [
    {type:'option', name:'rol', nameText:'Roles', multiple:true, values: [{value: 'ALUMNO', selected: false}, {value: 'EGRESADO', selected: false}, {value: 'ADMIN', selected: false}, {value: 'EMPRESA', selected: false}]},
    {type: 'text', name:'nombre', nameText: 'Usuario', value: ''},
    {type: 'text', name:'dni', nameText: 'DNI', value: ''},
    {type: 'text', name:'correo', nameText: 'Correo', value: ''},
    {type: 'text', name:'cargo', nameText: 'Cargo/Puesto', value: ''},
    {type: 'text', name:'educacion', nameText: 'Educación', value: ''},
    {type: 'text', name:'habilidad', nameText: 'Habilidad', value: ''},
    {type: 'option', name:'licencia', nameText: 'Con Licencia de Conducir', values: [{value: 'NO', selected:false}, {value:'SI', selected:false}]},
    {type:'option', name:'estado', nameText:'Estado', multiple:false, values: [{value: 'SOLICITADO', selected: false}, {value: 'ALTA', selected: false}, {value: 'PUBLICO', selected: false}, {value: 'PRIVADO', selected: false}, {value: 'BLOQUEADO', selected: false},{value: 'BAJA', selected: false}, {value: 'RECHAZADO', selected: false}]},
    {type: 'range', name:'edad', nameText: 'Edad', values: [{value: ''},{value:''}]},
    {type:'option', name:'orderBy', nameText:'Ordenar Por', multiple:false, values: [{value: 'NOMBRE', selected: true}, {value: 'EDAD', selected: false}]},
    {type:'option', name:'order', nameText:'Orden', multiple:false, values: [{value: 'ASCENDENTE', selected: true}, {value: 'DESCENDENTE', selected: false}]},

  ];

  constructor(
    protected usuarioService: UsuarioService,
    private noti:NotificationService,
    private dialog:MatDialog
  ){
    this.usuarioActual = usuarioService.getUsuario();
    this.usuarioService.listarUsuarios(this.currentPage).subscribe({
      next: (res)=>{
        this.usuarios.update(prev=> [...prev, ...res.content as UsuarioListado[]])
        this.loading = false;
        this.currentPage++;
        this.adminInfo = res.adminInfo

        this.pagination.update(prev=> ({...prev, usuarios: {page: res.page, totalPages: res.totalPages, hasMore: res.page < res.totalPages }}));


        if(this.centinelaUsuarios()){
          let observer = new IntersectionObserver((entries)=>{

            entries.forEach(el=>{
              if(el.isIntersecting){
                this.loadUsers(++this.pagination().usuarios.page, getDataOfFiltro(this.filtros))
              }
            })
          })

          observer.observe(this.centinelaUsuarios()?.nativeElement as HTMLDivElement)
        }
        
      },
      error:err=>{
        this.loading = false;
        noti.notificateErrorsResponse(err.error, 'Ocurrio un error al cargar los usuarios')
      }
    })


    if(isPlatformBrowser(inject(PLATFORM_ID))){
      Aos.init()
      setTimeout(() => {
        Aos.refresh()
      }, 1000);
    }
  }

  changeFiltros(e:any){
    this.currentPage = 1;
    this.usuarios.set([])
    this.filtros = e;
    this.pagination.update(prev=> ({...prev, usuarios: {page: 0, totalPages: 0, hasMore: true}}))

    

    let filterData = getDataOfFiltro(this.filtros);
    // console.log(filterData);
    
    this.loadUsers(++this.pagination().usuarios.page, filterData)
  }

  private loadUsers(page:number, data:any){
    if(this.pagination().usuarios.hasMore && !this.loaders().usuarios){
      this.loaders.update(prev=> ({...prev, usuarios: true}))
      this.usuarioService.listarUsuarios(page, data).subscribe({
        next: res=>{
          this.adminInfo = res.adminInfo
          this.usuarios.update(prev=> [...prev, ...res.content as UsuarioListado[]]);
          this.pagination.update(prev=> ({...prev, usuarios: {page: res.page, totalPages: res.totalPages, hasMore: res.page < res.totalPages}}))
          this.loaders.update(prev=> ({...prev, usuarios: false}))
        },
        error: err=>{
          // console.log(err);
          this.loaders.update(prev=> ({...prev, usuarios: false}))
          this.noti.notificateErrorsResponse(err.error, 'Ocurrio un error al cargar los usuarios')
        }
      })
    }
  }


  onBlock(usuario:UsuarioListado){
    let dialogRef = this.dialog.open(GenericModal, {
      data:{
        textTitle:'Bloquear Usuario',
        text: `¿Seguro de que deseas bloquear a ${this.usuarioService.getFullName(usuario)}?`,
        textCancelar: 'Cancelar',
        textConfirmar: 'Bloquear',

      }
    })


    dialogRef.afterClosed().subscribe(res=>{
      if(res){
        console.log("Bloquear");
        this.usuarioService.postUsuarioEstado(usuario.id, {accion:'BLOQUEAR'}).subscribe({
          next: res=>{
            usuario.estado = 'BLOQUEADO'
          },
          error:err=>{
            this.noti.notificateErrorsResponse(err.error)
          }
        })
      }
    })
  }

  onDelete(usuario:UsuarioListado){
    let dialogRef = this.dialog.open(GenericModal, {
      data:{
        textTitle:'Eliminar Usuario',
        text: `¿Seguro de que deseas dar de baja a ${this.usuarioService.getFullName(usuario)}?`,
        textCancelar: 'Cancelar',
        textConfirmar: 'Eliminar',

      }
    })


    dialogRef.afterClosed().subscribe(res=>{
      if(res){
        this.usuarioService.postUsuarioEstado(usuario.id, {accion:'BAJA'}).subscribe({
          next: res=>{
            usuario.estado = 'BAJA'
          },
          error:err=>{
            this.noti.notificateErrorsResponse(err.error)
          }
        })
      }
    })
  }


  onAprobar(usuario:UsuarioListado){
    let dialogRef = this.dialog.open(GenericModal, {
      data:{
        textTitle:`Aprobar Solicitud`,
        text:  `¿Seguro de que deseas aprobar la solicitud de ${this.usuarioService.getFullName(usuario)}?`,
        textCancelar: 'Cancelar',
        textConfirmar:'Aprobar',
      }
    })


    dialogRef.afterClosed().subscribe(res=>{
      if(res){
        this.usuarioService.postUsuarioEstado(usuario.id, {accion:'ALTA'}).subscribe({
          next: res=>{
            usuario.estado = 'ALTA'
            if(this.adminInfo && this.adminInfo.solicitudUsuarios){
              this.adminInfo.solicitudUsuarios--;
            }
          },
          error:err=>{
            this.noti.notificateErrorsResponse(err.error)
          }
        })
      }
    })
  }


  onRechazar(usuario:UsuarioListado){
    let dialogRef = this.dialog.open(GenericModal, {
      data:{
        textTitle:`Rechazar Solicitud`,
        text:  `¿Seguro de que deseas rechazar la solicitud de ${this.usuarioService.getFullName(usuario)}?`,
        textCancelar: 'Cancelar',
        textConfirmar:'Rechazar',
      }
    })


    dialogRef.afterClosed().subscribe(res=>{
      if(res){
        this.usuarioService.postUsuarioEstado(usuario.id, {accion:'RECHAZAR'}).subscribe({
          next: res=>{
            usuario.estado = 'RECHAZADO'
            if(this.adminInfo && this.adminInfo.solicitudUsuarios){
              this.adminInfo.solicitudUsuarios--;
            }
          },
          error:err=>{
            this.noti.notificateErrorsResponse(err.error)
          }
        })
      }
    })
  }


  onRestore(usuario:UsuarioListado, baja:boolean){
    let dialogRef = this.dialog.open(GenericModal, {
      data:{
        textTitle:`${baja ? 'Restablecer' : 'Desbloquear'} Usuario`,
        text: baja ? `¿Seguro de que restablecer a ${this.usuarioService.getFullName(usuario)}?` : `¿Seguro de que deseas desbloquear a ${this.usuarioService.getFullName(usuario)}?`,
        textCancelar: 'Cancelar',
        textConfirmar: baja ? 'Restablecer' : 'Desbloquear',

      }
    })


    dialogRef.afterClosed().subscribe(res=>{
      if(res){
        this.usuarioService.postUsuarioEstado(usuario.id, {accion:'ALTA'}).subscribe({
          next: res=>{
            usuario.estado = 'ALTA'
          },
          error:err=>{
            this.noti.notificateErrorsResponse(err.error)
          }
        })
      }
    })
  }

  onRestoreClave(usuario:UsuarioListado){
    let dialogRef = this.dialog.open(GenericModal, {
      data:{
        textTitle:`Restablecer Clave del Usuario`,
        text:  `¿Seguro de que deseas restablecer la clave a '${usuario.dni || '12345678'}'?`,
        textCancelar: 'Cancelar',
        textConfirmar:'Restablecer',
      }
    })


    dialogRef.afterClosed().subscribe(res=>{
      if(res){
        this.usuarioService.restoreClave(usuario.id).subscribe({
          next: res=>{
            this.noti.notificate('Clave Restablecida', '', false, 5000);
          },
          error:err=>{
            this.noti.notificateErrorsResponse(err.error)
          }
        })
      }
    })
  }

  

  onVerSolicitudes() {
    this.filtros = this.initFiltros;
    this.filtros = this.filtros.map(filtro => {
      if (filtro.name === 'estado' && filtro.values) {
        return {
          ...filtro,
          values: filtro.values.map(v => ({
            ...v,
            selected: v.value === 'SOLICITADO' // Solo 'SOLICITADO' estará seleccionado
          }))
        };
      }
      return filtro;
    });
  
    this.changeFiltros(this.filtros);
  }
  


  onSelectUser(usuario:UsuarioListado){
    this.usuarioService.selectUser(usuario);
  }
}
