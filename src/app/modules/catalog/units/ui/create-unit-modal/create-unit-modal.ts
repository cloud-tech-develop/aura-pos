import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  inject,
  input,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Unit, UnitRequest } from '@module-catalog/units/interfaces';
import { UnitsService } from '@module-catalog/units/services';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ValidatorErrors } from '@shared/components/validation-errors/validator-errors.component';
import { TranslateModule } from '@ngx-translate/core';
import { getFormErrors } from '@shared/utils';
import { ToastAlertService } from '@services/index';

@Component({
  selector: 'app-create-unit-modal',
  templateUrl: './create-unit-modal.html',
  styleUrl: './create-unit-modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    ToggleSwitchModule,
    TranslateModule,
    ValidatorErrors,
  ],
})
export class CreateUnitModal implements OnInit {
  @Output() reloadTable = new EventEmitter<void>();
  @Output() closeModal = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private service = inject(UnitsService);
  private toast = inject(ToastAlertService);

  isEditing = input<boolean>(false);
  unit = input<Unit | null>(null);
  isSaving = signal<boolean>(false);

  readonly unitForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(200)]],
    abbreviation: ['', [Validators.required, Validators.maxLength(20)]],
    active: [true],
    allow_decimals: [true],
  });

  ngOnInit(): void {
    if (this.unit()) {
      this.unitForm.patchValue({
        name: this.unit()!.name,
        abbreviation: this.unit()!.abbreviation,
        active: this.unit()!.active ?? true,
        allow_decimals: this.unit()!.allow_decimals ?? true,
      });
    }
  }

  saveUnit(): void {
    this.unitForm.markAllAsTouched();
    if (this.unitForm.invalid) {
      const errors = getFormErrors(this.unitForm);
      console.log({ errors });
      return;
    }

    const payload: UnitRequest = {
      name: this.unitForm.get('name')?.value,
      abbreviation: this.unitForm.get('abbreviation')?.value,
      active: this.unitForm.get('active')?.value ?? true,
      allow_decimals: this.unitForm.get('allow_decimals')?.value ?? true,
    };

    if (this.isEditing() && this.unit()) {
      this.service.update(this.unit()!.id, payload).subscribe((r) => {
        this.toast.show(r.error ? 'error' : 'success', r.msg);
        if (!r.error) {
          this.reloadTable.emit();
          this.closeModal.emit();
        }
      });
    } else {
      this.service.create(payload).subscribe((response) => {
        this.toast.show(response.error ? 'error' : 'success', response.msg);
        if (!response.error) {
          this.reloadTable.emit();
          this.closeModal.emit();
        }
      });
    }
  }

  cancel(): void {
    this.unitForm.reset();
    this.closeModal.emit();
  }
}
