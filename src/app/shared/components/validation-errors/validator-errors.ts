import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AbstractControl } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'validator-errors',
  imports: [CommonModule, TranslateModule],
  templateUrl: './validator-errors.html',
})
export class ValidatorErrors {
  /** Control del formulario `[control]="frm.get('name')"` */
  @Input() control!: AbstractControl | null;
  /** La nombre del campo preferiblemente traducido (label): `[label]="'forms.name.label' | translate"` */
  @Input() label!: string;
  /** Personalizacion del error `maxlength` */
  @Input() maxlength: string = '';
  /** Personalizacion del error `minlength` */
  @Input() minlength: string = '';
  /** Personalizacion del error `pattern` */
  @Input() pattern: string = '';
  /** Personalizacion del error `required` - `required="forms.name.error1"` */
  @Input() required: string = '';
  /** Personalizacion del error `min` */
  @Input() min: string = '';
  /** Personalizacion del error `max` */
  @Input() max: string = '';
  /** Personalizacion del error `email` */
  @Input() email: string = '';
  /** Personalizacion del error `unique` */
  @Input() unique: string = '';
  /** Se omiten los errores que este en esta lista */
  @Input() omitErrors: string[] = [];
  /** Se pueden agregar errores custom */
  @Input() customErrors: { type: string; message: string }[] = [];
  /** Se agrega un error custom */
  @Input() customErrorType: string = '';
  /** Se agrega el mensaje de un error custom */
  @Input() customErrorMessage: string = '';

  readonly errorsDefault = [
    'required',
    'maxlength',
    'minlength',
    'pattern',
    'email',
    'min',
    'max',
    'unique',
  ];

  get errorKey(): string | null {
    if (!this.control || !this.control.errors) return null;
    if (this.control.untouched) return null;
    // Obtiene el primer error
    return Object.keys(this.control.errors)[0];
  }

  /**
   * Getter de los errores de la validacion
   */
  get errorParams(): {
    control: string;
    value?: unknown;
  } {
    const errors = this.control?.errors;
    if (!errors) return { control: this.label };
    if (this.errorKey === 'min') return { control: this.label, value: errors['min'].min };
    if (this.errorKey === 'max') return { control: this.label, value: errors['max'].max };
    if (this.errorKey === 'maxlength')
      return { control: this.label, value: errors['maxlength'].requiredLength };
    if (this.errorKey === 'minlength')
      return { control: this.label, value: errors['minlength'].requiredLength };
    return { control: this.label };
  }
}
