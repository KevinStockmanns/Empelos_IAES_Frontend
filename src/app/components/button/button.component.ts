import { Component, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-button',
    imports: [MatIconModule],
    templateUrl: './button.component.html',
    styleUrl: './button.component.css'
})
export class ButtonComponent {
  type = input<string>("simple");
  text = input.required<string>();
  icon = input<string>()
  color = input('main');
  fontSize = input('1rem');
}
