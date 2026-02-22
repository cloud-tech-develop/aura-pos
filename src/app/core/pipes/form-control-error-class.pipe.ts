import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl } from '@angular/forms';

/**
 * Genera la clase de error para un control de formulario
 * @param control Control de formulario
 * @param classError Clase de error a aplicar
 * @returns Clase de error si el control tiene error y está tocado, de lo contrario string vacío
 *
 * @example
 * <input pInputText formControlName="email" [class]="form.get('email') | formControlErrorClass" />
 */
@Pipe({
  name: 'formControlErrorClass',
  standalone: true,
})
export class FormControlErrorClassPipe implements PipeTransform {
  transform(
    control: AbstractControl<unknown, unknown> | null,
    classError: string = 'ng-invalid ng-dirty',
  ): string {
    const existErrorAndTouched = control?.touched && control?.invalid;
    if (existErrorAndTouched) {
      return classError;
    }
    return '';
  }
}
