import { Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Pipe({
  name: 'safeHtml',
  pure: false,
  standalone: true,
})
export class SafeHtmlPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) {}

  transform(value: string, width: number = 80, height: number = 80, color: string = ''): SafeHtml {
    if (value) {
      // Remover prefijo 'unsafe:' si está presente
      value = value.replace(/^unsafe:/, '');

      // Asegurarse de que el SVG contenga atributos de ancho y alto
      value = value.replace(/<svg /, `<svg width="${width}" height="${height}" `);

      // Aplicar color si se proporciona
      if (color) {
        value = value.replace(/<svg /, `<svg fill="${color}" `);
      }
    }
    return this.sanitizer.bypassSecurityTrustHtml(value);
  }
}
