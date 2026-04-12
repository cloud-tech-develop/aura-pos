import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-index-tags',
  imports: [CommonModule],
  templateUrl: './index-tags.html',
  styleUrl: './index-tags.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexTags {}