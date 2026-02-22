import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  AbstractControl,
  FormControl,
  ReactiveFormsModule,
  ValidationErrors,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { ValidatorErrors } from './validator-errors.component';

describe('ValidatorErrors', () => {
  let component: ValidatorErrors;
  let fixture: ComponentFixture<ValidatorErrors>;

  const createMockControl = (
    errors: ValidationErrors | null,
    touched: boolean = false,
  ): AbstractControl => {
    const control = new FormControl('', { validators: [] });
    if (errors) {
      control.setErrors(errors);
    }
    if (touched) {
      control.markAsTouched();
    } else {
      control.markAsUntouched();
    }
    return control;
  };

  // Helper to set input using componentRef.setInput (Angular 16+)
  const setInput = (
    fixture: ComponentFixture<ValidatorErrors>,
    name: string,
    value: unknown,
  ): void => {
    (fixture.componentRef as unknown as { setInput(name: string, value: unknown): void }).setInput(
      name,
      value,
    );
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidatorErrors, ReactiveFormsModule, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(ValidatorErrors);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Error required', () => {
    it('should show error when control is touched and has required error', () => {
      const control = createMockControl({ required: true }, true);
      setInput(fixture, 'control', control);
      setInput(fixture, 'label', 'Nombre');
      fixture.detectChanges();

      expect(component.errorKey()).toBe('required');
      expect(component.shouldShowError()).toBe(true);
      expect(component.errorMessage()).toBe('ALERTS.REQUIRED');
      expect(component.errorParams()).toEqual({ control: 'Nombre' });

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('span.text-red-500')).toBeTruthy();
    });

    it('should not show error when control is not touched', () => {
      const control = createMockControl({ required: true }, false);
      setInput(fixture, 'control', control);
      fixture.detectChanges();

      expect(component.errorKey()).toBeNull();
      expect(component.shouldShowError()).toBe(false);
    });

    it('should use custom required message when provided', () => {
      const control = createMockControl({ required: true }, true);
      setInput(fixture, 'control', control);
      setInput(fixture, 'required', 'El campo nombre es obligatorio');
      fixture.detectChanges();

      expect(component.errorMessage()).toBe('El campo nombre es obligatorio');
    });
  });

  describe('Error maxlength', () => {
    it('should show error when text exceeds maxlength', () => {
      const control = createMockControl(
        { maxlength: { requiredLength: 10, actualLength: 15 } },
        true,
      );
      setInput(fixture, 'control', control);
      setInput(fixture, 'label', 'Username');
      fixture.detectChanges();

      expect(component.errorKey()).toBe('maxlength');
      expect(component.shouldShowError()).toBe(true);
      expect(component.errorMessage()).toBe('ALERTS.MAJOR');
      expect(component.errorParams()).toEqual({ control: 'Username', value: 10 });

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('span.text-red-500')).toBeTruthy();
    });

    it('should use custom maxlength message when provided', () => {
      const control = createMockControl(
        { maxlength: { requiredLength: 10, actualLength: 15 } },
        true,
      );
      setInput(fixture, 'control', control);
      setInput(fixture, 'maxlength', 'Máximo 10 caracteres permitidos');
      fixture.detectChanges();

      expect(component.errorMessage()).toBe('Máximo 10 caracteres permitidos');
    });
  });

  describe('Error minlength', () => {
    it('should show error when text is shorter than minlength', () => {
      const control = createMockControl(
        { minlength: { requiredLength: 5, actualLength: 3 } },
        true,
      );
      setInput(fixture, 'control', control);
      setInput(fixture, 'label', 'Password');
      fixture.detectChanges();

      expect(component.errorKey()).toBe('minlength');
      expect(component.shouldShowError()).toBe(true);
      expect(component.errorMessage()).toBe('ALERTS.MINOR');
      expect(component.errorParams()).toEqual({ control: 'Password', value: 5 });

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('span.text-red-500')).toBeTruthy();
    });

    it('should use custom minlength message when provided', () => {
      const control = createMockControl(
        { minlength: { requiredLength: 5, actualLength: 3 } },
        true,
      );
      setInput(fixture, 'control', control);
      setInput(fixture, 'minlength', 'Mínimo 5 caracteres requeridos');
      fixture.detectChanges();

      expect(component.errorMessage()).toBe('Mínimo 5 caracteres requeridos');
    });
  });

  describe('Error email', () => {
    it('should show error when email is invalid', () => {
      const control = createMockControl({ email: true }, true);
      setInput(fixture, 'control', control);
      setInput(fixture, 'label', 'Email');
      fixture.detectChanges();

      expect(component.errorKey()).toBe('email');
      expect(component.shouldShowError()).toBe(true);
      expect(component.errorMessage()).toBe('ALERTS.INVALID_EMAIL');
      expect(component.errorParams()).toEqual({ control: 'Email' });

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('span.text-red-500')).toBeTruthy();
    });

    it('should use custom email message when provided', () => {
      const control = createMockControl({ email: true }, true);
      setInput(fixture, 'control', control);
      setInput(fixture, 'email', 'Ingrese un correo electrónico válido');
      fixture.detectChanges();

      expect(component.errorMessage()).toBe('Ingrese un correo electrónico válido');
    });
  });

  describe('Error pattern', () => {
    it('should show error when pattern does not match', () => {
      const control = createMockControl({ pattern: true }, true);
      setInput(fixture, 'control', control);
      setInput(fixture, 'label', 'Código');
      fixture.detectChanges();

      expect(component.errorKey()).toBe('pattern');
      expect(component.shouldShowError()).toBe(true);
      expect(component.errorMessage()).toBe('ALERTS.PATTERN');
      expect(component.errorParams()).toEqual({ control: 'Código' });

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('span.text-red-500')).toBeTruthy();
    });

    it('should use custom pattern message when provided', () => {
      const control = createMockControl({ pattern: true }, true);
      setInput(fixture, 'control', control);
      setInput(fixture, 'pattern', 'El formato del código es inválido');
      fixture.detectChanges();

      expect(component.errorMessage()).toBe('El formato del código es inválido');
    });
  });

  describe('Error min', () => {
    it('should show error when value is less than min', () => {
      const control = createMockControl({ min: { min: 10, actual: 5 } }, true);
      setInput(fixture, 'control', control);
      setInput(fixture, 'label', 'Edad');
      fixture.detectChanges();

      expect(component.errorKey()).toBe('min');
      expect(component.shouldShowError()).toBe(true);
      expect(component.errorMessage()).toBe('ALERTS.MIN_VALUE');
      expect(component.errorParams()).toEqual({ control: 'Edad', value: 10 });

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('span.text-red-500')).toBeTruthy();
    });

    it('should use custom min message when provided', () => {
      const control = createMockControl({ min: { min: 10, actual: 5 } }, true);
      setInput(fixture, 'control', control);
      setInput(fixture, 'min', 'El valor mínimo es 10');
      fixture.detectChanges();

      expect(component.errorMessage()).toBe('El valor mínimo es 10');
    });
  });

  describe('Error max', () => {
    it('should show error when value exceeds max', () => {
      const control = createMockControl({ max: { max: 100, actual: 150 } }, true);
      setInput(fixture, 'control', control);
      setInput(fixture, 'label', 'Cantidad');
      fixture.detectChanges();

      expect(component.errorKey()).toBe('max');
      expect(component.shouldShowError()).toBe(true);
      expect(component.errorMessage()).toBe('ALERTS.MAX_VALUE');
      expect(component.errorParams()).toEqual({ control: 'Cantidad', value: 100 });

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('span.text-red-500')).toBeTruthy();
    });

    it('should use custom max message when provided', () => {
      const control = createMockControl({ max: { max: 100, actual: 150 } }, true);
      setInput(fixture, 'control', control);
      setInput(fixture, 'max', 'El valor máximo es 100');
      fixture.detectChanges();

      expect(component.errorMessage()).toBe('El valor máximo es 100');
    });
  });

  describe('Error unique', () => {
    it('should show error for unique validation', () => {
      const control = createMockControl({ unique: true }, true);
      setInput(fixture, 'control', control);
      setInput(fixture, 'label', 'Usuario');
      fixture.detectChanges();

      expect(component.errorKey()).toBe('unique');
      expect(component.shouldShowError()).toBe(true);
      expect(component.errorMessage()).toBe('ALERTS.UNIQUE');
      expect(component.errorParams()).toEqual({ control: 'Usuario' });

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('span.text-red-500')).toBeTruthy();
    });

    it('should use custom unique message when provided', () => {
      const control = createMockControl({ unique: true }, true);
      setInput(fixture, 'control', control);
      setInput(fixture, 'unique', 'Este valor ya existe');
      fixture.detectChanges();

      expect(component.errorMessage()).toBe('Este valor ya existe');
    });
  });

  describe('Custom errors', () => {
    it('should show custom error from customErrors array', () => {
      const customErrors = [{ type: 'customError', message: 'Error personalizado' }];
      const control = createMockControl({ customError: true }, true);
      setInput(fixture, 'control', control);
      setInput(fixture, 'customErrors', customErrors);
      fixture.detectChanges();

      expect(component.errorKey()).toBe('customError');
      expect(component.isCustomError()).toBe(true);
      expect(component.shouldShowError()).toBe(true);
      expect(component.getCustomErrorMessage('customError')).toBe('Error personalizado');
    });

    it('should show custom error using customErrorType and customErrorMessage', () => {
      const control = createMockControl({ myError: true }, true);
      setInput(fixture, 'control', control);
      setInput(fixture, 'customErrorType', 'myError');
      setInput(fixture, 'customErrorMessage', 'Mi mensaje de error personalizado');
      fixture.detectChanges();

      expect(component.errorKey()).toBe('myError');
      expect(component.isCustomError()).toBe(true);
      expect(component.shouldShowError()).toBe(true);
      expect(component.singleCustomErrorMessage()).toBe('Mi mensaje de error personalizado');
    });

    it('should return empty string for unknown custom error type', () => {
      const customErrors: { type: string; message: string }[] = [];
      setInput(fixture, 'customErrors', customErrors);

      expect(component.getCustomErrorMessage('unknownError')).toBe('');
    });

    it('should use default error message when custom error not found', () => {
      const control = createMockControl({ unknownError: true }, true);
      setInput(fixture, 'control', control);
      setInput(fixture, 'customErrors', []);
      fixture.detectChanges();

      expect(component.isCustomError()).toBe(true);
      expect(component.errorMessage()).toBe('');
    });
  });

  describe('omitErrors', () => {
    it('should not show error when key is in omitErrors list', () => {
      const control = createMockControl({ required: true }, true);
      setInput(fixture, 'control', control);
      setInput(fixture, 'omitErrors', ['required']);
      fixture.detectChanges();

      expect(component.errorKey()).toBe('required');
      expect(component.shouldShowError()).toBe(false);

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('span.text-red-500')).toBeFalsy();
    });

    it('should show error when key is not in omitErrors list', () => {
      const control = createMockControl({ required: true }, true);
      setInput(fixture, 'control', control);
      setInput(fixture, 'omitErrors', ['maxlength', 'minlength']);
      fixture.detectChanges();

      expect(component.shouldShowError()).toBe(true);
    });

    it('should allow multiple errors to be omitted', () => {
      const control = createMockControl({ required: true }, true);
      setInput(fixture, 'control', control);
      setInput(fixture, 'omitErrors', ['required', 'email', 'pattern']);
      fixture.detectChanges();

      expect(component.shouldShowError()).toBe(false);
    });
  });

  describe('No error when untouched', () => {
    it('should not show error when control is untouched', () => {
      const control = createMockControl({ required: true }, false);
      setInput(fixture, 'control', control);
      fixture.detectChanges();

      expect(component.errorKey()).toBeNull();
      expect(component.shouldShowError()).toBe(false);

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('span.text-red-500')).toBeFalsy();
    });

    it('should not show any error when control has no errors', () => {
      const control = createMockControl(null, true);
      setInput(fixture, 'control', control);
      fixture.detectChanges();

      expect(component.errorKey()).toBeNull();
      expect(component.shouldShowError()).toBe(false);
    });

    it('should not show any error when control is null', () => {
      setInput(fixture, 'control', null);
      fixture.detectChanges();

      expect(component.errorKey()).toBeNull();
      expect(component.shouldShowError()).toBe(false);
      expect(component.errorMessage()).toBe('');
    });
  });

  describe('Error priority (first error)', () => {
    it('should show first error key when multiple errors exist', () => {
      const control = createMockControl({ required: true, maxlength: true, email: true }, true);
      setInput(fixture, 'control', control);
      fixture.detectChanges();

      // The first error key should be returned
      const errorKey = component.errorKey();
      expect(errorKey).not.toBeNull();
      expect(['required', 'maxlength', 'email']).toContain(errorKey!);
    });
  });

  describe('Signal reactivity', () => {
    it('should update errorKey when control errors change', () => {
      // First set control with no errors
      const controlWithoutErrors = createMockControl(null, true);
      setInput(fixture, 'control', controlWithoutErrors);
      fixture.detectChanges();
      expect(component.errorKey()).toBeNull();

      // Now update the control reference with errors
      const controlWithErrors = createMockControl({ required: true }, true);
      setInput(fixture, 'control', controlWithErrors);
      fixture.detectChanges();

      expect(component.errorKey()).toBe('required');
    });

    it('should update shouldShowError when omitErrors changes', () => {
      const control = createMockControl({ required: true }, true);
      setInput(fixture, 'control', control);
      fixture.detectChanges();

      expect(component.shouldShowError()).toBe(true);

      setInput(fixture, 'omitErrors', ['required']);
      fixture.detectChanges();

      expect(component.shouldShowError()).toBe(false);
    });

    it('should update errorParams when label changes', () => {
      const control = createMockControl({ required: true }, true);
      setInput(fixture, 'control', control);
      setInput(fixture, 'label', 'Nombre');
      fixture.detectChanges();

      expect(component.errorParams()).toEqual({ control: 'Nombre' });

      setInput(fixture, 'label', 'Apellido');
      fixture.detectChanges();

      expect(component.errorParams()).toEqual({ control: 'Apellido' });
    });
  });

  describe('Template rendering', () => {
    it('should not render span when shouldShowError is false', () => {
      const control = createMockControl({ required: true }, false);
      setInput(fixture, 'control', control);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      expect(compiled.querySelector('span.text-red-500')).toBeFalsy();
    });

    it('should render span with correct class when shouldShowError is true', () => {
      const control = createMockControl({ required: true }, true);
      setInput(fixture, 'control', control);
      fixture.detectChanges();

      const compiled = fixture.nativeElement as HTMLElement;
      const span = compiled.querySelector('span.text-red-500');
      expect(span).toBeTruthy();
    });

    it('should use customErrorMessage for custom errors when provided', () => {
      const control = createMockControl({ customError: true }, true);
      setInput(fixture, 'control', control);
      setInput(fixture, 'customErrorType', 'customError');
      setInput(fixture, 'customErrorMessage', 'Mensaje custom');
      setInput(fixture, 'customErrors', [{ type: 'customError', message: 'Del array' }]);
      fixture.detectChanges();

      // customErrorMessage takes precedence when key matches customErrorType
      expect(component.singleCustomErrorMessage()).toBe('Mensaje custom');
    });
  });

  describe('Edge cases', () => {
    it('should handle control with empty errors object', () => {
      const control = new FormControl('');
      control.markAsTouched();
      // Control with empty errors object (after validation runs but passes)
      Object.defineProperty(control, 'errors', { value: null, writable: true });
      setInput(fixture, 'control', control);
      fixture.detectChanges();

      expect(component.errorKey()).toBeNull();
    });

    it('should handle label with empty string', () => {
      const control = createMockControl({ required: true }, true);
      setInput(fixture, 'control', control);
      setInput(fixture, 'label', '');
      fixture.detectChanges();

      expect(component.errorParams()).toEqual({ control: '' });
    });

    it('should prioritize specific custom message over array message', () => {
      const control = createMockControl({ myCustomError: true }, true);
      setInput(fixture, 'control', control);
      setInput(fixture, 'customErrorType', 'myCustomError');
      setInput(fixture, 'customErrorMessage', 'Mensaje específico');
      setInput(fixture, 'customErrors', [{ type: 'myCustomError', message: 'Mensaje del array' }]);
      fixture.detectChanges();

      // When customErrorType matches the error key, use singleCustomErrorMessage
      expect(component.singleCustomErrorMessage()).toBe('Mensaje específico');
    });
  });
});
