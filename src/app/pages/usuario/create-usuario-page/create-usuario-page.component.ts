import { Component } from '@angular/core';
import { ButtonComponent } from '../../../components/button/button.component';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UtilsService } from '../../../services/utils.service';

@Component({
  selector: 'app-create-usuario-page',
  standalone: true,
  imports: [ButtonComponent, ReactiveFormsModule],
  templateUrl: './create-usuario-page.component.html',
  styleUrl: './create-usuario-page.component.css'
})
export class CreateUsuarioPage {
  form:FormGroup;
  roles: string[] = [];

  constructor(
    private formBuilder:FormBuilder,
    protected utils: UtilsService
  ){
    this.form = formBuilder.group({
      'nombre': ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.pattern('^[a-zA-Z\\sñÑáéíóúÁÉÍÓÚ]+$')]],
      'apellido': ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100), Validators.pattern('^[a-zA-Z\\sñÑáéíóúÁÉÍÓÚ]+$')]],
      'correo': ['', [Validators.required, Validators.email]],
      'fechaNacimiento': ['', [Validators.required]],
      'dni': ['', [Validators.required, Validators.minLength(7), Validators.maxLength(12), Validators.pattern('^[0-9]+$')]],
      'rol':['',[Validators.required]],
      'estado': 'ALTA'
    });
  }


  
}
