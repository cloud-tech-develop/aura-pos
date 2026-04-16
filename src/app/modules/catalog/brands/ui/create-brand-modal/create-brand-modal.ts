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
import { Brand, BrandRequest } from '@module-catalog/brands/interfaces';
import { BrandsService } from '@module-catalog/brands/services';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ValidatorErrors } from '@shared/components/validation-errors/validator-errors.component';
import { TranslateModule } from '@ngx-translate/core';
import { getFormErrors } from '@shared/utils';
import { ToastAlertService } from '@services/index';

@Component({
  selector: 'app-create-brand-modal',
  templateUrl: './create-brand-modal.html',
  styleUrl: './create-brand-modal.css',
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
export class CreateBrandModal implements OnInit {
  @Output() reloadTable = new EventEmitter<void>();
  @Output() closeModal = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private service = inject(BrandsService);
  private toast = inject(ToastAlertService);

  isEditing = input<boolean>(false);
  brand = input<Brand | null>(null);
  isSaving = signal<boolean>(false);

  readonly brandForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(200)]],
    active: [true],
  });

  ngOnInit(): void {
    if (this.brand()) {
      this.brandForm.patchValue({
        name: this.brand()!.name,
        active: this.brand()!.active ?? true,
      });
    }
  }

  saveBrand(): void {
    this.brandForm.markAllAsTouched();
    if (this.brandForm.invalid) {
      const errors = getFormErrors(this.brandForm);
      console.log({ errors });
      return;
    }

    const payload: BrandRequest = {
      name: this.brandForm.get('name')?.value,
      active: this.brandForm.get('active')?.value ?? true,
    };

    if (this.isEditing() && this.brand()) {
      this.service.update(this.brand()!.id, payload).subscribe((r) => {
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
    this.closeModal.emit();
  }
}
