import { Component, inject, PLATFORM_ID } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { ButtonComponent } from '../../components/button/button.component';
import { LoaderComponent } from '../../components/loader/loader.component';
import { UtilsService } from '../../services/utils.service';
import Aos from 'aos';
import { isPlatformBrowser } from '@angular/common';
import { UsuarioService } from '../../services/usuario-service.service';
import { NotificationService } from '../../services/notification.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-register',
  imports: [ReactiveFormsModule, ButtonComponent, LoaderComponent, RouterModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {

  loading = false

  form:FormGroup
  estadosCiviles: string[]=[
    'SOLTERO(A)', 'CASADO(A)', 'VIUDO(A)', 'DIVORCIADO(A)'
  ];
  generos: string[]=['MASCULINO', 'FEMENINO'];

  constructor(
    private formBuilder:FormBuilder,
    protected utils:UtilsService,
    private usuarioService:UsuarioService,
    private noti:NotificationService
  ){
    this.form = formBuilder.group({
      'nombre': ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.pattern('[a-zA-Z\\sñÑáéíóúÁÉÍÓÚ]+')]],
      'apellido': ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.pattern('[a-zA-Z\\sñÑáéíóúÁÉÍÓÚ]+')]],
      'correo': ['', [Validators.required, Validators.email]],
      'fechaNacimiento': ['', [Validators.required]],
      'clave': ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20), Validators.pattern('[a-zA-ZñÑ\\-_0-9]+')]],
      'dni': ['', [Validators.required, Validators.pattern('[0-9]{8,12}')]],
      'rol': ['', [Validators.required, Validators.pattern('(ALUMNO|EGRESADO)')]],
      'estado_civil': ['', [Validators.required]],
      'genero': ['', [Validators.required]],
    })


    if(isPlatformBrowser(inject(PLATFORM_ID))){
      Aos.init();
      setTimeout(() => {
        Aos.refresh();
      }, 100);
      setTimeout(() => {
        Aos.refresh();
      }, 1000);
      
    }
  }




  onSubmit(){
    this.form.markAllAsTouched()
    if(this.form.valid){
      this.loading = true;
      this.usuarioService.register(this.form.value).subscribe({
        next: res=>{
          this.loading = false;
        },
        error:err=>{
          this.noti.notificateErrorsResponse(err.error);
          this.loading = false;
        }
      })
    }
  }
}
