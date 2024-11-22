import { Component } from '@angular/core';
import { LoaderComponent } from '../../../components/loader/loader.component';
import { HeaderComponent } from '../../../components/header/header.component';

@Component({
  selector: 'app-edit-profil-page',
  standalone: true,
  imports: [LoaderComponent, HeaderComponent],
  templateUrl: './edit-profil-page.component.html',
  styleUrl: './edit-profil-page.component.css'
})
export class EditProfilPage {

}
