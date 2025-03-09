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
import { MatDialog } from '@angular/material/dialog';
import { GenericModal } from '../../../modals/generic-modal.component';

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
    protected usuarioService: UsuarioService,
    private formBuilder: FormBuilder,
    protected utils:UtilsService,
    private noti:NotificationService,
    private empresaService:EmpresaService,
    private location:Location,
    private pasantiaService: PasantiaService,
    private dialog: MatDialog
  ){
    this.form = formBuilder.group({
      titulo: ['Pasantía I', [Validators.required, Validators.minLength(5), Validators.maxLength(40)]],
      desc: ['', []],
      fechaInicio: ['', 
        usuarioService.isAlumn()
          ? [Validators.required]
          : []
      ],
      fechaFinal: ['', []],
      empresa: ['', [Validators.required]],
      idEmpresa: ['', [Validators.required]],
      usuario: '',
      nota: ['',
        usuarioService.isAlumn()
          ? [Validators.required, Validators.min(0), Validators.max(10)]
          : []
      ]
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
            fechaInicio: [res.fechaInicio?.slice(0,10)||'', 
              usuarioService.isAlumn()
                ? [Validators.required]
                : []
            ],
            fechaFinal: [res.fechaFinal?.slice(0,10) ||'', []],
            empresa: [res.empresa?.nombre||'', [Validators.required]],
            idEmpresa: [res.empresa?.id||'', [Validators.required]],
            usuario: '',
            nota: [res.usuarios[0]?.nota ?? '',
              usuarioService.isAlumn()
                ? [Validators.required, Validators.min(0), Validators.max(10)]
                : []
            ]
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
    let filtros = {
      nombre: this.form.get('empresa')?.value
    }
    return this.empresaService.getEmpresas(filtros).pipe(
      map(res=> res.content.map(el=>({
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


  onAprobar(){
    const dialogRef = this.dialog.open(GenericModal,{
      data: {
        text: '¿Seguro de que deseas aprobar la pasantía?',
        textTitle: 'Aprobar Pasantía',
        textCancelar: 'Cancelar',
        textConfirmar: 'Aprobar'
      }
    })


    dialogRef.afterClosed().subscribe(res=>{
      if(res){
        this.loading.set(true)
        this.pasantiaService.responderPasantia(this.pasantia?.id as number, {accion:'APROBAR'}).subscribe({
          next:res=>{
            this.location.back();
            this.loading.set(false)
          },
          error:err=>{
            this.noti.notificateErrorsResponse(err.error);
            this.loading.set(false)
          }
        })
      }
    })
  }
  onRechazar(){
    const dialogRef = this.dialog.open(GenericModal,{
      data: {
        text: '¿Seguro de que deseas rezhazar la pasantía?',
        textTitle: 'Rechazar Pasantía',
        textCancelar: 'Cancelar',
        textConfirmar: 'Rechazar'
      }
    })


    dialogRef.afterClosed().subscribe(res=>{
      if(res){
        this.loading.set(true)
        this.pasantiaService.responderPasantia(this.pasantia?.id as number, {accion:'RECHAZAR'}).subscribe({
          next:res=>{
            this.location.back();
            this.loading.set(false)
          },
          error:err=>{
            this.noti.notificateErrorsResponse(err.error);
            this.loading.set(false)
          }
        })
      }
    })
  }


  onSubmit(){
    let json = this.form.value;
    json['usuarios'] = this.usuarioService.isAlumn()
      ? [{id: this.usuarioService.getUsuario()?.id, nota: this.form.get('nota')?.value }]
      : this.usuariosSelected.map(el=>({id: el.id, nota: el.nota}));
    if(this.pasantia){
      json.idPasantia = this.pasantia.id;
    }
    this.form.markAllAsTouched()
    if(this.form.valid){
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
}
