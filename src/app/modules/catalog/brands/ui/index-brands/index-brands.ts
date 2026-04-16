import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { PaginatorModule } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { CardModule } from 'primeng/card';
import { IndexHeaderComponent } from '@shared/components/index-header/index-header.component';
import { CreateBrandModal } from '../create-brand-modal/create-brand-modal';
import { BrandsService } from '../../services';
import { Brand } from '../../interfaces';
import { PageParams } from '@core/interfaces';
import { formatPageParams } from '@shared/utils/table';

@Component({
  selector: 'app-index-brands',
  imports: [
    CommonModule,
    FormsModule,
    TranslateModule,
    CardModule,
    TableModule,
    InputTextModule,
    ButtonModule,
    TagModule,
    IconFieldModule,
    InputIconModule,
    PaginatorModule,
    DialogModule,
    IndexHeaderComponent,
    CreateBrandModal,
  ],
  templateUrl: './index-brands.html',
  styleUrl: './index-brands.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexBrands {
  private brandsService = inject(BrandsService);

  readonly page = signal(1);
  readonly rows = signal(10);
  readonly totalRecords = signal(0);
  readonly brands = signal<Brand[]>([]);
  readonly isLoading = signal(false);

  readonly showDialog = signal(false);
  readonly isEditing = signal(false);
  readonly searchQuery = signal('');
  readonly selectedBrand = signal<Brand | null>(null);

  loadBrands(event: TableLazyLoadEvent): void {
    const payload: PageParams<null> = formatPageParams(event);
    this.isLoading.set(true);
    this.brandsService.page(payload).subscribe((res) => {
      this.isLoading.set(false);
      if (!res.error && res.data) {
        this.totalRecords.set(res.data.total);
        this.brands.set(res.data.items);
        this.page.set(res.data.page);
        this.rows.set(res.data.limit);
      }
    });
  }

  onSearch(): void {
    this.loadBrands({
      first: 0,
      rows: this.rows(),
    } as TableLazyLoadEvent);
  }

  openCreateDialog(): void {
    this.isEditing.set(false);
    this.selectedBrand.set(null);
    this.showDialog.set(true);
  }

  openEditDialog(brand: Brand): void {
    this.isEditing.set(true);
    this.selectedBrand.set(brand);
    this.showDialog.set(true);
  }

  hideDialog(): void {
    this.showDialog.set(false);
    this.selectedBrand.set(null);
  }

  deleteBrand(brand: Brand): void {
    this.brandsService.delete(brand.id).subscribe({
      next: (res) => {
        if (!res.error) {
          this.loadBrands({ first: 0, rows: this.rows() } as TableLazyLoadEvent);
        }
      },
    });
  }
}
