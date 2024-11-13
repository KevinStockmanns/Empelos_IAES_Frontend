import { Component, Signal } from '@angular/core';
import { UsuarioService } from '../../services/usuario-service.service';
import { Usuario } from '../../models/usuario.model';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [TitleCasePipe],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  usuario: Signal<Usuario|null>;
  constructor(
    protected usuarioService: UsuarioService
  ){
    this.usuario = usuarioService.getUsuario();
  }
}
