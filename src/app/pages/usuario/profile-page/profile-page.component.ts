import { Component, signal } from '@angular/core';
import { LoaderComponent } from '../../../components/loader/loader.component';
import { HeaderComponent } from '../../../components/header/header.component';
import { UsuarioDetalle } from '../../../models/usuario.model';
import { UsuarioService } from '../../../services/usuario-service.service';
import { NotificationService } from '../../../services/notification.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [HeaderComponent, LoaderComponent],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent {
  loading = signal(true);
  usuarioDetails: UsuarioDetalle|null = null;

  constructor(
    protected usuarioService:UsuarioService,
    private activatedRoute:ActivatedRoute,
    private noti:NotificationService,
    private router:Router
  ){
    let id:unknown = this.activatedRoute.snapshot.paramMap.get('id');
    this.usuarioService.getUsuarioDetalles(id as number).subscribe({
      next: res=>{
        this.loading.set(false);
        this.usuarioDetails = res;
        console.log(res);
      },
      error:err=>{
        this.loading.set(false);
        console.log(err);
        
        noti.notificateErrorsResponse(err.error);
        router.navigate(['/']);
      }
    });
  }


  getFullName(){
    return this.usuarioService.getFullName(this.usuarioDetails as UsuarioDetalle);
  }
  getEdad(){
    return this.usuarioService.getYearsOld(this.usuarioDetails as UsuarioDetalle);
  }
}
