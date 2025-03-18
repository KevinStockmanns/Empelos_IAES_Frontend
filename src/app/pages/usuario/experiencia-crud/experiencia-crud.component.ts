import { Component, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UtilsService } from '../../../services/utils.service';
import { ButtonComponent } from '../../../components/button/button.component';
import { UsuarioService } from '../../../services/usuario-service.service';
import { NotificationService } from '../../../services/notification.service';
import { Location } from '@angular/common';
import { ExperienciaLaboral, UsuarioDetalle } from '../../../models/usuario.model';
import { QueryInputDirective } from '../../../directives/query-input.directive';
import { EmpresaService } from '../../../services/empresa-service.service';
import { map } from 'rxjs';

@Component({
  selector: 'app-experiencia-crud',
  imports: [ReactiveFormsModule, ButtonComponent, QueryInputDirective],
  templateUrl: './experiencia-crud.component.html',
  styleUrl: './experiencia-crud.component.css'
})
export class ExperienciaCrudPage implements OnDestroy {
  form:FormGroup
  expLaboral:ExperienciaLaboral|null = null;

  constructor(
    private formBuilder:FormBuilder,
    protected utils: UtilsService,
    private usuarioService: UsuarioService,
    private noti:NotificationService,
    private location:Location,
    private empresaService:EmpresaService
  ){
    this.expLaboral = usuarioService.getSelectedExp();

    let fechaInicio:any = this.expLaboral?.fechaInicio ? new Date(this.expLaboral.fechaInicio) : null
    let fechaTerminacion:any = this.expLaboral?.fechaTerminacion ? new Date(this.expLaboral.fechaTerminacion) : null

    if(fechaInicio){
      fechaInicio = fechaInicio.toISOString().slice(0,10)
    }
    if(fechaTerminacion){
      fechaTerminacion = fechaTerminacion.toISOString().slice(0,10)
    }


    this.form = formBuilder.group({
      puesto: [this.expLaboral?.puesto || '', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern('^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ\\s]+$')]],
      empresa: [this.expLaboral?.empresa || '', [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern('^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ\\s]+$')]],
      idEmpresa: '',
      asociarEmpresa: '',
      descripcion: [this.expLaboral?.descripcion || '', [Validators.minLength(15), Validators.maxLength(500)]],
      fechaInicio : [fechaInicio || '', [Validators.required]],
      fechaTerminacion : [fechaTerminacion|| '', []],
    })

  }


  ngOnDestroy(): void {
      this.usuarioService.selectExperiencia(null);
  }



  buscarEmpresa(){
    let filtros = {
      nombre: this.form.get('asociarEmpresa')?.value
    }
    return this.empresaService.getEmpresas(filtros).pipe(
      map(res=> res.content.map(el=>({
        text: `${el.id} - ${el.nombre}`,
        value: el.id
      })))
    )
  }

  // arUsuarios(): Observable<QueryInput[]> {
  //     return this.usuarioService.listarUsuarios(1, {
  //       rol: 'EMPRESA', 
  //       nombre: this.formEmpresa.get('usuario')?.value
  //     }).pipe(
  //       map(res => res.content.map(el => ({
  //         text: el.id + ' - ' + this.usuarioService.getFullName(el),
  //         value: el.id
  //       })))
  //     );
  //   }



  onSubmit(){
    this.form.markAllAsTouched();

    if(this.form.valid){
      let json = {
        experienciaLaboral : [{
          ...this.form.value,
          accion: this.expLaboral ? 'ACTUALIZAR' : 'AGREGAR',
          id: this.expLaboral?.id || null,
        }],
      };
      if(!json.experienciaLaboral[0].id){
        delete json.experienciaLaboral[0].id;
      }
      

      this.usuarioService.postExperiencia(this.usuarioService.getSelectedUsuario()?.id, json).subscribe({
        next: res=>{
          console.log(res);
          let actualUser = this.usuarioService.getSelectedUsuario() as UsuarioDetalle;
          actualUser.experienciaLaboral = res.experienciasLaborales;
          this.usuarioService.selectUser(actualUser);
          

          this.noti.notificate(`Experiencia ${this.expLaboral ? 'actualizada' : 'cargada'} con éxito`, '', false, 5000);
          this.location.back();
        },
        error: err=>{
          this.noti.notificateErrorsResponse(err.error);
        }
      });
    }
  }
}
