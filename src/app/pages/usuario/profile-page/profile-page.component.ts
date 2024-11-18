import { Component, signal } from '@angular/core';
import { LoaderComponent } from '../../../components/loader/loader.component';
import { HeaderComponent } from '../../../components/header/header.component';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [HeaderComponent, LoaderComponent],
  templateUrl: './profile-page.component.html',
  styleUrl: './profile-page.component.css'
})
export class ProfilePageComponent {
  loading = signal(true);
}
