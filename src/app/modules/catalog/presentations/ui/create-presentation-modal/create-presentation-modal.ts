import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, input, OnInit, Output, signal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

import { ToastAlertService } from '@services/index';
import { Product } from '@module-catalog/products/interfaces';
import { ProductsService } from '@module-catalog/products/services';
import { Presentation, PresentationRequest } from '@module-catalog/presentations/interfaces';
import { PresentationsService } from '@module-catalog/presentations/services';
import { getFormErrors } from '@shared/utils';
import { ValidatorErrors } from '@shared/components/validation-errors/validator-errors.component';

@Component({
  selector: 'app-create-presentation-modal',
  templateUrl: './create-presentation-modal.html',
  styleUrl: './create-presentation-modal.css',
  imports: [
    ReactiveFormsModule,
    CommonModule,
    ButtonModule,
    InputNumberModule,
    InputTextModule,
    SelectModule,
    ToggleSwitchModule,
    TranslateModule,
    ValidatorErrors,
  ],
})
export class CreatePresentationModal implements OnInit {
  @Output() reloadTable = new EventEmitter<void>();
  @Output() closeModal = new EventEmitter<void>();

  presentation = input<Presentation | null>(null);
  isEditing = input<boolean>(false);

  private fb = inject(FormBuilder);
  private toast = inject(ToastAlertService);
  private translate = inject(TranslateService);
  private service = inject(PresentationsService);
  private productsService = inject(ProductsService);

  readonly isSaving = signal(false);
  readonly products = signal<Product[]>([]);

  readonly presentationForm: FormGroup = this.fb.group({
    product_id: [null, [Validators.required]],
    name: ['', [Validators.required, Validators.maxLength(200)]],
    factor: [1, [Validators.required, Validators.min(1)]],
    barcode: [''],
    cost_price: [null, [Validators.required, Validators.min(0)]],
    sale_price: [null, [Validators.required, Validators.min(0)]],
    default_purchase: [false],
    default_sale: [false],
    isActive: [true],
  });

  ngOnInit(): void {
    this.loadProducts();

    if (this.presentation()) {
      this.presentationForm.patchValue(this.presentation()!);
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
    this.presentationForm.markAllAsTouched();
    if (this.presentationForm.invalid) {
      const errors = getFormErrors(this.presentationForm);
      console.log({ errors });
      this.toast.error(this.translate.instant('ALERTS.REQUIRED_FIELDS'));
      return;
    }

    this.isSaving.set(true);
    const payload: PresentationRequest = {
      product_id: this.presentationForm.get('product_id')?.value,
      name: this.presentationForm.get('name')?.value,
      factor: this.presentationForm.get('factor')?.value,
      barcode: this.presentationForm.get('barcode')?.value,
      cost_price: this.presentationForm.get('cost_price')?.value,
      sale_price: this.presentationForm.get('sale_price')?.value,
      default_purchase: this.presentationForm.get('default_purchase')?.value,
      default_sale: this.presentationForm.get('default_sale')?.value,
      isActive: this.presentationForm.get('isActive')?.value,
    };

    /* 
    	ID              *int64  `json:"id"`
	Name            string  `json:"name" binding:"required"`
	Factor          float64 `json:"factor" binding:"required"`
	Barcode         string  `json:"barcode"`
	CostPrice       float64 `json:"cost_price" binding:"required"`
	SalePrice       float64 `json:"sale_price" binding:"required"`
	DefaultPurchase bool    `json:"default_purchase"`
	DefaultSale     bool    `json:"default_sale"`
    
    
    */

    if (this.isEditing()) {
      this.service.update(this.presentation()!.id!, payload).subscribe({
        next: (res) => {
          this.isSaving.set(false);
          if (!res.error) {
            this.toast.success(this.translate.instant('MESSAGES.UPDATE_SUCCESS'));
            this.reloadTable.emit();
            this.closeModal.emit();
          }
        },
        error: () => {
          this.isSaving.set(false);
        },
      });
    } else {
      this.service.create(payload).subscribe({
        next: (res) => {
          this.isSaving.set(false);
          if (!res.error) {
            this.toast.success(this.translate.instant('MESSAGES.SAVE_SUCCESS'));
            this.reloadTable.emit();
            this.closeModal.emit();
          }
        },
        error: () => {
          this.isSaving.set(false);
        },
      });
    }
  }

  cancel(): void {
    this.closeModal.emit();
  }
}
