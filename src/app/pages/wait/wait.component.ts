import { Component, inject, PLATFORM_ID } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { UsuarioService } from '../../services/usuario-service.service';
import { isPlatformBrowser } from '@angular/common';
import Aos from 'aos';

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
    

    if(isPlatformBrowser(inject(PLATFORM_ID))){
      Aos.init();
      setTimeout(() => {
        Aos.refresh()
      }, 100);
      setTimeout(() => {
        Aos.refresh()
      }, 1000);
    }
  }
}
