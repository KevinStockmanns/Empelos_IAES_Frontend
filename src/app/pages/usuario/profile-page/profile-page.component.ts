import { Component, signal } from '@angular/core';
import { LoaderComponent } from '../../../components/loader/loader.component';
import { UsuarioDetalle } from '../../../models/usuario.model';
import { UsuarioService } from '../../../services/usuario-service.service';
import { NotificationService } from '../../../services/notification.service';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { CompletedProfileComponent } from '../../../components/completed-profile/completed-profile.component';
import { environment } from '../../../../env/env';
import { EducationComponent } from '../../../components/usuario/educacion/educacion.component';
import { DatePipe, Location } from '@angular/common';
import { EmpresaService } from '../../../services/empresa-service.service';
import { EmpresaDetalle } from '../../../models/empresa.model';
import { PasantiaEmpresa } from '../../../models/pasantia.model';
import { ButtonComponent } from "../../../components/button/button.component";
import { MatDialog } from '@angular/material/dialog';
import { GenericModal } from '../../../modals/generic-modal.component';

@Component({
    selector: 'app-profile-page',
    imports: [LoaderComponent, MatIconModule, RouterModule, CompletedProfileComponent, EducationComponent, DatePipe, ButtonComponent],
    templateUrl: './profile-page.component.html',
    styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent {
  loading = signal(true);
  usuarioDetails: UsuarioDetalle|null = null;
  imageURL = environment.imageUrl;
  cvURL = environment.cv;

  constructor(
    protected usuarioService:UsuarioService,
    private activatedRoute:ActivatedRoute,
    private noti:NotificationService,
    private router:Router,
    private empresaService:EmpresaService,
    private location: Location,
    private dialog:MatDialog,
  ){
    let id:unknown = usuarioService.getSelectedUsuario()?.id;
    if(!id){
      id = usuarioService.getUsuario()?.id;
    }
    this.usuarioService.getUsuarioDetalles(id as number).subscribe({
      next: res=>{
        this.loading.set(false);
        this.usuarioDetails = res;
      },
      error:err=>{
        
        noti.notificateErrorsResponse(err.error);
        // router.navigate(['/']);
        location.back();
      }
    });
  }


  onToggleEstado(){
    let privado = this.usuarioDetails?.estado == 'PRIVADO'
    let dialogRef = this.dialog.open(GenericModal,{
      data:{
        textTitle: privado ? 'Publicar Perfil' : 'Ocultar Perfil',
        text: privado ? '¿Estas seguro de publicar el perfil?' : '¿Estas seguro de ocultar el perfil?',
        textCancelar: 'Cancelar',
        textConfirmar: privado ? 'Publicar' : 'Ocultar'
      }
    })


    dialogRef.afterClosed().subscribe({
      next:res=>{
        if(res){
          this.usuarioService.postPerfilEstado().subscribe({
            next:res=>{
              if(this.usuarioDetails){
                this.usuarioDetails.estado = res
              }
            },
            error:err=>{
              this.noti.notificateErrorsResponse(err.error)
            }
          })
        }
      }
    })
  }

  getFullName(){
    return this.usuarioService.getFullName(this.usuarioDetails as UsuarioDetalle);
  }
  getEdad(){
    return this.usuarioService.getYearsOld(this.usuarioDetails as UsuarioDetalle);
  }
  isOwner(){
    return this.usuarioService.isOwner(this.usuarioDetails as UsuarioDetalle);
  }
  hasOneHabilidad(value:string){
    return this.usuarioDetails?.habilidades.some(el=> el.tipo == value);
  }
  getHabilidades(value:string){
    return this.usuarioDetails?.habilidades.filter(el=>el.tipo == value) ?? [];
  }getId():number {
    return this.usuarioDetails?.id as number;
  }


  onSelectEmpresa(empresa:EmpresaDetalle|PasantiaEmpresa){
    this.empresaService.selectEmpresa(empresa);
  }
}
