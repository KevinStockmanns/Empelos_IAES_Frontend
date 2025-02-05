import { Component, signal } from '@angular/core';
import { Empresa } from '../../../models/empresa.model';
import { EmpresaService } from '../../../services/empresa-service.service';
import { MatIconModule } from '@angular/material/icon';
import { ButtonComponent } from '../../../components/button/button.component';
import { FiltersComponent } from '../../../components/filters/filters.component';
import { LoaderComponent } from '../../../components/loader/loader.component';
import { NotificationService } from '../../../services/notification.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-empresa-list-page',
  imports: [MatIconModule, ButtonComponent, FiltersComponent, LoaderComponent, RouterModule],
  templateUrl: './empresa-list-page.component.html',
  styleUrl: './empresa-list-page.component.css'
})
export class EmpresaListPage {
  empresas = signal<Empresa[]>([]);
  loading = signal(true);

  constructor(
    private empresaService:EmpresaService,
    private noti:NotificationService
  ){
    this.loadEmpresas()
  }

  loadEmpresas(){
    this.loading.set(true);
    this.empresaService.getEmpresas().subscribe({
      next: res=>{
        console.log(res);
        this.loading.set(false);
        this.empresas.update(prev => [...prev, ...res.empresas])
      },
      error: err=>{
        this.loading.set(false);
        this.noti.notificateErrorsResponse(err.error);
        console.log(err);
        
      }
    });
  }
}
