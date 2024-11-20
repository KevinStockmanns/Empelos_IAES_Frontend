import { Component, OnInit } from '@angular/core';
import {Chart, registerables} from 'chart.js';

Chart.register(...registerables);
@Component({
  selector: 'app-completed-profile',
  standalone: true,
  imports: [],
  templateUrl: './completed-profile.component.html',
  styleUrl: './completed-profile.component.css'
})
export class CompletedProfileComponent implements OnInit{
  config:any = {
    type: 'doughnut',
    data: {
      labels: [
      ],
      datasets: [{
        label: 'Perfil',
        data: [75,25],
        backgroundColor: [
          'rgb(255, 99, 132)',
          'transparent',
        ],
        hoverOffset: 4
      }]
    },
  };
  chart:any;

  ngOnInit(): void {
      this.chart = new Chart("MyChart", this.config);
  }
}
