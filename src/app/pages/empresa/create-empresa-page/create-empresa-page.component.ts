import { Component, signal } from '@angular/core';
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

@Component({
  selector: 'app-create-empresa-page',
  imports: [ReactiveFormsModule, ButtonComponent, QueryInputDirective, LoaderComponent],
  templateUrl: './create-empresa-page.component.html',
  styleUrl: './create-empresa-page.component.css'
})
export class CreateEmpresaPage {

  horariosInitValue:string;
  ubicacionInitValue:string;
  formEmpresa:FormGroup
  formUbicacion: FormGroup;
  formHorarios: FormGroup;
  private usuarios = signal<QueryInput[]>([]);
  loading = signal(false);
  private horarioCounter:number = 0;

  diasOptions = ['Domingo','Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];


  constructor(
    private formbuilder:FormBuilder,
    protected utils:UtilsService,
    private usuarioService:UsuarioService,
    private empresaService:EmpresaService,
    private noti:NotificationService,
    private location:Location
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
    
    if(this.formWasChanged(this.formHorarios, this.horariosInitValue)){
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
    if(this.formWasChanged(this.formUbicacion, this.ubicacionInitValue)){
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
      
      this.empresaService.postEmpresa(json).subscribe({
        next: res=>{
          this.loading.set(false);
          this.noti.notificate('Empresa creada con éxito', '', false,3000);
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
}
