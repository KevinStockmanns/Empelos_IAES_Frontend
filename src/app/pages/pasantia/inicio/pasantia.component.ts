import { AfterContentInit, Component, ElementRef, signal, viewChild } from '@angular/core';
import { ButtonComponent } from '../../../components/button/button.component';
import { RouterModule } from '@angular/router';
import { PasantiaService } from '../../../services/pasantia.service';
import { UtilsService } from '../../../services/utils.service';
import { NotificationService } from '../../../services/notification.service';
import { LoaderComponent } from '../../../components/loader/loader.component';
import { PasantiaListado } from '../../../models/pasantia.model';
import { UsuarioService } from '../../../services/usuario-service.service';
import { forkJoin } from 'rxjs';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { GenericModal } from '../../../modals/generic-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { FiltersComponent } from '../../../components/filters/filters.component';
import { Filtro, getDataOfFiltro } from '../../../models/filter.model';

@Component({
  selector: 'app-crud',
  imports: [ButtonComponent, RouterModule, LoaderComponent, MatIconModule, MatTooltipModule, FiltersComponent],
  templateUrl: './pasantia.component.html',
  styleUrl: './pasantia.component.css'
})
export class PasantiaPage implements AfterContentInit {

  filtorsActuales: Filtro[]=[
    {name:'usuario', type:'text', value:''},
    {name:'empresa', type:'text', value:''},
  ];
  filtorsFinalizadas: Filtro[]=[
    {name:'usuario', type:'text', value:''},
    {name:'empresa', type:'text', value:''},
  ];
  filtorsPendientes: Filtro[]=[
    {name:'usuario', type:'text', value:''},
    {name:'empresa', type:'text', value:''},
  ];
  filtrosSolicitadas: Filtro[]=[
    {name:'usuario', type:'text', value:''},
    {name:'empresa', type:'text', value:''},
  ];

  misPasantias = signal<PasantiaListado[]>([]);
  
  pasantiasPendientes = signal<PasantiaListado[]>([]);
  pasantiasActuales = signal<PasantiaListado[]>([]);
  pasantiasFinalizadas = signal<PasantiaListado[]>([]);
  pasantiasSolicitadas = signal<PasantiaListado[]>([]);
  loading = signal(true);
  loaders = signal({
    pendientes:false,
    actuales:false,
    finalizadas:false,
    solicitadas:false,
    misPasantias:false,
  });
  pagination = {
    pendientes: { page: 0, totalPages: 0, hasMore: true },
    actuales: { page: 0, totalPages: 0, hasMore: true },
    finalizadas: { page: 0, totalPages: 0, hasMore: true },
    solicitadas: { page: 0, totalPages: 0, hasMore: true },
    misPasantias: { page: 0, totalPages: 0, hasMore: true },
  };

  private orderRow  =false;


  centinelaPendientes = viewChild<ElementRef<HTMLDivElement>>('centinelaPendientes');
  centinelaActuales = viewChild<ElementRef<HTMLDivElement>>('centinelaActuales');
  centinelaFinalizadas = viewChild<ElementRef<HTMLDivElement>>('centinelaFinalizadas');
  centinelaSolicitadas = viewChild<ElementRef<HTMLDivElement>>('centinelaSolicitadas');

  constructor(
    private pasantiaService: PasantiaService,
    private utils:UtilsService,
    private noti:NotificationService,
    protected usuarioService:UsuarioService,
    private dialog:MatDialog
  ){
    if(usuarioService.isAdmin()){
      this.loadPasantias();
    }

    if(usuarioService.isAlumn()){
      this.loadMisPasantias();
    }
  }


ngAfterContentInit(): void {
    

  
}


  private observar(element: Element, type: 'pendientes'|'actuales'|'finalizada'|'solicitada'){
    let observer = new IntersectionObserver((entries)=>{
      
      entries.forEach(entry => {
        
        if (entry.isIntersecting) {
          if(type == 'pendientes'){
            this.loadPendientes();
          }else if(type== 'actuales'){
            this.loadActuales();
          }else if(type== 'finalizada'){
            this.loadFinalizadas();
          }else if(type == 'solicitada'){
            this.loadSolicitadas();
          }
        }
      });
    });

    
    observer.observe(element);
  }


  loadPasantias() {
    const pasantiasPendientes$ = this.pasantiaService.listarPasantias({ pendiente: true });
    const pasantiasActuales$ = this.pasantiaService.listarPasantias({ estado: 'ACTUAL' });
    const pasantiasFinalizadas$ = this.pasantiaService.listarPasantias({ estado: 'FINALIZADA' });
    const pasantiasSolicitadas$ = this.pasantiaService.listarPasantias({ estado: 'SOLICITADA' });

    forkJoin([pasantiasPendientes$, pasantiasActuales$, pasantiasFinalizadas$, pasantiasSolicitadas$]).subscribe({
      next: ([pendientes, actuales, finalizadas, solicitadas]) => {
        // Si todas las peticiones fueron exitosas, se actualizan las señales.
        this.pasantiasPendientes.set(pendientes.content);
        this.pagination.pendientes = {page: pendientes.page, totalPages: pendientes.totalPages, hasMore: pendientes.page < pendientes.totalPages}

        this.pasantiasActuales.set(actuales.content);
        this.pagination.actuales = {page: actuales.page, totalPages: actuales.totalPages, hasMore: actuales.page < actuales.totalPages}

        this.pasantiasFinalizadas.set(finalizadas.content);
        this.pagination.finalizadas = {page: finalizadas.page, totalPages: finalizadas.totalPages, hasMore: finalizadas.page < finalizadas.totalPages}

        this.pasantiasSolicitadas.set(solicitadas.content);
        this.pagination.solicitadas = {page: solicitadas.page, totalPages: solicitadas.totalPages, hasMore: solicitadas.page < solicitadas.totalPages}


        this.loading.set(false);  // Desactivar el loader


        if(this.centinelaPendientes()){
          this.observar(this.centinelaPendientes()?.nativeElement as HTMLDivElement, 'pendientes')
      
        }
              
        if(this.centinelaActuales()){
          this.observar(this.centinelaActuales()?.nativeElement as HTMLDivElement, 'actuales')
        }

        if(this.centinelaFinalizadas()){
          this.observar(this.centinelaFinalizadas()?.nativeElement as HTMLDivElement, 'finalizada');
        }

        if(this.centinelaSolicitadas()){
          this.observar(this.centinelaSolicitadas()?.nativeElement as HTMLDivElement, 'solicitada');
        }
      },
      error: (err) => {
        // Si alguna de las peticiones falla, se muestra el error.
        this.noti.notificateErrorsResponse(err.error);
        this.loading.set(false);  // Desactivar el loader incluso si falla
      }
    });
  }


  loadMisPasantias(){
    this.loading.set(true);

    this.pasantiaService.listarPasantias({page: ++this.pagination.pendientes.page}).subscribe({
      next:res=>{
        this.loading.set(false);
        this.misPasantias.update(prev=> [...prev, ...res.content.filter(el=> el.estado == 'APROBADA')]);
        this.pasantiasSolicitadas.update(prev=> [...prev, ...res.content.filter(el=> el.estado == 'SOLICITADA')]);
        this.pagination.misPasantias = {page: res.page, totalPages: res.totalPages, hasMore: res.page < res.totalPages}
      },
      error: err=>{
        this.noti.notificateErrorsResponse(err.error, 'Ocurrio un error al cargar las pasantias');
        this.loading.set(false);
      }
    })
  }
  loadPendientes(filtros?:any, page?:number){
    if(!this.loaders().pendientes && this.pagination.pendientes.hasMore || page==1){
      if(page == 1){
        this.pasantiasPendientes.set([])
      }
      if(filtros){
        this.filtorsPendientes = filtros
        filtros = getDataOfFiltro(filtros);
      }
      this.loaders.update(prev=> ({...prev, pendientes: true}))
      this.pasantiaService.listarPasantias({...filtros, pendiente: true , page: page || ++this.pagination.pendientes.page}).subscribe({
        next: res=>{
          this.pasantiasPendientes.update(prev=> [...prev, ...res.content])
          this.pagination.pendientes = {page: res.page, totalPages: res.totalPages, hasMore: res.page < res.totalPages}
          this.loaders.update(prev=>({...prev, pendientes:false}))
        },
        error: err=>{
          this.noti.notificateErrorsResponse(err.error, 'Ocurrio un error al cargar las pasantias');
          this.loaders.update(prev=>({...prev, pendientes:false}))
        }
      })
    }
  }

  loadActuales(filtros?:any, page?:number){
    if(!this.loaders().actuales && (this.pagination.actuales.hasMore || page==1)){
      if(filtros){
        this.filtorsActuales = filtros;
        filtros = getDataOfFiltro(filtros);
      }
      if(page==1){
        this.pasantiasActuales.set([])
      }
      
      this.loaders.update(prev=> ({...prev, actuales: true}))
      this.pasantiaService.listarPasantias({...filtros, estado: 'ACTUAL' , page: page || ++this.pagination.actuales.page}).subscribe({
        next: res=>{
          this.pasantiasActuales.update(prev=> [...prev, ...res.content])
          this.pagination.actuales = {page: res.page, totalPages: res.totalPages, hasMore: res.page < res.totalPages}
          this.loaders.update(prev=>({...prev, actuales:false}))
        },
        error: err=>{
          this.noti.notificateErrorsResponse(err.error, 'Ocurrio un error al cargar las pasantias');
          this.loaders.update(prev=>({...prev, actuales:false}))
        }
      })
    }
  }

  loadFinalizadas(filtros?:any, page?:number){
    if(!this.loaders().finalizadas && (this.pagination.finalizadas.hasMore || page==1)){
      if(page==1){
        this.pasantiasFinalizadas.set([])
      }
      if(filtros){
        this.filtorsFinalizadas = filtros;
        filtros = getDataOfFiltro(filtros);
      }
      this.loaders.update(prev=> ({...prev, finalizadas: true}))
      this.pasantiaService.listarPasantias({...filtros, estado: 'FINALIZADA' , page: page || ++this.pagination.finalizadas.page}).subscribe({
        next: res=>{
          this.pasantiasFinalizadas.update(prev=> [...prev, ...res.content])
          this.pagination.finalizadas = {page: res.page, totalPages: res.totalPages, hasMore: res.page < res.totalPages}
          this.loaders.update(prev=>({...prev, finalizadas:false}))
        },
        error: err=>{
          this.noti.notificateErrorsResponse(err.error, 'Ocurrio un error al cargar las pasantias');
          this.loaders.update(prev=>({...prev, finalizadas:false}))
        }
      })
    }
  }

  loadSolicitadas(filtros?:any, page?:number){
    if(!this.loaders().solicitadas && this.pagination.solicitadas.hasMore || page == 1){
      if(page == 1){
        this.pasantiasSolicitadas.set([])
      }
      if(filtros){
        this.filtrosSolicitadas = filtros;
        filtros = getDataOfFiltro(filtros);
      }
      this.loaders.update(prev=> ({...prev, solicitadas: true}))
      this.pasantiaService.listarPasantias({...filtros, estado: 'SOLICITADA' , page: page || ++this.pagination.solicitadas.page}).subscribe({
        next: res=>{
          this.pasantiasSolicitadas.update(prev=> [...prev, ...res.content])
          this.pagination.solicitadas = {page: res.page, totalPages: res.totalPages, hasMore: res.page < res.totalPages}
          this.loaders.update(prev=>({...prev, solicitadas:false}))
        },
        error: err=>{
          this.noti.notificateErrorsResponse(err.error, 'Ocurrio un error al cargar las pasantias');
          this.loaders.update(prev=>({...prev, solicitadas:false}))
        }
      })
    }
  }

  getRow(){
    let toreturn = this.orderRow;
    this.orderRow = !this.orderRow;
    return toreturn;
  }


  onSelectPasantia(pasantia:PasantiaListado){
    this.pasantiaService.selectPasantia(pasantia);
  }
  onAgregar(){
    this.pasantiaService.selectPasantia(null);
  }

  onDelete(pasantia:PasantiaListado){
    const dialogRef = this.dialog.open(GenericModal, {
      width: '300px',
      data: {
        text: 'Se eliminará la pasantía y los datos de los alumnos asociados con la pasantía ¿Deseas continuar?',
        textTitle: 'Eliminar',
        textCancelar: 'Cancelar',
        textConfirmar: 'Eliminar'
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.pasantiaService.deletePasantia(pasantia.id).subscribe({
          next:res=>{
            this.pasantiasActuales.update(prev=> prev.filter(el=>el.id!=pasantia.id))
            this.pasantiasSolicitadas.update(prev=> prev.filter(el=>el.id!=pasantia.id))
            this.pasantiasPendientes.update(prev=> prev.filter(el=>el.id!=pasantia.id))
            this.pasantiasFinalizadas.update(prev=> prev.filter(el=>el.id!=pasantia.id))
          },
          error: err=>{
            this.noti.notificateErrorsResponse(err.error);
          }
        })
      }
    });
  }


  generateTrack(pasantiaId:number, userId:number){
    return `${pasantiaId}-${userId}`
  }
}
