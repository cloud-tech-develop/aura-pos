import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-index-presentations',
  imports: [CommonModule],
  templateUrl: './index-presentations.html',
  styleUrl: './index-presentations.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexPresentations {}