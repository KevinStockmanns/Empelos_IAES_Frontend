import { Component, inject, PLATFORM_ID } from '@angular/core';
import { UsuarioService } from '../../services/usuario-service.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ButtonComponent } from '../../components/button/button.component';
import { NotificationService } from '../../services/notification.service';
import Aos from 'aos';
import { RouterModule } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';


@Component({
    selector: 'app-login',
    imports: [LoaderComponent, ReactiveFormsModule, ButtonComponent, RouterModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent {

  form:FormGroup;
  loading = false;
  error: string = "";

  constructor(private usuarioService:UsuarioService,
    private formBuilder:FormBuilder,
    private noti: NotificationService
  ){
    this.form = this.formBuilder.group({
      'correo': ['', [Validators.required, Validators.email]],
      'clave': ['', [
        Validators.required,
        Validators.pattern('[a-zA-ZñÑ\\-_0-9]+$'), 
        Validators.minLength(8), 
        Validators.maxLength(20)
      ]]
    });

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

  onLogin(){
    this.form.markAllAsTouched();
    this.error = '';
    if(this.form.valid){
      this.loading = true;
      let value = this.form.value;
      this.usuarioService.login(value.correo, value.clave).subscribe({
        next:res=>{
          this.loading = false;
        },
        error: err=>{
          
          this.loading = false;
          if (err.error.errors) {
            Object.entries(err.error.errors).forEach(([key, value]) => {
                if (typeof value === 'string' && value.startsWith('Credenciales')) {
                    this.error = value;
                }
            });
        }
        
          this.noti.notificateErrorsResponse(err.error);
        }
      });
    }
  }

  hasErrors(controlName:string){
    return this.form.get(controlName)?.invalid && this.form.get(controlName)?.touched;
  }
  hasError(controlName:string, error:string){
    return this.form.get(controlName)?.hasError(error) && this.form.get(controlName)?.touched;
  }
  getError(controlName:string,error:string){
    return (this.form.get(controlName)?.errors as ValidationErrors)[error];
  }
  hasValue(controlName:string){
    return this.form.get(controlName)?.value;
  }
}
