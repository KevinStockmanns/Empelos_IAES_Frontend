import { AfterViewInit, Component, ElementRef, Inject, inject, OnInit, PLATFORM_ID, viewChild } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import AOS from 'aos';
import { isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';
import { UsuarioService } from '../../services/usuario-service.service';


@Component({
    selector: 'app-dashboard',
    imports: [MatIconModule, RouterModule],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements AfterViewInit {

  selector = viewChild.required<ElementRef>('selector')
  constructor(
    @Inject(PLATFORM_ID) private plataformId:Object,
    protected usuarioService:UsuarioService
  ){

  }

  ngAfterViewInit(): void {
    if (isPlatformBrowser(this.plataformId)){
      AOS.init();

      setTimeout(() => {
        let selectorInit = document.querySelector<HTMLDivElement>('.link.active');
        if(selectorInit){
          this.updateSelectorPosition(selectorInit);
        }
      }, 1000);
      
    }
  }

  select(e: MouseEvent){
    let target: HTMLDivElement = e.target as HTMLDivElement;
    
    if(!target.matches('.link')){
      target = (e.target as HTMLDivElement).closest('.link') as HTMLDivElement;
    }

    this.updateSelectorPosition(target);
  }
  updateSelectorPosition(target: HTMLDivElement): void {
    const selectorEl = this.selector().nativeElement;
    selectorEl.style.top = `${target.offsetTop}px`;
    selectorEl.style.height = `${target.offsetHeight}px`;
  }

  getUserId(){
    return this.usuarioService.getUsuario()?.id as number;
  }

  onLogout(){
    this.usuarioService.logout();
  }
}
