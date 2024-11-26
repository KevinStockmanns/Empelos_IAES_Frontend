import { Component } from '@angular/core';
import { UsuarioService } from '../../services/usuario-service.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { LoaderComponent } from '../../components/loader/loader.component';
import { ButtonComponent } from '../../components/button/button.component';
import { NotificationService } from '../../services/notification.service';

@Component({
    selector: 'app-login',
    imports: [LoaderComponent, ReactiveFormsModule, ButtonComponent],
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
  }

  onLogin(){
    this.form.markAllAsTouched();
    if(this.form.valid){
      this.loading = true;
      let value = this.form.value;
      this.usuarioService.login(value.correo, value.clave).subscribe({
        next:res=>{
          this.loading = false;
        },
        error: err=>{
          console.log(err);
          this.loading = false;
          if(err.error.errors && err.error.errors.length>0){
            this.error = err.error.errors;
            err.error.errors.forEach((er:any)=>{
              console.log(er);
              if(er.error=='Credenciales inválidas'){
                this.error = er.error;
              }else{
                this.noti.notificate('Error', er.error, true, 15000);
              }
            });
          }else{
            this.noti.notificate('Error', 'Ocurrio un error al inciar sesión. Intentalo nuevamente más tarde', true);
          }
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
