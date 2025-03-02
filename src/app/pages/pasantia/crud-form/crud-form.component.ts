import { Component, signal } from '@angular/core';
import { QueryInputDirective } from '../../../directives/query-input.directive';
import { UsuarioService } from '../../../services/usuario-service.service';
import { map } from 'rxjs';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UtilsService } from '../../../services/utils.service';
import { QueryInput } from '../../../models/query-input.models';
import { ButtonComponent } from '../../../components/button/button.component';
import { NotificationService } from '../../../services/notification.service';
import { EmpresaService } from '../../../services/empresa-service.service';
import { Location } from '@angular/common';
import { PasantiaService } from '../../../services/pasantia.service';
import { LoaderComponent } from '../../../components/loader/loader.component';
import { PasantiaDetalle } from '../../../models/pasantia.model';

@Component({
  selector: 'app-crud-form',
  imports: [QueryInputDirective, ReactiveFormsModule, ButtonComponent ,LoaderComponent],
  templateUrl: './crud-form.component.html',
  styleUrl: './crud-form.component.css'
})
export class CrudFormComponent {

  form:FormGroup
  usuariosSelected: {id:number, usuarioName:string, nota?:any}[] = [];
  usuarioSeleccionado = signal<{id:number, usuarioName:string, nota?:any}|null>(null);
  idPasantia: number|null = null;
  pasantia:PasantiaDetalle|null = null;
  loading = signal(false);


  constructor(
    private usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    protected utils:UtilsService,
    private noti:NotificationService,
    private empresaService:EmpresaService,
    private location:Location,
    private pasantiaService: PasantiaService
  ){

    this.form = formBuilder.group({
      titulo: ['Pasantía I', [Validators.required, Validators.minLength(5), Validators.maxLength(40)]],
      desc: ['', []],
      fechaInicio: ['', []],
      fechaFinal: ['', []],
      empresa: ['', [Validators.required]],
      idEmpresa: ['', [Validators.required]],
      usuario: '',
    })


    this.idPasantia = pasantiaService.getSelectedPasantia()?.id || null;

    if(this.idPasantia){
      this.loading.set(true);
      pasantiaService.getPasantia(this.idPasantia).subscribe({
        next: res=>{
          this.pasantia = res;
          this.form = formBuilder.group({
            titulo: [res.titulo, [Validators.required, Validators.minLength(5), Validators.maxLength(40)]],
            desc: [res.descripcion ||'', []],
            fechaInicio: [res.fechaInicio?.slice(0,10)||'', []],
            fechaFinal: [res.fechaFinal?.slice(0,10) ||'', []],
            empresa: [res.empresa?.nombre||'', [Validators.required]],
            idEmpresa: [res.empresa?.id||'', [Validators.required]],
            usuario: '',
          })
          res.usuarios.forEach(el=>{
            this.usuariosSelected.push({
              id: el.id,
              usuarioName: usuarioService.getFullName(el),
              nota: el.nota
            })
          })
          this.loading.set(false);   
        },
        error: err=>{
          this.loading.set(false);
          noti.notificateErrorsResponse(err.error);
          location.back();
        }
      })
    }
  }



  buscarEmpresas(){
    return this.empresaService.getEmpresas().pipe(
      map(res=> res.empresas.map(el=>({
        text: el.nombre,
        value: el.id
      })))
    );
  }


  buscarUsuarios(){
    let filtros:any = {};
    if(isNaN(this.form.value.usuario)){
      filtros['nombre'] = this.form.value.usuario;
    }else{
      filtros['dni'] = this.form.value.usuario;
    }
    return this.usuarioService.listarUsuarios(1, {...filtros, rol: 'ALUMNO,EGRESADO'}).pipe(
      map(res=> res.content.map(el=>({
        text: `${el.dni} - ${this.usuarioService.getFullName(el)}`,
        value: el.id
      })))
    );
  }


  selectUser(data:QueryInput){
    let find = this.usuariosSelected.find(el=>el.id == data.value);
    if(!find){
      this.usuariosSelected.push({id: data.value, usuarioName: data.text.split(' - ')[1]});
    }
  }


  deleteUser(id:number|undefined){
    this.usuariosSelected = this.usuariosSelected.filter(el=>el.id != id);
    this.closeModalUser();
  }

  openModalUser(id:number){
    this.usuarioSeleccionado.set(this.usuariosSelected.find(el=>el.id == id) ?? null);
  }
  closeModalUser(){
    this.usuarioSeleccionado.set(null);
  }

  updateUserSelected(e: KeyboardEvent) {
    let value = (e.target as HTMLInputElement).value;
    this.usuarioSeleccionado.update(prev => {
      if (prev) {
        // Buscar el usuario en la lista y actualizar la nota
        const index = this.usuariosSelected.findIndex(u => u.id === prev.id);
        if (index !== -1) {
          this.usuariosSelected[index].nota = value || null;
        }
        return { ...prev, nota: value || null };
      }
      return prev;
    });
  }
  


  onSubmit(){
    let json = this.form.value;
    json['usuarios'] = this.usuariosSelected.map(el=>({id: el.id, nota: el.nota}));
    if(this.pasantia){
      json.idPasantia = this.pasantia.id;
    }
    this.usuarioService.postPasantia(json).subscribe({
      next:res=>{
        this.noti.notificate('Pasantía creada correctamente', '', false, 5000);
        this.location.back();
      }, 
      error:err=>{
        this.noti.notificateErrorsResponse(err.error)
      }
    })
  }
}
