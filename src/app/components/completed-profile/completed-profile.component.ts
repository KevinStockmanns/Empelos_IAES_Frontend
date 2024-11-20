import { Component, input, OnInit } from '@angular/core';
import {Chart, registerables} from 'chart.js';
import { UsuarioService } from '../../services/usuario-service.service';
import { UsuarioPerfilCompletado } from '../../models/usuario.model';
import { MatIconModule } from '@angular/material/icon';

Chart.register(...registerables);
@Component({
  selector: 'completed-profile',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './completed-profile.component.html',
  styleUrl: './completed-profile.component.css'
})
export class CompletedProfileComponent implements OnInit{
  idUsuario = input.required<number>();
  config:any = {
    type: 'doughnut',
    data: {
      labels: [
      ],
      datasets: [{
        label: 'Perfil',
        data: [75,25],
        backgroundColor: [
          'rgb(22,147 ,190)',
          'transparent',
        ],
        hoverOffset: 4
      }]
    },
  };
  chart:any;
  userData: UsuarioPerfilCompletado|null = null;

  constructor(
    private usuarioService:UsuarioService,
  ){
    
  }


  ngOnInit(): void {
    this.usuarioService.getPerfilCompletado(this.idUsuario()).subscribe({
      next: res=>{
        console.log(res);
        
        this.userData = res;
        this.config.data.datasets[0].data = [res.completo, 100-res.completo];
        this.chart = new Chart("MyChart", this.config);
      },
      error:err=>{
        console.log(err);
        
      }
    });
  }
  
}
