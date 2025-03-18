import { Component, effect, input, OnInit, signal, ViewEncapsulation } from '@angular/core';
import { Educacion } from '../../../models/educacion.model';
import { MatIconModule } from '@angular/material/icon';
import { ButtonComponent } from '../../button/button.component';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../../../services/usuario-service.service';
import { NotificationService } from '../../../services/notification.service';
import { LoaderComponent } from '../../loader/loader.component';
import { UsuarioDetalle } from '../../../models/usuario.model';

@Component({
  selector: 'app-education-user',
  imports: [MatIconModule, RouterModule, ButtonComponent, LoaderComponent],
  templateUrl: './educacion.component.html',
  styleUrl: './educacion.component.css',
})
export class EducationComponent implements OnInit {
  educacion = input.required<Educacion[]|undefined>();
  edit = input(false);
  userID = input();
  loading = signal(false);

  activeEducacion:Educacion[] = [];

  toDelete: any[] = [];

  link = '';
  inProfilePage = false;


  constructor(private usuarioService:UsuarioService,
    private noti:NotificationService,
    private router:Router
  ){

    if(router.url.includes('profile')){
      this.inProfilePage = true;
    }
        
    effect(()=>{
      if(this.educacion()){
        this.activeEducacion =[...this.educacion()!];
      }
    })
  }

  ngOnInit() {
    if(this.router.url.includes('/dashboard/profile')){
      this.link = 'education';
    }else{
      this.link = `/dashboard/users/${this.userID()}/edit/education`;
    }
  }

  toggleDelete(el:any){
    if(!this.loading()){
      let find = this.toDelete.find(i=>i==el);
      if(find){
        this.toDelete = this.toDelete.filter(i=> i!=el);
      }else{
        this.toDelete.push(el);
      }
    }
  }

  willDelete(el:any){
    return this.toDelete.find(e=>e==el);
  }

  delete(){
    let data = this.toDelete.map(el=> ({
      accion: 'ELIMINAR',
      id:el
    }));

    this.loading.set(true);
    this.usuarioService.postEducacion(this.userID(), {titulos: data}).subscribe({
      next:res=>{
        let userActual = this.usuarioService.getSelectedUsuario() as UsuarioDetalle;
        this.loading.set(false);
        this.activeEducacion = this.activeEducacion.filter(
          edu => !this.toDelete.some(id => id === edu.idTituloDetalle)
        );

        userActual.educacion = this.activeEducacion;
        this.usuarioService.selectUser(userActual);
        
        this.toDelete = [];
      },
      error:err=>{
        this.loading.set(false);
        this.noti.notificateErrorsResponse(err.error);
      }
    })

    
  }

  onEdit(ed:Educacion){
    this.usuarioService.storageEduacion(ed);
  }
}
