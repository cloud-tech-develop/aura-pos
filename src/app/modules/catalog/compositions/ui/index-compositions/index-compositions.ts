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
import { CreateCompositionModal } from '../create-composition-modal/create-composition-modal';
import { CompositionsService } from '../../services';
import { Composition } from '../../interfaces';
import { PageParams } from '@core/interfaces';
import { formatPageParams } from '@shared/utils/table';
import { ToastAlertService } from '@services/index';

@Component({
  selector: 'app-index-compositions',
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
    CreateCompositionModal,
  ],
  templateUrl: './index-compositions.html',
  styleUrl: './index-compositions.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexCompositions {
  private compositionsService = inject(CompositionsService);
  private toast = inject(ToastAlertService);

  readonly params = signal<PageParams<null>>({
    page: 1,
    limit: 10,
    search: '',
    sort: 'id',
    order: 'desc',
  });

  readonly searchQuery = signal('');

  readonly page = signal(1);
  readonly rows = signal(10);
  readonly isLoading = signal(false);
  readonly compositions = signal<Composition[]>([]);
  readonly totalRecords = signal(0);

  // Dialog state
  readonly showDialog = signal(false);
  readonly isEditing = signal(false);
  readonly selectedComposition = signal<Composition | null>(null);
  readonly showDeleteDialog = signal(false);
  readonly compositionToDelete = signal<Composition | null>(null);

  loadCompositions(event: TableLazyLoadEvent): void {
    const payload: PageParams<null> = formatPageParams(event);
    this.isLoading.set(true);
    this.compositionsService.page(payload).subscribe({
      next: (res) => {
        this.isLoading.set(false);
        if (!res.error && res.data) {
          this.compositions.set(res.data.items);
          this.totalRecords.set(res.data.total);
          this.page.set(res.data.page);
          this.rows.set(res.data.limit);
        }
      },
      error: () => this.isLoading.set(false),
    });
  }

  onSearch(): void {
    this.loadCompositions({
      first: 0,
      rows: this.rows(),
    } as TableLazyLoadEvent);
  }

  openCreateDialog(): void {
    this.isEditing.set(false);
    this.selectedComposition.set(null);
    this.showDialog.set(true);
  }

  openEditDialog(composition: Composition): void {
    this.isEditing.set(true);
    this.selectedComposition.set(composition);
    this.showDialog.set(true);
  }

  hideDialog(): void {
    this.showDialog.set(false);
    this.selectedComposition.set(null);
  }

  confirmDelete(composition: Composition): void {
    this.compositionToDelete.set(composition);
    this.showDeleteDialog.set(true);
  }

  deleteComposition(): void {
    const composition = this.compositionToDelete();
    if (!composition) return;

    this.compositionsService.delete(composition.id).subscribe({
      next: (res) => {
        this.showDeleteDialog.set(false);
        this.compositionToDelete.set(null);
        if (!res.error) {
          this.toast.success(res.msg);
          this.loadCompositions({ first: 0, rows: this.rows() } as TableLazyLoadEvent);
        } else {
          this.toast.error(res.msg);
        }
      },
    });
  }

  getTipoSeverity(type: string): 'info' | 'success' {
    return type === 'KIT' ? 'info' : 'success';
  }
}
