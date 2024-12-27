import { Component, ElementRef, Inject, inject, OnInit, PLATFORM_ID, viewChild } from '@angular/core';
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

  selector = viewChild.required<ElementRef>('selector')
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

  select(e: MouseEvent){
    let target: HTMLDivElement = e.target as HTMLDivElement;
    

    if(!target.matches('.link')){
      target = (e.target as HTMLDivElement).closest('.link') as HTMLDivElement;
    }
    
    
    this.selector().nativeElement.style.top = target.offsetTop + 'px';
    this.selector().nativeElement.style.height = target.offsetHeight + 'px';
    
    
    
  }

  getUserId(){
    return this.usuarioService.getUsuario()?.id as number;
  }
}
