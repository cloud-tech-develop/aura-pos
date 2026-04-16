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

  readonly productForm: FormGroup = this.fb.group({
    status: [true],
    sku: ['', [Validators.maxLength(50)]],
    barcode: ['', [Validators.maxLength(50)]],
    name: ['', [Validators.required, Validators.maxLength(200)]],
    description: ['', [Validators.maxLength(500)]],
    category_id: [null],
    brand_id: [null],
    unit_id: [null],
    product_type: ['Standard'],
    visible_in_pos: [true],
    cost_price: [null, [Validators.required, Validators.min(0)]],
    sale_price: [null, [Validators.required, Validators.min(0)]],
    tax_rate: [19],
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
      sku: this.productForm.get('sku')?.value,
      name: this.productForm.get('name')?.value,
      cost_price: this.productForm.get('cost_price')?.value,
      sale_price: this.productForm.get('sale_price')?.value,
      tax_rate: this.productForm.get('tax_rate')?.value,
      min_stock: this.productForm.get('min_stock')?.value,
      image_url: this.productForm.get('image_url')?.value,
      status: this.productForm.get('status')?.value,
    };

    this.service.create(product).subscribe((response) => {
      if (!response.error) {
        this.reloadTable.emit();
      }
    });
  }
}
