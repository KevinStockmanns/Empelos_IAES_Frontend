import { Component, input } from '@angular/core';

@Component({
  selector: 'app-adicional-info',
  imports: [],
  templateUrl: './adicional-info.component.html',
  styleUrl: './adicional-info.component.css'
})
export class AdicionalInfoComponent {
  title = input<string>();
}
