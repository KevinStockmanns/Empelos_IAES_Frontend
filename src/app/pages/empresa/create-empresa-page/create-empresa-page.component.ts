import { Component, OnDestroy, signal } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UtilsService } from '../../../services/utils.service';
import { ButtonComponent } from "../../../components/button/button.component";
import { QueryInputDirective } from '../../../directives/query-input.directive';
import { UsuarioService } from '../../../services/usuario-service.service';
import { QueryInput } from '../../../models/query-input.models';
import { map, noop, Observable } from 'rxjs';
import { EmpresaService } from '../../../services/empresa-service.service';
import { NotificationService } from '../../../services/notification.service';
import { LoaderComponent } from '../../../components/loader/loader.component';
import { Location } from '@angular/common';
import { oneCheckboxRequired } from '../../../validators/checkbox.validator';
import { Router } from '@angular/router';
import { EmpresaDetalle } from '../../../models/empresa.model';

@Component({
  selector: 'app-create-empresa-page',
  imports: [ReactiveFormsModule, ButtonComponent, QueryInputDirective, LoaderComponent, LoaderComponent],
  templateUrl: './create-empresa-page.component.html',
  styleUrl: './create-empresa-page.component.css'
})
export class CreateEmpresaPage implements OnDestroy{

  horariosInitValue:string;
  ubicacionInitValue:string;
  formEmpresa:FormGroup
  formUbicacion: FormGroup;
  formHorarios: FormGroup;
  private usuarios = signal<QueryInput[]>([]);
  loading = signal(false);
  loadingGlobal = signal(false);
  private horarioCounter:number = 0;
  idEmpresa: any|null = null;
  empresa: EmpresaDetalle|undefined;

  diasOptions = ['Domingo','Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];


  constructor(
    private formbuilder:FormBuilder,
    protected utils:UtilsService,
    private usuarioService:UsuarioService,
    private empresaService:EmpresaService,
    private noti:NotificationService,
    private location:Location,
    private router:Router,
  ){
    
    
    this.formEmpresa = formbuilder.group({
      'nombre': ['', [Validators.required, Validators.maxLength(100), Validators.minLength(3), Validators.pattern('^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ\\s]+$')]],
      'referente': ['',[Validators.minLength(3), Validators.maxLength(50), Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ\\s]+$')]],
      'cuil_cuit': ['', [Validators.required, Validators.pattern('^\\d{2}\\-\\d{7,10}\\-\\d$')]],
      'idUsuario': [''],
      'usuario': [''],
    });

    this.formUbicacion = formbuilder.group({
      'pais': ['Argentina', [Validators.required, Validators.maxLength(100)]],
      'provincia': ['', [Validators.required, Validators.maxLength(100)]],
      'localidad': ['', [Validators.required, Validators.maxLength(100)]],
      'barrio': ['', [Validators.required, Validators.maxLength(255)]],
      'direccion': ['', [Validators.required, Validators.maxLength(255)]],
      'numero': [''],
      'piso': [''],
    });

    this.formHorarios = formbuilder.group({
      horarios: formbuilder.array([])
    });
    // this.addHorario();

    this.horariosInitValue = JSON.stringify(this.formHorarios.value)
    this.ubicacionInitValue = JSON.stringify(this.formUbicacion.value)





    let selectedEmpresa = empresaService.getSelectedEmpresa();
    console.log(selectedEmpresa);
    
    if(selectedEmpresa){
      this.loadingGlobal.set(true)
      this.idEmpresa = selectedEmpresa;
      this.empresaService.getEmpresa(this.idEmpresa).subscribe({
        next: res=>{
          this.empresa = res;
          this.loadingGlobal.set(false)
          console.log(this.empresa);
          

          this.formEmpresa.get('nombre')?.setValue(this.empresa.nombre);
          this.formEmpresa.get('referente')?.setValue(this.empresa.referente);
          this.formEmpresa.get('cuil_cuit')?.setValue(this.empresa.cuil);
          this.formEmpresa.get('idUsuario')?.setValue(this.empresa.usuario?.id ?? '');
          this.formEmpresa.get('usuario')?.setValue(this.empresa.usuario ? (this.empresa.usuario.id + ' - ' + usuarioService.getFullName(this.empresa.usuario)) : '');

          if(this.empresa.ubicacion){
            this.formUbicacion.setValue({
              'pais': this.empresa.ubicacion.pais,
              'provincia': this.empresa.ubicacion.provincia,
              'localidad': this.empresa.ubicacion.localidad,
              'barrio': this.empresa.ubicacion.barrio,
              'direccion': this.empresa.ubicacion.calle,
              'numero': this.empresa.ubicacion.numero,
              'piso': this.empresa.ubicacion.piso,
            })
          }

          if(this.empresa.horarios.length>0){
            let horarios = this.empresa.horarios;
            horarios.forEach((el,i)=>{
              this.addHorario();
              
              let dias = this.diasOptions.map(dia=>{
                return el.dias.includes(dia);
              });

              
              console.log(dias);
              

              (this.formHorarios.get('horarios') as FormArray).at(i).patchValue({
                'desde': el.desde,
                'hasta': el.hasta,
                'dias': dias,
              })
            })
            console.log(this.formHorarios);
          }


          this.horariosInitValue = JSON.stringify(this.formHorarios.value)
          this.ubicacionInitValue = JSON.stringify(this.formUbicacion.value)
        },
        error: err=>{
          noti.notificateErrorsResponse(err.error, 'Ocurrio un error al obtener la información de la empresa.')
          this.loadingGlobal.set(false)
          location.back();
        }
      })
    }
  }

  private createFormHorario():FormGroup{
    return this.formbuilder.group({
      id: [this.horarioCounter++],
      'desde': ['', [Validators.required]],
      'hasta': ['', [Validators.required]],
      dias: this.formbuilder.array(
        this.diasOptions.map(() => this.formbuilder.control(false)),
        [oneCheckboxRequired()]
      )
    });
  }

  get horarios(){
    return this.formHorarios.get('horarios') as FormArray;
  }
  addHorario(){
    this.horarios.push(this.createFormHorario());
  }
  removeHorario(index:number){
    this.horarios.removeAt(index);
  }


  buscarUsuarios(): Observable<QueryInput[]> {
    return this.usuarioService.listarUsuarios(1, {
      rol: 'EMPRESA', 
      nombre: this.formEmpresa.get('usuario')?.value
    }).pipe(
      map(res => res.content.map(el => ({
        text: el.id + ' - ' + this.usuarioService.getFullName(el),
        value: el.id
      })))
    );
  }

  private formWasChanged(form:FormGroup, initValue:string){
    return JSON.stringify(form.value) != initValue;
  }

  onSubmit(){
    this.formEmpresa.markAllAsTouched()
    let valids = [this.formEmpresa.valid];

    let values = this.formEmpresa.value;
    
    if(this.formWasChanged(this.formHorarios, this.horariosInitValue) || this.empresa){
      this.formHorarios.markAllAsTouched()
      valids.push(this.formHorarios.valid)
      values.horarios = this.horarios.controls.map(control => {
        const horario = control.value;
        let dias: number[] = [];
        horario.dias.forEach((el: boolean, i: number) => {
          if (el) {
            dias.push(i);
          }
        });
        // Excluimos el id del objeto final
        const { id, ...horarioWithoutId } = horario;
        
        return {
          ...horarioWithoutId,
          dias: dias.join(',')
        };
      });
    }
    if(this.formWasChanged(this.formUbicacion, this.ubicacionInitValue) || this.empresa){
      this.formUbicacion.markAllAsTouched()
      valids.push(this.formUbicacion.valid)
      values.ubicacion = this.formUbicacion.value;

      ["piso", "numero"].forEach((key) => {
        if (!values.ubicacion[key]) {
          delete values.ubicacion[key];
        }
      });

    }

    
    
    if(valids.every(e=>e)){
      this.loading.set(true);
      let json = this.formEmpresa.value;
      if(this.empresa){
        json.id = this.empresa.id;
      }
      
      this.empresaService.postEmpresa(json).subscribe({
        next: res=>{
          let message = this.empresa ? 'Empresa actualizada con éxito.' : 'Empresa creada con éxito.';
          this.loading.set(false);
          this.noti.notificate(message, '', false,3000);
          this.location.back();
        },
        error:err=>{
          console.log(err);
          
          this.loading.set(false);
          this.noti.notificateErrorsResponse(err.error);
        }
      });
    }
  }



  ngOnDestroy(): void {
    this.empresaService.selectEmpresa(null);
  }
}
