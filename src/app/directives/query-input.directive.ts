import { AfterViewInit, Directive, ElementRef, HostListener, input, Signal, signal } from '@angular/core';
import { QueryInput } from '../models/query-input.models';
import { elements } from 'chart.js';
import { Observable } from 'rxjs';

@Directive({
  selector: '[queryInput]'
})
export class QueryInputDirective implements AfterViewInit{

  callback = input.required<()=>Observable<QueryInput[]>>();
  private timeoutId: any = null;


  constructor(private element:ElementRef<HTMLDivElement>) {
    element.nativeElement.insertAdjacentHTML('beforeend', `<div class="query-sugerencias"></div>`)
   }


  ngAfterViewInit(): void {
    this.element.nativeElement.querySelector('input[type="text"]')?.addEventListener('focus', ()=>{
      this.mostrarSugerencias();
    })

    this.element.nativeElement.querySelector('input[type="text"]')?.addEventListener('click', ()=>{
      this.mostrarSugerencias();
    })

    this.element.nativeElement.querySelector('input[type="text"]')?.addEventListener('keyup', (e:any)=>{
      if(e.key=='Escape'){
        this.ocultarSugerencias();
        return;
      }

      if((e.key == 'Delete' ||e.key == 'Backspace') && e.target.value.length==0){
        this.cargarDatos([]);
      }

      if(e.target.value.trim().length>0){
        // Limpiar el timeout anterior
        if(this.timeoutId) {
          clearTimeout(this.timeoutId);
        }
        
        this.timeoutId = setTimeout(() => {
          this.callback()().subscribe(data => {
            this.cargarDatos(data);
          });
        }, 500); // Espera 300ms después de que el usuario deje de escribir
      }
    })


    this.element.nativeElement.querySelector('input[type="text"]')?.addEventListener('blur', ()=>{
      this.ocultarSugerencias();
    })
  }

  

  selectItem(data:QueryInput){
    let input = this.element.nativeElement.querySelector('input[type="text"]') as HTMLInputElement;
    let inputHidden = this.element.nativeElement.querySelector('input[type="hidden"]') as HTMLInputElement;

    input.value = data.textToInput ?? data.text;
    inputHidden.value = data.value;

    const event = new Event('input', { bubbles: true });
    input.dispatchEvent(event);
    inputHidden.dispatchEvent(event);
  }



  cargarDatos(data: QueryInput[]) {
    let container = this.element.nativeElement.querySelector('.query-sugerencias');
    if(container) {
      container.innerHTML = '';
    }
    
    data.forEach(el => {
      const div = document.createElement('div');
      div.className = 'cursor';
      div.textContent = el.text;
      div.addEventListener('click', () => {
        this.selectItem(el);
        this.ocultarSugerencias();
      });
      container?.appendChild(div);
    });
  
    this.mostrarSugerencias();
    if(data.length == 0) {
      container?.insertAdjacentHTML('beforeend', `<div class="">Sin Resultados</div>`);
      let inputHidden = this.element.nativeElement.querySelector('input[type="hidden"]') as HTMLInputElement;
      inputHidden.value = ''

      const event = new Event('input', { bubbles: true });
      inputHidden.dispatchEvent(event);
    }
  }


  mostrarSugerencias(){
    const container = this.element.nativeElement.querySelector('.query-sugerencias');

    if (container && container.childElementCount > 0) {
      container.classList.add('show');
    }
  }
  ocultarSugerencias(){
    this.element.nativeElement.querySelector('.query-sugerencias')?.classList.remove('show');
  }

}
