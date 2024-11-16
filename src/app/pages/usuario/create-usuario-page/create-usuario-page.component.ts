import { Component } from '@angular/core';
import { ButtonComponent } from '../../../components/button/button.component';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UtilsService } from '../../../services/utils.service';
import { requiredAge } from '../../../validators/required-age.validator';
import { UsuarioService } from '../../../services/usuario-service.service';
import { LoaderComponent } from '../../../components/loader/loader.component';

@Component({
  selector: 'app-create-usuario-page',
  standalone: true,
  imports: [ButtonComponent, ReactiveFormsModule, LoaderComponent],
  templateUrl: './create-usuario-page.component.html',
  styleUrl: './create-usuario-page.component.css',
})
export class CreateUsuarioPage {
  form: FormGroup;
  roles: string[] = [];
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    protected utils: UtilsService,
    private usuarioService: UsuarioService
  ) {
    this.form = formBuilder.group({
      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          Validators.pattern('^[a-zA-Z\\sñÑáéíóúÁÉÍÓÚ]+$'),
        ],
      ],
      apellido: [
        '',
        [
          Validators.required,
          Validators.minLength(3),
          Validators.maxLength(100),
          Validators.pattern('^[a-zA-Z\\sñÑáéíóúÁÉÍÓÚ]+$'),
        ],
      ],
      correo: ['', [Validators.required, Validators.email]],
      fechaNacimiento: ['', [Validators.required, requiredAge(18)]],
      dni: [
        '',
        [
          Validators.required,
          Validators.minLength(7),
          Validators.maxLength(12),
          Validators.pattern('^[0-9]+$'),
        ],
      ],
      rol: ['', [Validators.required]],
      estado: 'ALTA',
    });

    usuarioService.getRoles().subscribe({
      next: (res) => {
        this.roles = res.roles;
      },
    });
  }

  onSubmit() {
    this.form.markAllAsTouched();
    if (this.form.valid) {
      let json =this.form.value;
      json.clave = json.dni;
      this.loading = true;
      this.usuarioService.createUser(json).subscribe({
        next: (res) => {
          this.loading = false;

          console.log(res);
        },
        error: (err) => {
          this.loading = false;

          console.log(err);
        },
      });
    }
  }
}
