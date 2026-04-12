import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-index-categories',
  imports: [CommonModule],
  templateUrl: './index-categories.html',
  styleUrl: './index-categories.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexCategories {}