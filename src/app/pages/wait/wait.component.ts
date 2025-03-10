import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { UsuarioService } from '../../services/usuario-service.service';

@Component({
  selector: 'app-wait',
  imports: [MatIconModule],
  templateUrl: './wait.component.html',
  styleUrl: './wait.component.css'
})
export class WaitComponent {

  constructor(
    protected usuarioService:UsuarioService
  ){
    
  }
}
