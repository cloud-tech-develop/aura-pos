import { CommonModule, DecimalPipe } from '@angular/common';
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
import { CreateProductRequest } from '@module-catalog/products/interfaces';
import { ProductsService } from '@module-catalog/products/services';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { TabsModule } from 'primeng/tabs';
import { TextareaModule } from 'primeng/textarea';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ValidatorErrors } from '@shared/components/validation-errors/validator-errors.component';
import { TranslateModule } from '@ngx-translate/core';
import { getFormErrors } from '@shared/utils';
import { CategoriesService } from '@module-catalog/categories/services';
import { Category } from '@module-catalog/categories/interfaces';
import { ListId } from '@core/interfaces';
import { UnitsService } from '@module-catalog/units/services';
import { BrandsService } from '@module-catalog/brands/services';
import { PRODUCT_TYPES } from '@core/constants';

@Component({
  selector: 'app-create-product-modal',
  templateUrl: './create-product-modal.html',
  styleUrl: './create-product-modal.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    ReactiveFormsModule,
    InputNumberModule,
    ButtonModule,
    TextareaModule,
    SelectModule,
    InputTextModule,
    TabsModule,
    ToggleSwitchModule,
    TranslateModule,
    ValidatorErrors,
    CommonModule,
  ],
})
export class CreateProductModal implements OnInit {
  @Output() reloadTable = new EventEmitter<void>();
  @Output() closeModal = new EventEmitter<void>();

  private fb = inject(FormBuilder);
  private service = inject(ProductsService);
  private categoriesService = inject(CategoriesService);
  private unitsService = inject(UnitsService);
  private brandsService = inject(BrandsService);

  isEditing = input<boolean>(false);
  isSaving = signal<boolean>(false);
  categoryList = signal<ListId[]>([]);
  unitList = signal<ListId[]>([]);
  brandList = signal<ListId[]>([]);
  productTypes = PRODUCT_TYPES;

  readonly productForm: FormGroup = this.fb.group({
    active: [true],
    sku: ['', [Validators.maxLength(50)]],
    barcode: ['', [Validators.maxLength(50)]],
    name: ['', [Validators.required, Validators.maxLength(200)]],
    description: ['', [Validators.maxLength(500)]],
    category_id: [null],
    brand_id: [null],
    unit_measure_id: [null],
    product_type: ['Standard'],
    visible_in_pos: [true],
    cost_price: [null, [Validators.required, Validators.min(0)]],
    sale_price: [null, [Validators.required, Validators.min(0)]],
    price_2: [null],
    price_3: [null],
    iva_percentage: [0],
    consumption_tax: [0],
    manages_inventory: [true],
    manages_batches: [false],
    manages_serial: [false],
    allow_negative_stock: [false],
    min_stock: [0],
    image_url: [''],
  });

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
  }

  saveProduct() {
    this.productForm.markAllAsTouched();
    if (this.productForm.invalid) {
      const errors = getFormErrors(this.productForm);
      console.log({ errors });
      return;
    }
    const product: CreateProductRequest = {
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

    this.service.create(product).subscribe((response) => {
      if (!response.error) {
        this.reloadTable.emit();
        this.closeModal.emit();
      }
    });
  }

  showPresentationForm = signal(false);
  presentationsList = signal<any[]>([]);

  readonly presentationForm: FormGroup = this.fb.group({
    name: ['', Validators.required],
    factor: [1, [Validators.required, Validators.min(1)]],
    barcode: [''],
    sale_price: [null, Validators.required],
    cost_price: [null, Validators.required],
    default_purchase: [false],
    default_sale: [false],
  });

  addPresentation() {
    this.showPresentationForm.set(true);
    this.presentationForm.reset({
      name: '',
      factor: 1,
      barcode: '',
      sale_price: null,
      cost_price: null,
      default_purchase: false,
      default_sale: false,
    });
  }

  cancelPresentation() {
    this.showPresentationForm.set(false);
  }

  savePresentation() {
    if (this.presentationForm.valid) {
      const current = this.presentationsList();
      this.presentationsList.set([...current, this.presentationForm.value]);
      this.showPresentationForm.set(false);
    }
  }

  removePresentation(index: number) {
    const current = this.presentationsList();
    current.splice(index, 1);
    this.presentationsList.set([...current]);
  }

  get margin(): number {
    const cost = this.productForm.get('cost_price')?.value || 0;
    const sale = this.productForm.get('sale_price')?.value || 0;
    if (cost === 0) return 0;
    return ((sale - cost) / cost) * 100;
  }
}
