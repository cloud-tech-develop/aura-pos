import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-index-compositions',
  imports: [CommonModule],
  templateUrl: './index-compositions.html',
  styleUrl: './index-compositions.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexCompositions {}