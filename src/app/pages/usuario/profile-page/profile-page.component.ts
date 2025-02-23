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
import { DatePipe } from '@angular/common';
import { EmpresaService } from '../../../services/empresa-service.service';
import { EmpresaDetalle } from '../../../models/empresa.model';

@Component({
    selector: 'app-profile-page',
    imports: [LoaderComponent, MatIconModule, RouterModule, CompletedProfileComponent, EducationComponent, DatePipe],
    templateUrl: './profile-page.component.html',
    styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent {
  loading = signal(true);
  usuarioDetails: UsuarioDetalle|null = null;
  imageURL = environment.imageUrl;

  constructor(
    protected usuarioService:UsuarioService,
    private activatedRoute:ActivatedRoute,
    private noti:NotificationService,
    private router:Router,
    private empresaService:EmpresaService
  ){
    let id:unknown = usuarioService.getSelectedUsuario()?.id;
    if(!id){
      id = usuarioService.getUsuario()?.id;
    }
    this.usuarioService.getUsuarioDetalles(id as number).subscribe({
      next: res=>{
        this.loading.set(false);
        this.usuarioDetails = res;
        console.log(res);
      },
      error:err=>{
        this.loading.set(false);
        console.log(err);
        
        // noti.notificateErrorsResponse(err.error);
        // router.navigate(['/']);
      }
    });
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


  onSelectEmpresa(empresa:EmpresaDetalle){
    this.empresaService.selectEmpresa(empresa);
  }
}
