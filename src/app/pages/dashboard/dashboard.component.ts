import { AfterViewInit, Component, ElementRef, Inject, inject, OnDestroy, OnInit, PLATFORM_ID, Renderer2, viewChild } from '@angular/core';
import {MatIconModule} from '@angular/material/icon';
import AOS from 'aos';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router, RouterModule } from '@angular/router';
import { UsuarioService } from '../../services/usuario-service.service';
import { UtilsService } from '../../services/utils.service';


@Component({
    selector: 'app-dashboard',
    imports: [MatIconModule, RouterModule],
    templateUrl: './dashboard.component.html',
    styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements AfterViewInit {

  navOpen = false;
  selector = viewChild.required<ElementRef>('selector')
  constructor(
    @Inject(PLATFORM_ID) private plataformId:Object,
    protected usuarioService:UsuarioService,
    private router: Router,
    private utils:UtilsService,
    private renderer: Renderer2
  ){

  }

  onNavOpen(){
    this.navOpen = !this.navOpen;
    console.log(this.navOpen)
  }
  cerrarNav(){
    setTimeout(() => {
      this.navOpen = false;
    }, 200);
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
      

      this.router.events.subscribe({
        next: (ev)=>{
          if(ev instanceof NavigationEnd){
            let page: string|null = null;
            if(ev.url.startsWith('/dashboard/empresas')){
              page = 'empresas';
            }else if(ev.url.startsWith('/dashboard/profile')){
              page = 'profile'
            }else if(ev.url.startsWith('/dashboard/users')){
              page = 'users';
            }else if(ev.url.startsWith('/dashboard/pasantias')){
              page = 'pasantias';
            }

            this.utils.selectDashContent(page);

            if(page){
              let linkElement = this.renderer.selectRootElement(`.link.${page}`, true);
              this.updateSelectorPosition(linkElement);              
            }
          }
        }
      })
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


  onPerfil(){
    this.usuarioService.selectUser(this.usuarioService.getUsuario());
  }
}
