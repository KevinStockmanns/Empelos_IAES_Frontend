// filters.component.ts
import { Component, computed, effect, ElementRef, HostListener, Inject, inject, input, output, PLATFORM_ID, signal, viewChild } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { MatIconModule } from '@angular/material/icon';
import { isPlatformBrowser, TitleCasePipe } from '@angular/common';
import { Filtro } from '../../models/filter.model';

@Component({
  selector: 'app-filters',
  imports: [ButtonComponent, MatIconModule, TitleCasePipe],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.css'
})
export class FiltersComponent {
  currentFilters = signal<Filtro[]>([]);
  filters = input.required<Filtro[]>();
  private initFilters: Filtro[]|null = null;
  storageName = input<string>();
  isAnimating = signal<boolean>(false);

  data = output<any>();

  readonly computedFilters = computed(() => {
    let filters = this.filters();
    this.currentFilters.set(filters); 
    if(this.initFilters == null){
      // if(isPlatformBrowser(this.platformId) && this.storageName()){
      //   filters = JSON.parse(localStorage.getItem(this.storageName() as string) as string);
      // }
      this.initFilters = filters;
    }
    return filters; 
  });

  private filtersModal = viewChild.required<ElementRef>('filtersOptions');

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    
  ){
    effect(()=>{
      let filters = this.filters();
      if(this.initFilters == null){
        // if(isPlatformBrowser(platformId) && this.storageName()){
        //   filters = JSON.parse(localStorage.getItem(this.storageName() as string) as string);
        // }
        this.initFilters = filters;
      }
    })

    if(isPlatformBrowser(this.platformId) && this.storageName()){
      this.currentFilters.set(JSON.parse(localStorage.getItem(this.storageName() as string) as string) as Filtro[]);
    }
  }

  toggleFilters(e: MouseEvent){
    if (this.isAnimating()) return;
    
    const element = this.filtersModal().nativeElement as HTMLDivElement;
    const container = element.parentElement as HTMLDivElement;
    
    if (!element.classList.contains('show')) {
      // Abrir
      container.style.display = 'block';
      // Forzar reflow
      void container.offsetWidth;
      container.classList.add('visible');
      element.classList.add('show');
      this.currentFilters.set(this.filters());
    } else {
      this.closeFilters();
    }
  }

  onCloseFilters(event: MouseEvent) {
    const target = event.target as HTMLElement;
    const container = event.currentTarget as HTMLElement;

    if (target === container) {
      this.closeFilters();
    }
  }

  private closeFilters(){
    if (this.isAnimating()) return;
    
    const element = this.filtersModal().nativeElement as HTMLDivElement;
    const container = element.parentElement as HTMLDivElement;
    
    this.isAnimating.set(true);
    container.classList.remove('visible');
    element.classList.remove('show');

    setTimeout(() => {
      container.style.display = 'none';
      this.isAnimating.set(false);
    }, 300); // Debe coincidir con la duración de --transitionMid
  }

  selectOption(filterName: string, selectedValue: string, multiple: boolean=false) {
    this.currentFilters.update(filters =>
      filters.map(filter =>
        filter.name === filterName
          ? {
              ...filter,
              values: filter.values?.map(value => ({
                ...value,
                selected: multiple
                  ? value.value === selectedValue
                    ? !value.selected
                    : value.selected
                  : value.value === selectedValue
              }))
            }
          : filter
      )
    );
}


  selectText(filterName:string, event: KeyboardEvent){
    let value = (event.target as HTMLInputElement).value;
    this.currentFilters.update(prev=>
      prev.map(fil=>
        fil.name == filterName
          ? {
            ...fil,
            value: value,
            values: value ? [{value: value, selected:true}] : []
          }
          : fil
      )
    );
  }

  selectRange(filterName:string, e1: HTMLInputElement, e2:HTMLInputElement){
    let value = e1.value;
    let value2 = e2.value;

    this.currentFilters.update(prev=>
      prev.map(fil=>
        fil.name == filterName
          ? {
            ...fil,
            values: [{value: value}, {value: value2}]
          }
          : fil
      )
    );
  }

  applyFilters() {
    this.data.emit(this.currentFilters())
    this.closeFilters();
    // if(isPlatformBrowser(this.platformId) && this.storageName()){
    //   localStorage.setItem(this.storageName() as string, JSON.stringify(this.currentFilters()))
    // }
  }
  
  resetFilters(){
    console.log(this.initFilters);
    
    this.currentFilters.set(this.initFilters as Filtro[]);
    this.data.emit(this.currentFilters());
    this.closeFilters();
    // if(isPlatformBrowser(this.platformId) && this.storageName()){
    //   localStorage.removeItem(this.storageName() as string);
    // }
  }


  @HostListener('document:keydown.escape', ['$event'])
  onEscapeKey(event: KeyboardEvent) {
    this.closeFilters();
  }
}