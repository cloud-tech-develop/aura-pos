import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'truncate',
  standalone: true,
})
export class TruncatePipe implements PipeTransform {
  transform(value: string | null | undefined, length: number = 50): string {
    if (!value) return '';
    if (value.length <= length) return value;
    return value.substring(0, length) + '...';
  }
}
