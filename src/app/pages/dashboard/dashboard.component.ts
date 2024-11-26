import { Component, Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import {MatIconModule} from '@angular/material/icon';
import AOS from 'aos';
import { isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UsuarioService } from '../../services/usuario-service.service';


@Component({
    selector: 'app-dashboard',
    imports: [HeaderComponent, MatIconModule, RouterModule],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  constructor(
    @Inject(PLATFORM_ID) private plataformId:Object,
    protected usuarioService:UsuarioService
  ){

  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.plataformId)){
      AOS.init();
    }
  }

  getUserId(){
    return this.usuarioService.getUsuario()?.id as number;
  }
}
