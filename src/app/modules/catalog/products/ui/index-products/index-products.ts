import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CardModule } from 'primeng/card';
import { TextareaModule } from 'primeng/textarea';
import { TabsModule } from 'primeng/tabs';
import { PaginatorModule } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ToastrService } from 'ngx-toastr';

import { Product, ProductPaginationRequest } from '../../interfaces';
import { ProductsService } from '../../services';
import { IndexHeaderComponent } from '@shared/components/index-header/index-header.component';
import { CreateProductModal } from '../create-product-modal/create-product-modal';
import { PageParams } from '@core/interfaces';
import { formatPageParams } from '@shared/utils/table';
import { TruncatePipe } from '@core/pipes';

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
    TruncatePipe,
    TabsModule,
    ToggleSwitchModule,
    CreateProductModal,
  ],
  templateUrl: './index-products.html',
  styleUrl: './index-products.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexProducts {
  private productsService = inject(ProductsService);
  private toastr = inject(ToastrService);
  private translate = inject(TranslateService);

  readonly params = signal<ProductPaginationRequest>({
    page: 1,
    limit: 10,
    search: '',
  });

  readonly searchQuery = signal('');
  readonly selectedCategory = signal<number | null>(null);
  readonly selectedBrand = signal<number | null>(null);

  readonly page = signal(1);
  readonly rows = signal(10);
  readonly isLoading = signal(false);
  readonly products = signal<Product[]>([]);
  readonly totalRecords = signal(0);

  // Dialog
  readonly showDialog = signal(false);
  readonly isEditing = signal(false);
  readonly selectedProduct = signal<Product | null>(null);
  readonly isSaving = signal(false);
  readonly showDeleteDialog = signal(false);

  readonly statusOptions = [
    { label: 'Active', value: 'ACTIVE' },
    { label: 'Inactive', value: 'INACTIVE' },
    { label: 'Discontinued', value: 'DISCONTINUED' },
  ];

  loadProducts(event: TableLazyLoadEvent): void {
    const payload: PageParams<null> = formatPageParams(event);
    this.isLoading.set(true);
    this.productsService.page(payload).subscribe({
      next: ({ data }) => {
        this.isLoading.set(false);
        this.products.set(data?.items ?? []);
        this.totalRecords.set(data?.total ?? 0);
      },
    });
  }

  onDelete(product: Product): void {
    this.showDeleteDialog.set(true);
    this.selectedProduct.set(product);
  }

  onEdit(product: Product): void {
    this.showDialog.set(true);
    this.isEditing.set(true);
    this.selectedProduct.set(product);
  }

  deleteProduct(): void {
    if (!this.selectedProduct()) return;
    this.productsService.delete(this.selectedProduct()!.id).subscribe({
      next: (res) => {
        if (!res.error) {
          this.showDeleteDialog.set(false);
          this.selectedProduct.set(null);
          this.toastr.success(this.translate.instant('MESSAGES.DELETE_SUCCESS'));
          this.loadProducts({ first: 0, rows: 10 } as TableLazyLoadEvent);
        }
      },
    });
  }

  hideDialog(): void {
    this.showDialog.set(false);
    this.isEditing.set(false);
    this.selectedProduct.set(null);
  }
}
