import { Component } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { UtilsService } from '../../../services/utils.service';
import { ButtonComponent } from "../../../components/button/button.component";
import { LoaderComponent } from '../../../components/loader/loader.component';
import { UsuarioService } from '../../../services/usuario-service.service';
import { NotificationService } from '../../../services/notification.service';
import { Location } from '@angular/common';

@Component({
  selector: 'app-change-password',
  imports: [ReactiveFormsModule, ButtonComponent, LoaderComponent],
  templateUrl: './change-password.component.html',
  styleUrl: './change-password.component.css'
})
export class ChangePasswordPage {
  form:FormGroup

  loading = false;


  constructor(
    private formBuilder:FormBuilder,
    protected utils:UtilsService,
    private usuarioService: UsuarioService,
    private noti:NotificationService,
    private location:Location
  ){
    this.form = formBuilder.group({
      claveActual: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20), Validators.pattern('[a-zA-ZñÑ\\-_0-9]+')]],
      clave: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(20), Validators.pattern('[a-zA-ZñÑ\\-_0-9]+')]],
      clave2: ['', [this.passwordMatchValidator.bind(this)]],
    })
  }


  onSubmit(){
    this.form.markAllAsTouched()
    if(this.form.valid){
      this.loading = true;
      let json = this.form.value;
      this.usuarioService.changePassword(this.usuarioService.getUsuario()?.id as number, json).subscribe({
        next:res=>{
          this.loading = false;
          this.noti.notificate('Se cambio la clave con éxito.', '' ,false, 5000);
          this.location.back();
        },
        error:err=>{
          this.loading = false;
          this.noti.notificateErrorsResponse(err.error);
        }
      })
    }
  }



  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    // Solo validamos si hay un control y un formulario
    if (!control || !this.form) {
      return null;
    }

    // Obtenemos el valor del campo clave
    const clave = this.form.get('clave')?.value;
    const confirmPassword = control.value;

    // Si cualquiera no tiene valor, no validamos
    if (!clave || !confirmPassword) {
      return null;
    }

    // Comparamos y retornamos error si no coinciden
    if (clave !== confirmPassword) {
      return { passwordMismatch: true };
    }

    return null;
  }
}
