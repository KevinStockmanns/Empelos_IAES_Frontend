import { Component, input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UsuarioService } from '../../services/usuario-service.service';
import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterModule, ButtonComponent],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css'
})
export class HeaderComponent {
  simple = input(true);

  constructor(
    protected usuarioService:UsuarioService
  ){

  }

  logout(){
    this.usuarioService.logout();
  }
}
