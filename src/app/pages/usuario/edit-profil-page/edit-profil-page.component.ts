import { Component, OnInit, signal } from '@angular/core';
import { LoaderComponent } from '../../../components/loader/loader.component';
import { UsuarioService } from '../../../services/usuario-service.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UtilsService } from '../../../services/utils.service';
import { Habilidad, UsuarioDetalle } from '../../../models/usuario.model';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { ButtonComponent } from '../../../components/button/button.component';
import { NotificationService } from '../../../services/notification.service';
import { requiredAge } from '../../../validators/required-age.validator';
import { isInteger } from '../../../validators/is-numeric.validator';
import { EducationComponent } from '../../../components/usuario/educacion/educacion.component';

@Component({
    selector: 'app-edit-profil-page',
    imports: [EducationComponent,LoaderComponent, ButtonComponent, ReactiveFormsModule, RouterModule],
    templateUrl: './edit-profil-page.component.html',
    styleUrl: './edit-profil-page.component.css'
})
export class EditProfilPage implements OnInit {
  loaders = signal({
    global:true,
    perfilProfesional:false,
    contacto:false,
    personalInfo: false,
    ubicacion:false,
  })
  initData = signal({
    perfilProfesional : '',
    contacto: '',
    personalInfo: '',
    ubicacion: '',
  })
  userDetails: UsuarioDetalle|undefined;

  personalInfoForm:FormGroup;
  perfilProfesionalForm:FormGroup
  contactoForm:FormGroup;
  ubicacionForm:FormGroup;

  provincias: string[]=[];
  linkEditSkills = '';

  constructor(
    protected usuarioService: UsuarioService,
    private formBuilder:FormBuilder,
    protected utils:UtilsService,
    private activatedRoute:ActivatedRoute,
    private noti:NotificationService,
    private router:Router
  ){
    this.personalInfoForm = this.formBuilder.group({
      'nombre': '',
      'apellido': '',
      'correo': '',
      'fechaNacimiento': '',
      'dni': '',
    });
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
    this.ubicacionForm = formBuilder.group({
      'pais': [''],
      'provincia': [''],
      'localidad': [''],
      'barrio': [''],
      'direccion': [''],
      'piso': [0],
      'numero': [0],
    });


    utils.getProvincias().subscribe({
      next: res=>{
        res.provincias.forEach(el=>{
          this.provincias.push(el.nombre);
        })
      }
    })


    let idUsuario = this.activatedRoute.snapshot.paramMap.get('id');
    if(!idUsuario){
      idUsuario = this.usuarioService.getUsuario()?.id as unknown as string;
    }
    this.usuarioService.getUsuarioDetalles(idUsuario as unknown as number).subscribe({
      next: res=>{
        this.userDetails = res;
        this.loaders.update(prev=> ({...prev, global:false}));

        this.personalInfoForm = this.formBuilder.group({
          'nombre': [
            this.userDetails.nombre ||'',
            [Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.pattern('^[a-zA-Z\\sñÑáéíóúÁÉÍÓÚ]+$')]
          ],
          'apellido': [
            this.userDetails.apellido || '',
            [Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.pattern('^[a-zA-Z\\sñÑáéíóúÁÉÍÓÚ]+$')]
          ],
          'correo': [
            this.userDetails.correo || '',
            [Validators.required, Validators.email]
          ],
          'fechaNacimiento': [
            this.userDetails.fechaNacimiento || '',
            [Validators.required, requiredAge(18)]
          ],
          'dni': [
            this.userDetails.dni,
            [Validators.required, Validators.pattern('^[0-9]{7,12}$')]
          ],
        });
        this.initData.update(prev=> ({...prev, personalInfo: JSON.stringify(this.personalInfoForm.value)}));

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

        this.ubicacionForm = formBuilder.group({
          'pais': [
            this.userDetails.ubicacion?.pais || 'Argentina',
            [Validators.required, Validators.maxLength(100)]
          ],
          'provincia': [
            this.userDetails.ubicacion?.provincia || '', 
            [Validators.required, Validators.maxLength(100)]
          ],
          'localidad': [
            this.userDetails.ubicacion?.localidad || '', 
            [Validators.required, Validators.maxLength(100)]
          ],
          'barrio': [
            this.userDetails.ubicacion?.barrio || '',
            [Validators.required, Validators.maxLength(255)]
          ],
          'direccion': [
            this.userDetails.ubicacion?.calle || '',
            [Validators.required, Validators.maxLength(255)]
          ],
          'piso': [
            this.userDetails.ubicacion?.piso || '',
            [isInteger()]
          ],
          'numero': [
            this.userDetails.ubicacion?.numero || '',
            [isInteger()]
          ],
        });
        this.initData.update(prev=> ({...prev, ubicacion: JSON.stringify(this.ubicacionForm.value)}))
      }
    });

    
  }

  ngOnInit(): void {
    if(this.router.url.includes('dashboard/profile')){
      this.linkEditSkills = 'skills'
    }else{
      this.linkEditSkills = '/dashboard/users/' + this.userDetails?.id +  '/edit/skills'
    }
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

  onPersonalInfo(){
    this.personalInfoForm.markAllAsTouched();
    if(this.personalInfoForm.valid){
      let json = this.utils.getChangedFields(this.personalInfoForm, this.initData().personalInfo);
      this.loaders.update(prev=> ({...prev, personalInfo:true}))
      this.usuarioService.putUsuario(this.userDetails?.id as unknown as number, json).subscribe({
        next:res=>{
          this.loaders.update(prev=> ({...prev, personalInfo:false}))
          this.initData.update(prev=>({...prev, personalInfo: JSON.stringify(this.personalInfoForm.value)}))
        },
        error:err=>{
          this.loaders.update(prev=> ({...prev, personalInfo:false}))
          this.noti.notificateErrorsResponse(err.error);
        }
      });
    }
  }

  onUbicacion(){
    this.ubicacionForm.markAllAsTouched();
    if(this.ubicacionForm.valid){
      this.loaders.update(prev=> ({...prev, ubicacion: true}));
      let json = {ubicacion: this.ubicacionForm.value}
      this.usuarioService.postUbicacion(this.userDetails?.id as unknown as number, json).subscribe({
        next: res=>{
          this.loaders.update(prev=> ({...prev, ubicacion: false}));
          this.initData.update(prev=> ({...prev, ubicacion: JSON.stringify(this.ubicacionForm.value)}))
        },
        error: err=>{
          this.loaders.update(prev=> ({...prev, ubicacion: false}));
          this.noti.notificateErrorsResponse(err.error);
        }
      });
    }
  }


  onSkills(){
    this.usuarioService.storageSkills(this.userDetails?.habilidades as Habilidad[]);
  }
}
