import { Component, signal } from '@angular/core';
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

@Component({
  selector: 'app-crud',
  imports: [ButtonComponent, RouterModule, LoaderComponent, MatIconModule, MatTooltipModule],
  templateUrl: './pasantia.component.html',
  styleUrl: './pasantia.component.css'
})
export class PasantiaPage {

  pasantiasPendientes = signal<PasantiaListado[]>([]);
  pasantiasActuales = signal<PasantiaListado[]>([]);
  pasantiasFinalizadas = signal<PasantiaListado[]>([]);
  pasantiasSolicitadas = signal<PasantiaListado[]>([]);
  loading = signal(true);

  private orderRow  =false;


  constructor(
    private pasantiaService: PasantiaService,
    private utils:UtilsService,
    private noti:NotificationService,
    protected usuarioService:UsuarioService,
  ){
    this.loadPasantias();
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
        this.pasantiasActuales.set(actuales.content);
        this.pasantiasFinalizadas.set(finalizadas.content);
        this.pasantiasSolicitadas.set(solicitadas.content);
        this.loading.set(false);  // Desactivar el loader
      },
      error: (err) => {
        // Si alguna de las peticiones falla, se muestra el error.
        this.noti.notificateErrorsResponse(err.error);
        this.loading.set(false);  // Desactivar el loader incluso si falla
      }
    });
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
}
