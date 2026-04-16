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
import { CreateCategoryModal } from '../create-category-modal/create-category-modal';
import { CategoriesService } from '../../services';
import { Category } from '../../interfaces';
import { PageParams } from '@core/interfaces';
import { formatPageParams } from '@shared/utils/table';

@Component({
  selector: 'app-index-categories',
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
    CreateCategoryModal,
  ],
  templateUrl: './index-categories.html',
  styleUrl: './index-categories.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexCategories {
  private categoriesService = inject(CategoriesService);

  readonly page = signal(1);
  readonly rows = signal(10);
  readonly totalRecords = signal(0);
  readonly categories = signal<Category[]>([]);
  readonly isLoading = signal(false);

  readonly showDialog = signal(false);
  readonly isEditing = signal(false);
  readonly searchQuery = signal('');
  readonly selectedCategory = signal<Category | null>(null);

  loadCategories(event: TableLazyLoadEvent): void {
    const payload: PageParams<null> = formatPageParams(event);
    this.isLoading.set(true);
    this.categoriesService.page(payload).subscribe((res) => {
      this.isLoading.set(false);
      if (!res.error && res.data) {
        this.totalRecords.set(res.data.total);
        this.categories.set(res.data.items);
        this.page.set(res.data.page);
        this.rows.set(res.data.limit);
      }
    });
  }

  onSearch(): void {
    this.loadCategories({
      first: 0,
      rows: this.rows(),
    } as TableLazyLoadEvent);
  }

  openCreateDialog(): void {
    this.isEditing.set(false);
    this.selectedCategory.set(null);
    this.showDialog.set(true);
  }

  openEditDialog(category: Category): void {
    this.isEditing.set(true);
    this.selectedCategory.set(category);
    this.showDialog.set(true);
  }

  hideDialog(): void {
    this.showDialog.set(false);
    this.selectedCategory.set(null);
  }

  deleteCategory(category: Category): void {
    this.categoriesService.delete(category.id).subscribe({
      next: (res) => {
        if (!res.error) {
          this.loadCategories({ first: 0, rows: this.rows() } as TableLazyLoadEvent);
        }
      },
    });
  }
}
