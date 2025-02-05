import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { EmpresaService } from '../../../services/empresa-service.service';
import { EmpresaDetalle } from '../../../models/empresa.model';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-empresa-page',
  imports: [],
  templateUrl: './empresa-page.component.html',
  styleUrl: './empresa-page.component.css'
})
export class EmpresaPage {

  empresa: EmpresaDetalle|undefined;

  constructor(
    private activatedRoute:ActivatedRoute,
    private empresaService: EmpresaService,
    noti:NotificationService
  ){
    console.log(activatedRoute.snapshot.paramMap.get('id'));
    let id = activatedRoute.snapshot.paramMap.get('id')

    this.empresaService.getEmpresa(id as unknown as number).subscribe({
      next:res=>{
        this.empresa = res;
      },
      error:err=>{
        noti.notificateErrorsResponse(err.error);
      }
    });
  }
}
