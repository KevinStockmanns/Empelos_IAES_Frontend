import { Component, effect, ElementRef, input, output, signal, viewChild } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { MatIconModule } from '@angular/material/icon';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-filters',
  imports: [ButtonComponent, MatIconModule, TitleCasePipe],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.css'
})
export class FiltersComponent {

  currentFilters = signal<{
    type:string,
    name:string,
    values?: {value:any, selected?:boolean}[],
    icon?:string
  }[]>([]);
  filters = input.required<{
    type:string,
    name:string,
    values?: {value:any, selected?:boolean}[],
    icon?:string
  }[]>();

  data = output();

  private filtersModal = viewChild.required<ElementRef>('filtersOptions');



  constructor(){
    effect(() => {
      const filters = this.filters();
      this.currentFilters.set(filters);
    });
    
  }


  toggleFilters(e:MouseEvent){
    let element = this.filtersModal().nativeElement as HTMLDivElement;
    element.classList.toggle('show');    
  }

  closeFilters(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const container = event.currentTarget as HTMLElement;

    if (target === container) {
      const element = this.filtersModal().nativeElement as HTMLDivElement;
      element.classList.remove('show');
    }
  }


  selectOption(filter:string, select:string){
    this.currentFilters.update(filters=>{
      let option = filters.find(el=>el.name == filter);
      option?.values?.forEach(el=> el.value == select ? el.selected = true : el.selected = false);
      return filters;
    })
    console.log(this.currentFilters());
    
  }
}
