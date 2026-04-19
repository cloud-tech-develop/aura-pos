import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  inject,
  input,
  OnDestroy,
  OnInit,
  Output,
  signal,
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { ProductRequest, Product } from '@module-catalog/products/interfaces';
import { ProductsService } from '@module-catalog/products/services';

import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TabsModule } from 'primeng/tabs';
import { TextareaModule } from 'primeng/textarea';
import { ChipModule } from 'primeng/chip';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

import { ValidatorErrors } from '@shared/components/validation-errors/validator-errors.component';
import { CategoriesService } from '@module-catalog/categories/services';
import { UnitsService } from '@module-catalog/units/services';
import { BrandsService } from '@module-catalog/brands/services';

import { PRODUCT_STANDARD, PRODUCT_TYPES } from '@core/constants';
import { getFormErrors } from '@shared/utils';
import { skuExistsValidator } from '@core/validators';
import { ListId } from '@core/interfaces';
import { ToastAlertService } from '@services/index';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { PresentationsService } from '@module-catalog/presentations/services';
import { DialogModule } from 'primeng/dialog';
import { Presentation } from '@module-catalog/presentations/interfaces';

const TAB_ERRORS: Record<number, string[]> = {
  0: ['name', 'sku', 'unit_measure_id'],
  1: ['presentations'],
  2: [],
  3: [],
  4: ['cost_price', 'sale_price'],
};

@Component({
  selector: 'app-create-product-modal',
  templateUrl: './create-product-modal.html',
  styleUrl: './create-product-modal.css',
  imports: [
    ReactiveFormsModule,
    InputNumberModule,
    ButtonModule,
    TextareaModule,
    SelectModule,
    InputTextModule,
    DialogModule,
    IconFieldModule,
    InputIconModule,
    TabsModule,
    ToggleSwitchModule,
    ChipModule,
    TranslateModule,
    ValidatorErrors,
    CommonModule,
  ],
})
export class CreateProductModal implements OnInit, OnDestroy {
  @Output() reloadTable = new EventEmitter<void>();
  @Output() closeModal = new EventEmitter<void>();
  product = input<Product | null>(null);
  isEditing = input<boolean>(false);

  private fb = inject(FormBuilder);
  private toast = inject(ToastAlertService);
  private translate = inject(TranslateService);

  private service = inject(ProductsService);
  private categoriesService = inject(CategoriesService);
  private unitsService = inject(UnitsService);
  private brandsService = inject(BrandsService);
  private presentationsService = inject(PresentationsService);

  selectedPresentation = signal<Presentation | null>(null);
  isSaving = signal<boolean>(false);
  categoryList = signal<ListId[]>([]);
  unitList = signal<ListId[]>([]);
  brandList = signal<ListId[]>([]);
  showPresentationForm = signal(false);
  showDeleteDialog = signal(false);
  presentationsList = signal<Presentation[]>([]);
  productTypes = PRODUCT_TYPES;

  tabValue: number = 0;

  get margin(): number {
    const cost = this.productForm.get('cost_price')?.value || 0;
    const sale = this.productForm.get('sale_price')?.value || 0;
    if (cost === 0) return 0;
    return ((sale - cost) / cost) * 100;
  }

  readonly productForm: FormGroup = this.fb.group({
    active: [true],
    sku: [null, [Validators.required, Validators.maxLength(50)]],
    barcode: [null, [Validators.maxLength(50)]],
    name: [null, [Validators.required, Validators.maxLength(200)]],
    description: [null, [Validators.maxLength(500)]],
    category_id: [null],
    brand_id: [null],
    unit_measure_id: [null, [Validators.required]],
    product_type: [PRODUCT_STANDARD.value],
    visible_in_pos: [true],
    cost_price: [null, [Validators.required, Validators.min(0)]],
    sale_price: [null, [Validators.required, Validators.min(0)]],
    price_2: [null],
    price_3: [null],
    iva_percentage: [0, [Validators.required, Validators.min(0), Validators.max(100)]],
    consumption_tax: [0, [Validators.required, Validators.min(0)]],
    manages_inventory: [true],
    manages_batches: [false],
    manages_serial: [false],
    allow_negative_stock: [false],
    min_stock: [0, [Validators.required, Validators.min(0)]],
    image_url: [''],
  });

  ngOnDestroy(): void {
    this.closeModal.emit();
  }

  ngOnInit(): void {
    this.categoriesService.list().subscribe((res) => {
      this.categoryList.set(res.data || []);
    });
    this.unitsService.list().subscribe((res) => {
      this.unitList.set(res.data || []);
    });
    this.brandsService.list().subscribe((res) => {
      this.brandList.set(res.data || []);
    });
    const SKU_CONTROL = this.productForm.get('sku');
    if (this.product()) {
      this.productForm.patchValue(this.product()!);
      SKU_CONTROL?.disable();
      this.getPresentations();
    } else {
      SKU_CONTROL?.enable();
      SKU_CONTROL?.setAsyncValidators([skuExistsValidator((sku) => this.service.existsBySku(sku))]);
      SKU_CONTROL?.updateValueAndValidity();
    }
  }

  onSkuUnlock() {
    const SKU_CONTROL = this.productForm.get('sku');
    SKU_CONTROL?.enable();
    SKU_CONTROL?.setAsyncValidators([skuExistsValidator((sku) => this.service.existsBySku(sku))]);
    SKU_CONTROL?.updateValueAndValidity();
  }

  private getPresentations() {
    this.service.getPresentations(this.product()!.id).subscribe((res) => {
      if (!res.error) {
        this.presentationsList.set(res.data || []);
      }
    });
  }

  saveProduct() {
    this.productForm.markAllAsTouched();
    if (this.productForm.invalid) {
      const errors = getFormErrors(this.productForm);
      const listErrors = errors.map((error) => Object.keys(error)[0]);
      [4, 3, 2, 1, 0].forEach((tab) => {
        TAB_ERRORS[tab].forEach((error) => {
          if (listErrors.includes(error)) {
            this.tabValue = tab;
          }
        });
      });
      this.productForm.updateValueAndValidity();
      this.toast.error(this.translate.instant('ALERTS.REQUIRED_FIELDS'));
      return;
    }
    const product: ProductRequest = {
      active: this.productForm.get('active')?.value,
      sku: this.productForm.get('sku')?.value,
      barcode: this.productForm.get('barcode')?.value,
      name: this.productForm.get('name')?.value,
      description: this.productForm.get('description')?.value,
      category_id: this.productForm.get('category_id')?.value,
      brand_id: this.productForm.get('brand_id')?.value,
      unit_measure_id: this.productForm.get('unit_measure_id')?.value,
      product_type: this.productForm.get('product_type')?.value,
      cost_price: this.productForm.get('cost_price')?.value,
      sale_price: this.productForm.get('sale_price')?.value,
      price_2: this.productForm.get('price_2')?.value,
      price_3: this.productForm.get('price_3')?.value,
      iva_percentage: Number(this.productForm.get('iva_percentage')?.value),
      consumption_tax: this.productForm.get('consumption_tax')?.value,
      manages_inventory: this.productForm.get('manages_inventory')?.value,
      manages_batches: this.productForm.get('manages_batches')?.value,
      manages_serial: this.productForm.get('manages_serial')?.value,
      allow_negative_stock: this.productForm.get('allow_negative_stock')?.value,
      visible_in_pos: this.productForm.get('visible_in_pos')?.value,
      min_stock: this.productForm.get('min_stock')?.value,
      image_url: this.productForm.get('image_url')?.value,
      status: this.productForm.get('active')?.value ? 'ACTIVE' : 'INACTIVE',
      presentations: this.presentationsList(),
    };

    if (this.isEditing()) {
      this.service.update(this.product()!.id, product).subscribe((response) => {
        if (!response.error) {
          this.reloadTable.emit();
          this.closeModal.emit();
        }
      });
    } else {
      this.service.create(product).subscribe((response) => {
        if (!response.error) {
          this.reloadTable.emit();
          this.closeModal.emit();
        }
      });
    }
  }

  readonly presentationForm: FormGroup = this.fb.group({
    id: [null],
    name: ['', Validators.required],
    factor: [1, [Validators.required, Validators.min(1)]],
    barcode: [''],
    sale_price: [null, Validators.required],
    cost_price: [null, Validators.required],
    default_purchase: [false],
    default_sale: [false],
  });

  addPresentation(presentation?: Presentation) {
    this.showPresentationForm.set(true);
    this.presentationForm.reset({
      id: presentation?.id || null,
      name: presentation?.name || '',
      factor: presentation?.factor || 1,
      barcode: presentation?.barcode || '',
      sale_price: presentation?.sale_price || null,
      cost_price: presentation?.cost_price || null,
      default_purchase: presentation?.default_purchase || false,
      default_sale: presentation?.default_sale || false,
    });
  }

  cancelPresentation() {
    this.showPresentationForm.set(false);
  }

  savePresentation() {
    if (this.presentationForm.valid) {
      const isEditing = this.presentationForm.get('id')?.value;
      const currenIsDefaultPurchase = this.presentationForm.get('default_purchase')?.value;
      const currenIsDefaultSale = this.presentationForm.get('default_sale')?.value;
      const current = this.presentationsList()
        .map((p) => {
          return {
            ...p,
            default_purchase: currenIsDefaultPurchase ? false : p.default_purchase,
            default_sale: currenIsDefaultSale ? false : p.default_sale,
          };
        })
        .filter((p) => p.id !== isEditing);
      this.presentationsList.set([...current, this.presentationForm.value]);
      this.showPresentationForm.set(false);
    }
  }

  removePresentation(index: number) {
    const current = this.presentationsList();
    const presentation = current[index];

    if (presentation && presentation.id) {
      this.selectedPresentation.set(presentation);
      this.showDeleteDialog.set(true);
    } else {
      current.splice(index, 1);
      this.presentationsList.set([...current]);
    }
  }

  deletePresentation() {
    this.showDeleteDialog.set(false);
    this.presentationsService.delete(this.selectedPresentation()!.id!).subscribe((response) => {
      if (!response.error) {
        this.toast.success(this.translate.instant('MESSAGES.DELETE_SUCCESS'));
        this.getPresentations();
      }
    });
  }

  nextTab() {
    this.productForm.markAllAsTouched();
    const errors = getFormErrors(this.productForm);

    const listErrors = errors.map((error) => Object.keys(error)[0]);
    const errorsInTab = listErrors.some((error) => TAB_ERRORS[this.tabValue].includes(error));
    if (errorsInTab) {
      return;
    }
    this.tabValue = this.tabValue + 1;
  }
}
