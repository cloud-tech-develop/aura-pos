import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';
import { Observable, of, map, catchError, switchMap, timer } from 'rxjs';

export function forbiddenValuesValidator(forbiddenValues: string[]): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const isForbidden = forbiddenValues.some(
      (v) => v.toLowerCase() === control.value.toLowerCase()
    );
    return isForbidden ? { forbiddenValue: { value: control.value } } : null;
  };
}

export function skuExistsValidator(
  existsFn: (sku: string) => Observable<boolean>,
  excludeId?: number
): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) return of(null);
    const sku = control.value.toString().trim();
    if (sku.length < 3) return of(null);

    return timer(300).pipe(
      switchMap(() => existsFn(sku)),
      map((exists) => (exists && excludeId ? { skuExists: true } : exists ? { skuExists: true } : null)),
      catchError(() => of(null))
    );
  };
}

export function passwordStrengthValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;
    const hasUpperCase = /[A-Z]/.test(control.value);
    const hasLowerCase = /[a-z]/.test(control.value);
    const hasNumber = /[0-9]/.test(control.value);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(control.value);
    const valid = hasUpperCase && hasLowerCase && hasNumber && hasSpecialChar;
    return valid ? null : { passwordStrength: true };
  };
}

export function matchFieldsValidator(fieldName: string): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const parent = control.parent;
    if (!parent) return null;
    const matchingControl = parent.get(fieldName);
    if (!matchingControl) return null;
    if (control.value !== matchingControl.value) {
      return { mismatch: true };
    }
    return null;
  };
}
