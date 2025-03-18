// filters.component.ts
import { AfterViewInit, Component, computed, effect, ElementRef, HostListener, Inject, inject, input, output, PLATFORM_ID, signal, viewChild } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { MatIconModule } from '@angular/material/icon';
import { isPlatformBrowser, TitleCasePipe } from '@angular/common';
import { Filtro } from '../../models/filter.model';

@Component({
  selector: 'app-filters',
  imports: [ButtonComponent, MatIconModule],
  templateUrl: './filters.component.html',
  styleUrl: './filters.component.css'
})
export class FiltersComponent implements AfterViewInit {
  currentFilters = signal<Filtro[]>([]);
  filters = input.required<Filtro[]>();
  private initFilters: Filtro[] | null = null;
  storageName = input<string>();
  isAnimating = signal<boolean>(false);
  isReseteable = input(true);
  readonly appliedFilters = computed(() => {
    let count = 0;

    this.currentFilters().forEach(filter => {
      if (filter.values && Array.isArray(filter.values) && filter.type !== 'range') {
        const selectedOptions = filter.values.filter(value => value.selected === true);
        if (selectedOptions.length > 0) {
          count += 1; 

          // console.log(`Filtro '${filter.name}': ${selectedOptions.length} opciones seleccionadas, sumando 1 al contador`);
        }
      }

      else if (filter.value && typeof filter.value === 'string' && filter.value.trim() !== '') {
        count++;
        // console.log(`Filtro de texto '${filter.name}': valor '${filter.value}', sumando 1 al contador`);
      }

      else if (filter.type === 'range' && filter.values && filter.values.length === 2) {
        if ((filter.values[0].value !== null && filter.values[0].value !== undefined && filter.values[0].value !== '') ||
          (filter.values[1].value !== null && filter.values[1].value !== undefined && filter.values[1].value !== '')) {
          count++;
          // console.log(`Filtro de rango '${filter.name}': min=${filter.values[0].value}, max=${filter.values[1].value}, sumando 1 al contador`);
        }
      }
    });

    // console.log(`Total de filtros aplicados: ${count}`);
    return count;
  });

  data = output<any>();
  hasVerticalScroll = false

  readonly computedFilters = computed(() => {
    let filters = this.filters();
    this.currentFilters.set(filters);
    if (this.initFilters == null) {
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

  ) {
    effect(() => {
      let filters = this.filters();
      if (this.initFilters == null) {
        // if(isPlatformBrowser(platformId) && this.storageName()){
        //   filters = JSON.parse(localStorage.getItem(this.storageName() as string) as string);
        // }
        this.initFilters = filters;
      }
      this.currentFilters.set(filters)
    })

    if (isPlatformBrowser(this.platformId) && this.storageName()) {
      this.currentFilters.set(JSON.parse(localStorage.getItem(this.storageName() as string) as string) as Filtro[]);
    }
  }

  toggleFilters(e: MouseEvent) {
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
      setTimeout(() => {
        this.checkScroll()
      }, 350);
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

  private closeFilters() {
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

  //   selectOption(filterName: string, selectedValue: string, multiple: boolean=false) {
  //     this.currentFilters.update(filters =>
  //       filters.map(filter =>
  //         filter.name === filterName
  //           ? {
  //               ...filter,
  //               values: filter.values?.map(value => ({
  //                 ...value,
  //                 selected: multiple
  //                   ? value.value === selectedValue
  //                     ? !value.selected
  //                     : value.selected
  //                   : value.value === selectedValue
  //               }))
  //             }
  //           : filter
  //       )
  //     );
  // }


  selectOption(filterName: string, selectedValue: string, multiple: boolean = false) {
    this.currentFilters.update(filters =>
      filters.map(filter => {
        if (filter.name !== filterName) return filter;

        const updatedValues = filter.values?.map(value => ({
          ...value,
          selected: multiple
            ? value.value === selectedValue
              ? !value.selected
              : value.selected
            : value.value === selectedValue
        }));

        // Verificar si al menos un valor sigue seleccionado cuando es `required`
        if (filter.required && updatedValues?.every(v => !v.selected)) {
          return filter; // No actualizar si todos quedarían deseleccionados
        }

        return { ...filter, values: updatedValues };
      })
    );
  }



  selectText(filterName: string, event: KeyboardEvent) {
    let value = (event.target as HTMLInputElement).value;
    this.currentFilters.update(prev =>
      prev.map(fil =>
        fil.name == filterName
          ? {
            ...fil,
            value: value,
            values: value ? [{ value: value, selected: true }] : []
          }
          : fil
      )
    );
  }

  selectRange(filterName: string, e1: HTMLInputElement, e2: HTMLInputElement) {
    let value = e1.value;
    let value2 = e2.value;

    this.currentFilters.update(prev =>
      prev.map(fil =>
        fil.name == filterName
          ? {
            ...fil,
            values: [{ value: value }, { value: value2 }]
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

  resetFilters() {
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

  ngAfterViewInit() {
    this.checkScroll();

    // Escucha cambios de scroll
    this.filtersModal().nativeElement.addEventListener('scroll', () => {
      this.checkScroll();
    });
  }


  checkScroll() {
    if (this.filtersModal()) {
      const el = this.filtersModal().nativeElement as HTMLElement;
      const hasMoreScrollDown = el.scrollTop + el.clientHeight < el.scrollHeight;
      this.hasVerticalScroll = hasMoreScrollDown
    }
  }


  countFilters(): number {
    let count = 0;

    this.currentFilters().forEach(filter => {
      if (filter.values && Array.isArray(filter.values)) {
        const selectedOptions = filter.values.filter(value => value.selected === true);
        if (selectedOptions.length > 0) {
          count += selectedOptions.length;
        }
      }

      if (filter.value && filter.value.trim() !== '') {
        count++;
      }

      if (filter.type === 'range' && filter.values && filter.values.length === 2) {
        if (filter.values[0].value || filter.values[1].value) {
          count++;
        }
      }
    });

    return count;
  }
}