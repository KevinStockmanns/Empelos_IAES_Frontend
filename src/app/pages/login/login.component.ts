import { Component } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import { UsuarioService } from '../../services/usuario-service.service';
import { FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { LoaderComponent } from '../../components/loader/loader.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [HeaderComponent, LoaderComponent, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  form:FormGroup;
  loading = false;
  error: string = "";

  constructor(private usuarioService:UsuarioService,
    private formBuilder:FormBuilder
  ){
    this.form = this.formBuilder.group({
      'correo': ['', [Validators.required, Validators.email]],
      'clave': ['', [
        Validators.required,
        Validators.pattern('[a-zA-ZñÑ\\-_0-9]+$'), // Patrón para la contraseña
        Validators.minLength(8), // Longitud mínima de 8 caracteres
        Validators.maxLength(20) // Longitud máxima de 20 caracteres
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
          if(err.error.errors){
            this.error = err.error.errors;
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
