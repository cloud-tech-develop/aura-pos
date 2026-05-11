import { ChangeDetectionStrategy, Component, EventEmitter, inject, input, OnInit, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectModule } from 'primeng/select';

import { ToastAlertService } from '@services/index';
import { Product } from '@module-catalog/products/interfaces';
import { ProductsService } from '@module-catalog/products/services';
import {
  Composition,
  CreateCompositionRequest,
  CompositionType,
  UpdateCompositionRequest,
} from '../../interfaces';
import { CompositionsService } from '../../services';

@Component({
  selector: 'app-create-composition-modal',
  templateUrl: './create-composition-modal.html',
  styleUrl: './create-composition-modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputNumberModule,
    SelectModule,
    TranslateModule,
  ],
})
export class CreateCompositionModal implements OnInit {
  @Output() reloadTable = new EventEmitter<void>();
  @Output() closeModal = new EventEmitter<void>();

  composition = input<Composition | null>(null);
  isEditing = input<boolean>(false);

  private fb = inject(FormBuilder);
  private toast = inject(ToastAlertService);
  private translate = inject(TranslateService);
  private service = inject(CompositionsService);
  private productsService = inject(ProductsService);

  readonly isSaving = signal(false);
  readonly products = signal<Product[]>([]);

  readonly typeOptions = signal<{ label: string; value: CompositionType }[]>([
    { label: 'KIT', value: 'KIT' },
    { label: 'RECETA', value: 'RECETA' },
  ]);

  readonly compositionForm: FormGroup = this.fb.group({
    parent_product_id: [null, [Validators.required]],
    child_product_id: [null, [Validators.required]],
    quantity: [1, [Validators.required, Validators.min(0.01)]],
    type: ['KIT', [Validators.required]],
  });

  ngOnInit(): void {
    this.loadProducts();

    if (this.composition()) {
      const c = this.composition()!;
      this.compositionForm.patchValue({
        parent_product_id: c.parent_product_id,
        child_product_id: c.child_product_id,
        quantity: c.quantity,
        type: c.type,
      });
    }
  }

  private loadProducts(): void {
    this.productsService.getAll().subscribe({
      next: (res) => {
        if (!res.error && res.data) {
          this.products.set(res.data);
        }
      },
    });
  }

  save(): void {
    this.compositionForm.markAllAsTouched();

    const parentId = this.compositionForm.get('parent_product_id')?.value;
    const childId = this.compositionForm.get('child_product_id')?.value;

    if (parentId && childId && parentId === childId) {
      this.toast.error(this.translate.instant('COMPOSITIONS.SAME_PRODUCT_ERROR'));
      return;
    }

    if (this.compositionForm.invalid) {
      this.toast.error(this.translate.instant('ALERTS.REQUIRED_FIELDS'));
      return;
    }

    this.isSaving.set(true);

    if (this.isEditing() && this.composition()) {
      const payload: UpdateCompositionRequest = {
        quantity: this.compositionForm.get('quantity')?.value,
        type: this.compositionForm.get('type')?.value,
      };

      this.service.update(this.composition()!.id, payload).subscribe({
        next: (res) => {
          this.isSaving.set(false);
          if (!res.error) {
            this.toast.success(this.translate.instant('MESSAGES.UPDATE_SUCCESS'));
            this.reloadTable.emit();
            this.closeModal.emit();
          }
        },
        error: () => this.isSaving.set(false),
      });
    } else {
      const payload: CreateCompositionRequest = {
        parent_product_id: parentId,
        child_product_id: childId,
        quantity: this.compositionForm.get('quantity')?.value,
        type: this.compositionForm.get('type')?.value,
      };

      this.service.create(payload).subscribe({
        next: (res) => {
          this.isSaving.set(false);
          if (!res.error) {
            this.toast.success(this.translate.instant('MESSAGES.SAVE_SUCCESS'));
            this.reloadTable.emit();
            this.closeModal.emit();
          }
        },
        error: () => this.isSaving.set(false),
      });
    }
  }

  cancel(): void {
    this.closeModal.emit();
  }
}
