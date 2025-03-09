import { Component, ElementRef, signal, viewChild } from '@angular/core';
import { Empresa } from '../../../models/empresa.model';
import { EmpresaService } from '../../../services/empresa-service.service';
import { MatIconModule } from '@angular/material/icon';
import { ButtonComponent } from '../../../components/button/button.component';
import { FiltersComponent } from '../../../components/filters/filters.component';
import { LoaderComponent } from '../../../components/loader/loader.component';
import { NotificationService } from '../../../services/notification.service';
import { RouterModule } from '@angular/router';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { DeleteEmpresaModal } from '../../../modals/delete-empresa.component';
import { UsuarioService } from '../../../services/usuario-service.service';
import { Filtro, getDataOfFiltro } from '../../../models/filter.model';

@Component({
  selector: 'app-empresa-list-page',
  imports: [MatIconModule, ButtonComponent, FiltersComponent, LoaderComponent, RouterModule, MatDialogModule],
  templateUrl: './empresa-list-page.component.html',
  styleUrl: './empresa-list-page.component.css'
})
export class EmpresaListPage {
  empresas = signal<Empresa[]>([]);
  loading = signal(true);

  filtros: Filtro[] = [
    {type:'text', name:'nombre', nameText: 'Empresa', value:''},
    {type:'text', name:'Referente'}
  ];

  pagination = signal({
    page: 0,
    totalPage:0,
    hasMore:true
  })

  centinelaEmpresas = viewChild<ElementRef<HTMLDivElement>>('centinelaEmpresas');

  constructor(
    private empresaService:EmpresaService,
    private noti:NotificationService,
    private dialog: MatDialog, 
    private usuarioService: UsuarioService
  ){
    // console.log(empresaService.getSelectedEmpresa());
    
    this.loadEmpresas()
  }

  loadEmpresas(){
    this.loading.set(true);
    this.empresaService.getEmpresas().subscribe({
      next: res=>{
        this.loading.set(false);
        
        this.empresas.update(prev => [...prev, ...res.content])
        this.pagination.set({
          page: res.page,
          totalPage: res.totalPages,
          hasMore: res.page< res.totalPages
        })


        if(this.centinelaEmpresas()){
          let observer = new IntersectionObserver((entries)=>{

            entries.forEach(el=>{
              if(el.isIntersecting){
                this.loadMoreEmpresas(++this.pagination().page, this.filtros)
              }
            })
          })

          observer.observe(this.centinelaEmpresas()?.nativeElement as HTMLDivElement)
        }
      },
      error: err=>{
        this.loading.set(false);
        this.noti.notificateErrorsResponse(err.error);
        
      }
    });
  }


  applyFilters(page:number, filtros:any){
    this.empresas.set([])
    this.pagination.set({page: 0, totalPage: 0, hasMore: true})

    this.loadMoreEmpresas(page, filtros)
  }

  loadMoreEmpresas(page?:number, filtros?:any){
    
    if(!this.loading() && this.pagination().hasMore){
      this.loading.set(true)
      if(page == 1){
        this.empresas.set([])
      }
      if(filtros){
        this.filtros = filtros;
        filtros = getDataOfFiltro(filtros);
      }
      this.empresaService.getEmpresas(filtros, page || ++this.pagination().page).subscribe({
        next:res=>{
          
          this.loading.set(false);
          this.pagination.set({page: res.page, totalPage: res.totalPages, hasMore: res.page< res.totalPages})
          this.empresas.update(prev=> [...prev, ...res.content]);
        },
        error:err=>{
          this.loading.set(false);
          this.noti.notificateErrorsResponse(err.error);
        }
      })
    }
  }


  onEdit(idEmpresa:number){
    this.empresaService.selectEmpresa(idEmpresa);
  }


  onDelete(empresa: Empresa){
    const dialogRef = this.dialog.open(DeleteEmpresaModal, {
      width: '300px',
      data: empresa
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.empresaService.deleteEmpresa(empresa.id, this.usuarioService.getUsuario()?.id as number).subscribe({
          next: res=>{
            this.noti.notificate('Empresa eliminada con éxito.', '', false, 5000);
            this.empresas.update(prev=> prev.filter(e => e.id !== empresa.id));
          },
          error: (err)=>{
            this.noti.notificateErrorsResponse(err.error);
          }
        });
      }
    });
  }
}
