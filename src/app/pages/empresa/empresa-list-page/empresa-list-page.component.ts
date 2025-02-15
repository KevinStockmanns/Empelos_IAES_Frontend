import { Component, signal } from '@angular/core';
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

@Component({
  selector: 'app-empresa-list-page',
  imports: [MatIconModule, ButtonComponent, FiltersComponent, LoaderComponent, RouterModule, MatDialogModule],
  templateUrl: './empresa-list-page.component.html',
  styleUrl: './empresa-list-page.component.css'
})
export class EmpresaListPage {
  empresas = signal<Empresa[]>([]);
  loading = signal(true);

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
        this.empresas.update(prev => [...prev, ...res.empresas])
      },
      error: err=>{
        this.loading.set(false);
        this.noti.notificateErrorsResponse(err.error);
        
      }
    });
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
