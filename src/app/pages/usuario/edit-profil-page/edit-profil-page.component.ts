import { Component, signal } from '@angular/core';
import { LoaderComponent } from '../../../components/loader/loader.component';
import { HeaderComponent } from '../../../components/header/header.component';
import { UsuarioService } from '../../../services/usuario-service.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UtilsService } from '../../../services/utils.service';
import { UsuarioDetalle } from '../../../models/usuario.model';
import { ActivatedRoute } from '@angular/router';
import { ButtonComponent } from '../../../components/button/button.component';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-edit-profil-page',
  standalone: true,
  imports: [LoaderComponent, HeaderComponent, ButtonComponent, ReactiveFormsModule],
  templateUrl: './edit-profil-page.component.html',
  styleUrl: './edit-profil-page.component.css'
})
export class EditProfilPage {
  loaders = signal({
    global:true,
    perfilProfesional:false,
    contacto:false,
  })
  initData = signal({
    perfilProfesional : '',
    contacto: ''
  })
  userDetails: UsuarioDetalle|undefined;

  perfilProfesionalForm:FormGroup
  contactoForm:FormGroup;

  constructor(
    protected usuarioService: UsuarioService,
    private formBuilder:FormBuilder,
    protected utils:UtilsService,
    private activatedRoute:ActivatedRoute,
    private noti:NotificationService
  ){
    this.perfilProfesionalForm = this.formBuilder.group({
      'cargo': [''],
      'cartaPresentacion': [''],
      'disponibilidadMudanza': [false],
      'disponibilidad': [''],
    });
    this.contactoForm = formBuilder.group({
      'telefono': [''],
      'telefonoFijo': [''],
      'linkedin': [''],
      'paginaWeb': [''],
    });


    let idUsuario = this.activatedRoute.snapshot.paramMap.get('id');
    this.usuarioService.getUsuarioDetalles(idUsuario as unknown as number).subscribe({
      next: res=>{
        this.userDetails = res;
        this.loaders.update(prev=> ({...prev, global:false}));

        this.perfilProfesionalForm = this.formBuilder.group({
          'cargo': [
            this.userDetails?.perfilProfesional?.cargo || '', 
            [Validators.required, Validators.minLength(3), Validators.maxLength(50), Validators.pattern('^[a-zA-ZñÑáéíóúÁÉÍÓÚ\\s\\.]+$')]
          ],
          'cartaPresentacion':[
            this.userDetails.perfilProfesional?.cartaPresentacion || '',
            [Validators.minLength(100), Validators.maxLength(3000), Validators.pattern('^[a-zA-Z0-9ñÑáéíóúÁÉÍÓÚ.,;:\'"\\s\\-()!?\\n]+$')]
          ],
          'disponibilidadMudanza':[this.userDetails.perfilProfesional?.disponibilidadMudanza || false],
          'disponibilidad': [
            this.userDetails.perfilProfesional?.disponibilidad || '',
            [Validators.required]
          ]
        });
        this.initData.update(prev=> ({...prev, perfilProfesional: JSON.stringify(this.perfilProfesionalForm.value)}));


        this.contactoForm = this.formBuilder.group({
          'telefono': [
            this.userDetails.contacto?.telefono ?? '',
            [Validators.required, Validators.pattern('^\\+?(\\d{1,3})?[-\\s]?(\\d{2,4}[-\\s]?){1,3}\\d{4,}$')]
          ],
          'telefonoFijo': [
            this.userDetails.contacto?.telefonoFijo || '',
            [Validators.pattern('^(0\\d{1,2})?[-\\s]?\\d{4}[-\\s]?\\d{4}$')]
          ],
          'linkedin': [
            this.userDetails.contacto?.linkedin ||'',
            // [Validators.pattern('^https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)$')]
          ],
          'paginaWeb': [
            this.userDetails.contacto?.paginaWeb || '',
            // [Validators.pattern('^https?:\/\/(www\.)?[-a-zA-Z0-9@:%._\+~#=]{1,256}\.[a-zA-Z0-9()]{1,6}\b([-a-zA-Z0-9()@:%_\+.~#?&//=]*)$')]
          ],
        });
        this.initData.update(prev=> ({...prev, contacto: JSON.stringify(this.contactoForm.value)}));
      }
    });

    
  }

  onPerfilProfesional(){
    this.perfilProfesionalForm.markAllAsTouched();
    if(this.perfilProfesionalForm.valid){
      let json = {perfilProfesional: this.utils.limpiarObjeto(this.perfilProfesionalForm.value)};
      console.log(json);
      
      this.loaders.update(prev=> ({...prev, perfilProfesional:true}));
      this.usuarioService.postPerfilProfesional(this.userDetails?.id as number, json).subscribe({
        next: res=>{
          this.loaders.update(prev=> ({...prev, perfilProfesional:false}));
          this.initData.update(prev=> ({...prev, perfilProfesional: JSON.stringify(this.perfilProfesionalForm.value)}))
        },
        error: err=>{
          this.loaders.update(prev=> ({...prev, perfilProfesional:false}));
          this.noti.notificateErrorsResponse(err.error);
        }
      });
    }
  }

  onContacto(){
    this.contactoForm.markAllAsTouched();
    if(this.contactoForm.valid){
      this.loaders.update(prev=> ({...prev, contacto: true}))
      let json= {contacto: this.utils.limpiarObjeto(this.contactoForm.value)};
      this.usuarioService.postContacto(this.userDetails?.id as unknown as number, json).subscribe({
        next: res=>{
          this.loaders.update(prev=> ({...prev, contacto: false}));
          this.initData.update(prev=> ({...prev, contacto: JSON.stringify(this.contactoForm.value)}));
        },
        error:err=>{
          this.noti.notificateErrorsResponse(err.error);
          this.loaders.update(prev=> ({...prev, contacto: false}))
        }
      });
    }
  }
}
