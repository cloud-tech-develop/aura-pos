import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-index-units',
  imports: [CommonModule],
  templateUrl: './index-units.html',
  styleUrl: './index-units.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexUnits {}