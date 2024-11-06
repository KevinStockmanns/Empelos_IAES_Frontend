import { Component, Signal } from '@angular/core';
import { UsuarioService } from '../../services/usuario-service.service';
import { Usuario } from '../../models/usuario.model';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  usuario: Signal<Usuario|null>;
  constructor(
    private usuarioService: UsuarioService
  ){
    this.usuario = usuarioService.getUsuario();
  }
}
