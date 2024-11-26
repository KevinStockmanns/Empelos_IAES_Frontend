import { Component, Inject, Injectable, input, OnInit, PLATFORM_ID } from '@angular/core';
import {Chart, registerables} from 'chart.js';
import { UsuarioService } from '../../services/usuario-service.service';
import { UsuarioPerfilCompletado } from '../../models/usuario.model';
import { MatIconModule } from '@angular/material/icon';
import { DecimalPipe, isPlatformBrowser } from '@angular/common';
import { LoaderComponent } from '../loader/loader.component';

Chart.register(...registerables);
@Component({
    selector: 'completed-profile',
    imports: [MatIconModule, DecimalPipe, LoaderComponent],
    templateUrl: './completed-profile.component.html',
    styleUrl: './completed-profile.component.css'
})
export class CompletedProfileComponent implements OnInit{
  idUsuario = input.required<number>();
  loading = true;
  config:any = {
    type: 'doughnut',
    data: {
      labels: [
      ],
      datasets: [{
        label: 'Perfil',
        data: [50,50],
        backgroundColor: [
          'rgb(22,147 ,190)',
          'var(--errorColor)',
        ],
        hoverOffset: 4
      }]
    },
  };
  chart:any;
  userData: UsuarioPerfilCompletado|null = null;

  constructor(
    private usuarioService:UsuarioService,
    @Inject(PLATFORM_ID) private plataform: Object
  ){
    
  }


  ngOnInit(): void {
    let mainColor = 'blue';
    let errorColor = 'red'
    if(isPlatformBrowser(this.plataform)){
      mainColor = getComputedStyle(document.documentElement).getPropertyValue('--mainColor').trim();
      errorColor = getComputedStyle(document.documentElement).getPropertyValue('--errorColor').trim();
    }

    this.config = {
      type: 'doughnut',
      data: {
        labels: [],
        datasets: [{
          label: 'Perfil',
          data: [50,50],
          backgroundColor: [
            mainColor,
            errorColor,
          ],
          hoverOffset: 4
        }]
      },
    };

    this.usuarioService.getPerfilCompletado(this.idUsuario()).subscribe({
      next: res=>{
        console.log(res);
        this.loading = false;
        this.userData = res;
        setTimeout(() => {
          const canvas = document.getElementById('MyChart') as HTMLCanvasElement;
          if (canvas) {
            this.config.data.datasets[0].data = [res.completo, 100-res.completo]; 
            this.chart = new Chart(canvas, this.config);
          }
        });
        // this.config.data.datasets[0].data = [res.completo, 100-res.completo];
        // this.chart = new Chart("MyChart", this.config);
      },
      error:err=>{
        console.log(err);
        this.loading = false;
      }
    });
  }
  
}
