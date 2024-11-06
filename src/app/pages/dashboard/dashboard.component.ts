import { Component, Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { HeaderComponent } from '../../components/header/header.component';
import {MatIconModule} from '@angular/material/icon';
import AOS from 'aos';
import { isPlatformBrowser } from '@angular/common';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [HeaderComponent, MatIconModule, RouterModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {

  constructor(
    @Inject(PLATFORM_ID) private plataformId:Object
  ){

  }

  ngOnInit(): void {
    if (isPlatformBrowser(this.plataformId)){
      AOS.init();
    }
  }
}
