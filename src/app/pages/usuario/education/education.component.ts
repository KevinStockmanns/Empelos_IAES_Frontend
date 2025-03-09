import { Component, signal } from '@angular/core';
import { Router } from '@angular/router';
import { UsuarioService } from '../../../services/usuario-service.service';
import { UsuarioDetalle } from '../../../models/usuario.model';
import { NotificationService } from '../../../services/notification.service';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { fechaPrevia } from '../../../validators/fecha-previa.validator';
import { UtilsService } from '../../../services/utils.service';
import { ButtonComponent } from "../../../components/button/button.component";
import { LoaderComponent } from '../../../components/loader/loader.component';
import { CanExit } from '../../../interfaces/CanExit.interface';
import { Educacion } from '../../../models/educacion.model';
import { TituloListado } from '../../../models/titulo.model';

@Component({
  selector: 'app-education',
  imports: [ReactiveFormsModule, ButtonComponent, LoaderComponent],
  templateUrl: './education.component.html',
  styleUrl: './education.component.css'
})
export class EducationPage implements CanExit {

  idUser:any;
  form:FormGroup;
  edit = false;
  loading = signal(false);
  titulosIAES: TituloListado[]= [];
  selectIAES = signal(false);

  constructor(
    private router:Router,
    private usuarioService: UsuarioService,
    private noti:NotificationService,
    private location:Location,
    private formBuilder:FormBuilder,
    protected utils:UtilsService
  ){
    let storagedEducation: Educacion | null = null;

    const storedEducationData = usuarioService.getStoragedEduacion();
    utils.getTitulos().subscribe({
      next:res=>{
        this.titulosIAES = res.content

        if(!storagedEducation){
          this.selectIAES.set(true);
          this.form.patchValue({
            institucion: this.selectIAES() ? this.titulosIAES[0].institucion : '',
            tipo: this.selectIAES() ? 'TERCIARIO' : '',
          })
        }
      }
    })
    if (storedEducationData) {
      storagedEducation = JSON.parse(storedEducationData ?? '');
      if (storagedEducation) {
        this.edit = true;
      }
    }

    this.form = formBuilder.group({
      'accion': [this.edit ? 'ACTUALIZAR' : 'AGREGAR'],
      'nombre': [storagedEducation?.nombre ?? '', [Validators.required, Validators.maxLength(100), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚÑñ\\s\\-0-9]+$')]],
      'institucion': [storagedEducation?.institucion ?? '', [Validators.required, Validators.maxLength(100), Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚÑñ\\s\\-0-9]+$')]],
      'fechaInicio': [storagedEducation?.fechaInicio ? new Date(storagedEducation?.fechaInicio).toISOString().split('T')[0] : '', [Validators.required, fechaPrevia()]],
      'fechaFin': [storagedEducation?.fechaFin ? new Date(storagedEducation?.fechaFin).toISOString().split('T')[0] : '', ],
      'promedio': [storagedEducation?.promedio ?? '', [Validators.min(0), Validators.max(10)]],
      'tipo': [storagedEducation?.tipo ?? '', [Validators.required]],
      'descripcion': [storagedEducation?.descripcion ?? '', [Validators.minLength(50), Validators.maxLength(500)]],
      'id': [storagedEducation?.idTituloDetalle ?? 0]
    });
    
    let id = usuarioService.getSelectedUsuario()?.id;
    if(id){
      this.idUser = id;
    }else{
      this.idUser = usuarioService.getUsuario()?.id;
    }
  }


  onSubmit(){
    this.form.markAllAsTouched();
    if(this.form.valid){
      this.loading.set(true);
      let json = this.form.value;
      if(this.selectIAES()){
        json.institucion = this.titulosIAES[0].institucion
        json.tipo = 'TERCIARIO'
      }

      console.log(json);
      // return
      this.usuarioService.postEducacion(this.idUser, {titulos: [json]}).subscribe({
        next:res=>{
          this.loading.set(false);
          this.noti.notificate(`Titulo ${this.edit ? 'editado' : 'cargado'} con éxito.`, '', false, 3000);
          this.location.back();
        },
        error:err=>{
          console.log(err);
          
          this.loading.set(false);
          this.noti.notificateErrorsResponse(err.error)
        }
      })
    }
  }


  onExit(){
    this.usuarioService.removeStoragedEducacion();
    return true;
  }


  onToggleTitulosIAES(event: Event){
    this.selectIAES.update(prev=>!prev);

    this.form.patchValue({
      institucion: this.selectIAES() ? this.titulosIAES[0].institucion : '',
      tipo: this.selectIAES() ? 'TERCIARIO' : '',
    })
  }
}
