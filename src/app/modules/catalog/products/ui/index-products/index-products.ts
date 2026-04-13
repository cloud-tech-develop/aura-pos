import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { PaginatorModule } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { ProductsService } from '../../services';
import {
  Product,
  ProductStatus,
  CreateProductRequest,
  ProductPaginationRequest,
} from '../../interfaces';
import { IndexHeaderComponent } from '@shared/components/index-header/index-header.component';
import { CardModule } from 'primeng/card';
import { TextareaModule } from 'primeng/textarea';
import { TabsModule } from 'primeng/tabs';
import { ToggleSwitchModule } from 'primeng/toggleswitch';

@Component({
  selector: 'app-index-products',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TranslateModule,
    CardModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    TextareaModule,
    SelectModule,
    IndexHeaderComponent,
    TagModule,
    IconFieldModule,
    InputIconModule,
    PaginatorModule,
    DialogModule,
    InputNumberModule,
    TabsModule,
    ToggleSwitchModule,
  ],
  templateUrl: './index-products.html',
  styleUrl: './index-products.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexProducts implements OnInit {
  private productsService = inject(ProductsService);
  private fb = inject(FormBuilder);

  readonly products = this.productsService.products;
  readonly isLoading = this.productsService.isLoading;
  readonly pagination = this.productsService.pagination;

  readonly searchQuery = signal('');
  readonly selectedCategory = signal<number | null>(null);
  readonly selectedBrand = signal<number | null>(null);

  readonly page = signal(1);
  readonly rows = signal(10);

  readonly totalRecords = signal(0);

  // Dialog
  readonly showDialog = signal(false);
  readonly isEditing = signal(false);
  readonly selectedProduct = signal<Product | null>(null);
  readonly isSaving = signal(false);

  readonly productForm: FormGroup = this.fb.group({
    sku: ['', [Validators.maxLength(50)]],
    barcode: ['', [Validators.maxLength(50)]],
    name: ['', [Validators.required, Validators.maxLength(200)]],
    description: [''],
    category_id: [null],
    brand_id: [null],
    unit_id: [null, [Validators.required]],
    product_type: ['Estándar', [Validators.required]],
    visible_in_pos: [true],
    cost_price: [null, [Validators.required, Validators.min(0)]],
    sale_price: [null, [Validators.required, Validators.min(0)]],
    tax_rate: [19],
    min_stock: [0],
    image_url: [''],
    status: [true],
  });

  readonly statusOptions = [
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Inactive', value: 'INACTIVE' },
    { label: 'Discontinued', value: 'DISCONTINUED' },
  ];

  ngOnInit(): void {
    // this.loadProducts();
  }

  loadProducts(event: TableLazyLoadEvent): void {
    const params: ProductPaginationRequest = {
      page: (event.first || 0) / (event.rows || 10) + 1,
      limit: event.rows || 10,
      search: this.searchQuery() || undefined,
    };

    this.productsService.paginate(params).subscribe();
  }

  getStatusSeverity(
    status: ProductStatus,
  ): 'success' | 'warn' | 'danger' | 'secondary' | 'contrast' | undefined {
    switch (status) {
      case 'ACTIVE':
        return 'success';
      case 'INACTIVE':
        return 'warn';
      case 'DISCONTINUED':
        return 'danger';
      default:
        return 'secondary';
    }
  }

  createProduct(): void {
    this.isEditing.set(false);
    this.selectedProduct.set(null);
    this.productForm.reset({
      sku: '',
      barcode: '',
      name: '',
      description: '',
      category_id: null,
      brand_id: null,
      unit_id: null,
      product_type: 'Estándar',
      visible_in_pos: true,
      cost_price: null,
      sale_price: null,
      tax_rate: 19,
      min_stock: 0,
      image_url: '',
      status: true,
    });
    this.showDialog.set(true);
  }

  editProduct(product: Product): void {
    this.isEditing.set(true);
    this.selectedProduct.set(product);
    this.productForm.patchValue({
      sku: product.sku,
      barcode: '', // TODO: map from product if available
      name: product.name,
      description: product.description || '',
      category_id: product.category_id,
      brand_id: product.brand_id,
      unit_id: null, // TODO: map from product
      product_type: 'Estándar', // TODO: map from product
      visible_in_pos: true, // TODO: map
      cost_price: product.cost_price,
      sale_price: product.sale_price,
      tax_rate: product.tax_rate || 19,
      min_stock: product.min_stock || 0,
      image_url: product.image_url || '',
      status: product.status === 'ACTIVE',
    });
    this.showDialog.set(true);
  }

  deleteProduct(product: Product): void {
    this.productsService.delete(product.id).subscribe({
      next: (res) => {
        if (!res.error) {
          this.loadProducts({ first: 0, rows: 10 } as TableLazyLoadEvent);
        }
      },
    });
  }

  saveProduct(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    this.isSaving.set(true);
    const formValue = this.productForm.value;

    const request: CreateProductRequest & any = {
      sku: formValue.sku || '',
      name: formValue.name,
      description: formValue.description || undefined,
      category_id: formValue.category_id || undefined,
      brand_id: formValue.brand_id || undefined,
      cost_price: formValue.cost_price || 0,
      sale_price: formValue.sale_price || 0,
      tax_rate: formValue.tax_rate || 19,
      min_stock: formValue.min_stock || 0,
      image_url: formValue.image_url || undefined,
      status: formValue.status ? 'ACTIVE' : 'INACTIVE',
      // Extras from UI for future backend support
      // barcode: formValue.barcode,
      // unit_id: formValue.unit_id,
      // product_type: formValue.product_type,
      // visible_in_pos: formValue.visible_in_pos,
    };

    const operation = this.isEditing()
      ? this.productsService.update(this.selectedProduct()!.id, request)
      : this.productsService.create(request);

    operation.subscribe({
      next: (res) => {
        this.isSaving.set(false);
        if (!res.error) {
          this.showDialog.set(false);
          this.loadProducts({ first: 0, rows: 10 } as TableLazyLoadEvent);
        }
      },
      error: () => {
        this.isSaving.set(false);
      },
    });
  }

  hideDialog(): void {
    this.showDialog.set(false);
    this.productForm.reset();
  }
}
