import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-index-brands',
  imports: [CommonModule],
  templateUrl: './index-brands.html',
  styleUrl: './index-brands.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexBrands {}