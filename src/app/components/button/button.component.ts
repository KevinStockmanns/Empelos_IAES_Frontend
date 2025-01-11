import { ChangeDetectionStrategy, Component, computed, input } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
    selector: 'app-button',
    imports: [MatIconModule],
    templateUrl: './button.component.html',
    styleUrl: './button.component.css',

    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ButtonComponent {
  type = input<string>("simple");
  text = input.required<string>();
  icon = input<string>()
  color = input('main');
  fontSize = input('1rem');


  isRed = computed(() => this.color() === 'red');
  isNeutro = computed(() => this.color() === 'neutro');
  isCircle = computed(() => this.type().includes('circle'));
  isSelected = computed(() => this.type().includes('selected'));
}
