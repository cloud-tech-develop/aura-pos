import { Pipe, PipeTransform } from '@angular/core';
import { AbstractControl } from '@angular/forms';

/**
 * Genera la clase de error para un control de formulario
 * @param control Control de formulario
 * @param classError Clase de error a aplicar
 * @returns Clase de error si el control tiene error y está tocado, de lo contrario string vacío
 *
 * @example
 * <input pInputText formControlName="email" [invalid]="form.get('email') | controlHasInvalid" />
 */
@Pipe({
  name: 'controlHasInvalid',
  pure: false,
  standalone: true,
})
export class ControlHasInvalidPipe implements PipeTransform {
  transform(control: AbstractControl<unknown, unknown> | null): boolean {
    const existErrorAndTouched = control?.touched && control?.invalid;
    return existErrorAndTouched ?? false;
  }
}
