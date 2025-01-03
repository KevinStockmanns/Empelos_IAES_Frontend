import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../services/usuario-service.service';
import { UsuarioDetalle } from '../../../models/usuario.model';
import { NotificationService } from '../../../services/notification.service';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { fechaPrevia } from '../../../validators/fecha-previa.validator';
import { UtilsService } from '../../../services/utils.service';
import { ButtonComponent } from "../../../components/button/button.component";

@Component({
  selector: 'app-education',
  imports: [ReactiveFormsModule, ButtonComponent],
  templateUrl: './education.component.html',
  styleUrl: './education.component.css'
})
export class EducationPage {

  usuarioDetalles: UsuarioDetalle|undefined;
  form:FormGroup;

  constructor(
    private router:Router,
    private usuarioService: UsuarioService,
    private noti:NotificationService,
    private location:Location,
    private formBuilder:FormBuilder,
    protected utils:UtilsService
  ){
    this.form = formBuilder.group({
      'accion': ['AGREGAR'],
      'nombre': ['', [Validators.required, Validators.maxLength(100), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚÑñ\\s\\-0-9]+$')]],
      'institucion': ['', [Validators.required, Validators.maxLength(100), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚÑñ\\s\\-0-9]+$')]],
      'fechaInicio': ['', [Validators.required, fechaPrevia()]],
      'fechaFin': ['', ],
      'promedio': ['', [Validators.min(0), Validators.max(10)]],
      'tipo': ['', [Validators.required]],
      'descripcion':['', [Validators.minLength(50), Validators.maxLength(500)]]
    });
    let id:any = router.url.match(/\d+/g);
    id = id ? id[0] : null;
    console.log(id);
    if(id){
      this.usuarioService.getUsuarioDetalles(id).subscribe({
        next:res=>{
          this.usuarioDetalles = res;
        },
        error:err=>{
          noti.notificate('Ocurrio un error al obtener los datos de educación.', '', true, 5000);
          location.back();
        }
      })
    }
  }


  onSubmit(){
    this.form.markAllAsTouched();
    if(this.form.valid){
      let json = this.form.value;
      this.usuarioService.postEducacion(this.usuarioDetalles?.id, {titulos: [json]}).subscribe({
        next:res=>{
          this.noti.notificate('Titulo cargado con éxito.', '', false, 3000);
        },
        error:err=>{
          this.noti.notificateErrorsResponse(err.error)
        }
      })
    }
  }
}
