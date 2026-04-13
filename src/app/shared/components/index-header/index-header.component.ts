import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  input,
  Input,
  Output,
  signal,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-index-header',
  templateUrl: './index-header.component.html',
  styleUrl: './index-header.component.css',
  imports: [ButtonModule],
})
export class IndexHeaderComponent {
  @Output() buttonAction = new EventEmitter<void>();

  title = input<string>('Titulo');
  titleIcon = input<string>('file');
  buttonText = input<string>('Acción');
  buttonIcon = input<string>('plus');
  description = input<string>('');
}
