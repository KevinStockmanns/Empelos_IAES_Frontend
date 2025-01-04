import { Component, effect, input, signal, ViewEncapsulation } from '@angular/core';
import { Educacion } from '../../../models/educacion.model';
import { MatIconModule } from '@angular/material/icon';
import { ButtonComponent } from '../../button/button.component';
import { Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../../../services/usuario-service.service';
import { NotificationService } from '../../../services/notification.service';
import { LoaderComponent } from '../../loader/loader.component';

@Component({
  selector: 'app-education-user',
  imports: [MatIconModule, RouterModule, ButtonComponent, LoaderComponent],
  templateUrl: './educacion.component.html',
  styleUrl: './educacion.component.css',
})
export class EducationComponent {
  educacion = input.required<Educacion[]|undefined>();
  edit = input(false);
  userID = input();
  loading = signal(false);

  activeEducacion:Educacion[] = [];

  toDelete: any[] = [];


  constructor(private usuarioService:UsuarioService,
    private noti:NotificationService,

  ){

    effect(()=>{
      if(this.educacion()){
        this.activeEducacion =[...this.educacion()!];
      }
    })
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
        this.loading.set(false);
        this.activeEducacion = this.activeEducacion.filter(
          edu => !this.toDelete.some(id => id === edu.idTituloDetalle)
        );
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
