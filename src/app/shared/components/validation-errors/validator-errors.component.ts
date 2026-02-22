import { Component, input, computed, ChangeDetectionStrategy } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

interface CustomError {
  type: string;
  message: string;
}

interface ErrorParams {
  control: string;
  value?: unknown;
}

/**
 * Componente para mostrar errores de validación
 *
 * @example Ejemplo Basico
 * ```html
 * <validator-errors
 *   [control]="frm.get('name')"
 *   [label]="'forms.name.label' | translate"
 * />
 * ```
 *
 * @example Ejemplo Completo
 * ```html
 * <validator-errors
 *   [control]="frm.get('name')"
 *   [label]="'forms.name.label' | translate"
 *   [required]="'forms.name.error1' | translate"
 *   [maxlength]="'forms.name.error2' | translate"
 *   [minlength]="'forms.name.error3' | translate"
 *   [pattern]="'forms.name.error4' | translate"
 *   [email]="'forms.name.error5' | translate"
 *   [min]="'forms.name.error6' | translate"
 *   [max]="'forms.name.error7' | translate"
 *   [unique]="'forms.name.error8' | translate"
 *   [omitErrors]="['required']"
 *   [customErrors]="[{ type: 'custom', message: 'forms.name.error9' }]"
 *   [customErrorType]="'custom'"
 *   [customErrorMessage]="'forms.name.error10'"
 * />
 * ```
 */
@Component({
  selector: 'validator-errors',
  imports: [TranslateModule],
  templateUrl: './validator-errors.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ValidatorErrors {
  /** Control del formulario `[control]="frm.get('name')"` */
  readonly control = input<AbstractControl | null>(null);
  /** La nombre del campo preferiblemente traducido (label): `[label]="'forms.name.label' | translate"` */
  readonly label = input<string>('');
  /** Personalizacion del error `maxlength` */
  readonly maxlength = input<string>('');
  /** Personalizacion del error `minlength` */
  readonly minlength = input<string>('');
  /** Personalizacion del error `pattern` */
  readonly pattern = input<string>('');
  /** Personalizacion del error `required` - `required="forms.name.error1"` */
  readonly required = input<string>('');
  /** Personalizacion del error `min` */
  readonly min = input<string>('');
  /** Personalizacion del error `max` */
  readonly max = input<string>('');
  /** Personalizacion del error `email` */
  readonly email = input<string>('');
  /** Personalizacion del error `unique` */
  readonly unique = input<string>('');
  /** Se omiten los errores que este en esta lista */
  readonly omitErrors = input<string[]>([]);
  /** Se pueden agregar errores custom */
  readonly customErrors = input<CustomError[]>([]);
  /** Se agrega un error custom */
  readonly customErrorType = input<string>('');
  /** Se agrega el mensaje de un error custom */
  readonly customErrorMessage = input<string>('');

  readonly errorsDefault = [
    'required',
    'maxlength',
    'minlength',
    'pattern',
    'email',
    'min',
    'max',
    'unique',
  ] as const;

  /**
   * Signal reactivo que obtiene la clave del primer error de validación
   */
  readonly errorKey = computed<string | null>(() => {
    const control = this.control();
    if (!control || !control.errors) return null;
    if (control.untouched) return null;
    return Object.keys(control.errors)[0];
  });

  /**
   * Signal reactivo que indica si es un error personalizado
   */
  readonly isCustomError = computed<boolean>(() => {
    const key = this.errorKey();
    return key ? !this.errorsDefault.includes(key as (typeof this.errorsDefault)[number]) : false;
  });

  /**
   * Signal reactivo que verifica si el error actual debe mostrarse
   */
  readonly shouldShowError = computed<boolean>(() => {
    const key = this.errorKey();
    const omitted = this.omitErrors();
    return key !== null && !omitted.includes(key);
  });

  /**
   * Signal reactivo que genera los parámetros de traducción
   */
  readonly errorParams = computed<ErrorParams>(() => {
    const ctrl = this.control();
    const lbl = this.label();
    const key = this.errorKey();

    if (!ctrl) return { control: lbl };
    if (!key) return { control: lbl };

    const errors = ctrl.errors;
    if (!errors) return { control: lbl };

    if (key === 'min') return { control: lbl, value: errors['min'].min };
    if (key === 'max') return { control: lbl, value: errors['max'].max };
    if (key === 'maxlength') return { control: lbl, value: errors['maxlength'].requiredLength };
    if (key === 'minlength') return { control: lbl, value: errors['minlength'].requiredLength };

    return { control: lbl };
  });

  /**
   * Obtiene el mensaje de error según el tipo de validación
   */
  readonly errorMessage = computed<string>(() => {
    const key = this.errorKey();
    if (!key) return '';

    const params = this.errorParams();

    switch (key) {
      case 'required':
        return this.required() || 'ALERTS.REQUIRED';
      case 'maxlength':
        return this.maxlength() || 'ALERTS.MAJOR';
      case 'minlength':
        return this.minlength() || 'ALERTS.MINOR';
      case 'pattern':
        return this.pattern() || 'ALERTS.PATTERN';
      case 'email':
        return this.email() || 'ALERTS.INVALID_EMAIL';
      case 'min':
        return this.min() || 'ALERTS.MIN_VALUE';
      case 'max':
        return this.max() || 'ALERTS.MAX_VALUE';
      case 'unique':
        return this.unique() || 'ALERTS.UNIQUE';
      default:
        // Custom error - buscar en customErrors
        const customErr = this.customErrors().find((e) => e.type === key);
        return customErr?.message || '';
    }
  });

  /**
   * Signal para el error personalizado individual
   */
  readonly singleCustomErrorMessage = computed<string>(() => {
    const key = this.errorKey();
    const customType = this.customErrorType();
    if (key === customType) {
      return this.customErrorMessage();
    }
    return '';
  });

  /**
   * Obtiene el mensaje de un error custom por su tipo
   */
  getCustomErrorMessage(type: string): string {
    const customErr = this.customErrors().find((e) => e.type === type);
    return customErr?.message || '';
  }
}
