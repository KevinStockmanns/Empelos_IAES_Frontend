import { Component, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmpresaService } from '../../../services/empresa-service.service';
import { EmpresaDetalle } from '../../../models/empresa.model';
import { NotificationService } from '../../../services/notification.service';
import { LoaderComponent } from '../../../components/loader/loader.component';
import { DatePipe, Location } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { UsuarioService } from '../../../services/usuario-service.service';

@Component({
  selector: 'app-empresa-page',
  imports: [LoaderComponent, MatIconModule],
  templateUrl: './empresa-page.component.html',
  styleUrl: './empresa-page.component.css'
})
export class EmpresaPage {

  empresa: EmpresaDetalle|undefined;
  loading = signal(true);

  constructor(
    private activatedRoute:ActivatedRoute,
    private empresaService: EmpresaService,
    noti:NotificationService,
    private location: Location,
    protected usuarioService: UsuarioService
  ){
    console.log(activatedRoute.snapshot.paramMap.get('id'));
    let id = activatedRoute.snapshot.paramMap.get('id')

    this.empresaService.getEmpresa(id as unknown as number).subscribe({
      next:res=>{
        this.empresa = res;
        this.loading.set(false);
      },
      error:err=>{
        noti.notificateErrorsResponse(err.error);
        this.loading.set(false);
        location.back();
      }
    });
  }




  getDias(dias:string[]){
    return dias.join(' - ')
  }
}
