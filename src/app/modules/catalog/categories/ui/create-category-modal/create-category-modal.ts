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
import { Category, CategoryRequest } from '@module-catalog/categories/interfaces';
import { CategoriesService } from '@module-catalog/categories/services';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TextareaModule } from 'primeng/textarea';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ValidatorErrors } from '@shared/components/validation-errors/validator-errors.component';
import { TranslateModule } from '@ngx-translate/core';
import { getFormErrors } from '@shared/utils';
import { ToastAlertService } from '@services/index';
import { ListId } from '@core/interfaces';

@Component({
  selector: 'app-create-category-modal',
  templateUrl: './create-category-modal.html',
  styleUrl: './create-category-modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    TextareaModule,
    InputTextModule,
    InputNumberModule,
    ToggleSwitchModule,
    TranslateModule,
    ValidatorErrors,
    SelectModule,
  ],
})
export class CreateCategoryModal implements OnInit {
  @Output() reloadTable = new EventEmitter<void>();
  @Output() closeModal = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private service = inject(CategoriesService);
  private toast = inject(ToastAlertService);
  categoryList = signal<ListId[]>([]);

  isEditing = input<boolean>(false);
  category = input<Category | null>(null);
  isSaving = signal<boolean>(false);

  readonly categoryForm: FormGroup = this.fb.group({
    name: ['', [Validators.required, Validators.maxLength(200)]],
    default_tax_rate: [0, [Validators.min(0), Validators.max(100)]],
    active: [true],
    description: ['', [Validators.maxLength(500)]],
    parent_id: [null],
  });

  ngOnInit(): void {
    if (this.category()) {
      this.categoryForm.patchValue({
        name: this.category()!.name,
        default_tax_rate: this.category()!.default_tax_rate ?? 0,
        active: this.category()!.active ?? true,
        description: this.category()!.description || '',
        parent_id: this.category()!.parent_id || null,
      });
    }
    this.service.list().subscribe((r) => {
      this.categoryList.set(r.data || []);
    });
  }

  saveCategory(): void {
    this.categoryForm.markAllAsTouched();
    if (this.categoryForm.invalid) {
      const errors = getFormErrors(this.categoryForm);
      console.log({ errors });
      return;
    }

    const payload: CategoryRequest = {
      name: this.categoryForm.get('name')?.value,
      default_tax_rate: this.categoryForm.get('default_tax_rate')?.value || 0,
      active: this.categoryForm.get('active')?.value ?? true,
      description: this.categoryForm.get('description')?.value || undefined,
      parent_id: this.categoryForm.get('parent_id')?.value || undefined,
    };

    if (this.isEditing() && this.category()) {
      this.service.update(this.category()!.id, payload).subscribe((r) => {
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
