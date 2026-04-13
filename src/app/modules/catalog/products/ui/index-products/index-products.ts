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
import { CreateProductModal } from '../create-product-modal/create-product-modal';

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
    CreateProductModal,
  ],
  templateUrl: './index-products.html',
  styleUrl: './index-products.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexProducts implements OnInit {
  private productsService = inject(ProductsService);
  private fb = inject(FormBuilder);
  readonly params = signal<ProductPaginationRequest>({
    page: 1,
    limit: 10,
    search: '',
  });

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

  readonly statusOptions = [
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Inactive', value: 'INACTIVE' },
    { label: 'Discontinued', value: 'DISCONTINUED' },
  ];

  ngOnInit(): void {
    // this.loadProducts();
  }

  loadProducts(event?: TableLazyLoadEvent): void {
    if (event) {
      this.params.set({
        page: (event.first || 0) / (event.rows || 10) + 1,
        limit: event.rows || 10,
        search: this.searchQuery() || undefined,
      });
    }

    this.productsService.page(this.params()).subscribe();
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

  deleteProduct(product: Product): void {
    this.productsService.delete(product.id).subscribe({
      next: (res) => {
        if (!res.error) {
          this.loadProducts({ first: 0, rows: 10 } as TableLazyLoadEvent);
        }
      },
    });
  }

  hideDialog(): void {
    this.showDialog.set(false);
  }
}
