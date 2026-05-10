import { ChangeDetectionStrategy, Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

import { TableLazyLoadEvent, TableModule } from 'primeng/table';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { CardModule } from 'primeng/card';
import { PaginatorModule } from 'primeng/paginator';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { ToastrService } from 'ngx-toastr';

import {
  Presentation,
  PresentationPaginationRequest,
} from '../../interfaces';
import { PresentationsService } from '../../services';
import { IndexHeaderComponent } from '@shared/components/index-header/index-header.component';
import { CreatePresentationModal } from '../create-presentation-modal/create-presentation-modal';
import { PageParams } from '@core/interfaces';
import { formatPageParams } from '@shared/utils/table';

@Component({
  selector: 'app-index-presentations',
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
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
    InputNumberModule,
    ToggleSwitchModule,
    IndexHeaderComponent,
    CreatePresentationModal,
  ],
  templateUrl: './index-presentations.html',
  styleUrl: './index-presentations.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexPresentations {
  private presentationsService = inject(PresentationsService);
  private toastr = inject(ToastrService);
  private translate = inject(TranslateService);

  readonly params = signal<PresentationPaginationRequest>({
    page: 1,
    limit: 10,
    search: '',
  });

  readonly searchQuery = signal('');

  readonly page = signal(1);
  readonly rows = signal(10);
  readonly isLoading = signal(false);
  readonly presentations = signal<Presentation[]>([]);
  readonly totalRecords = signal(0);

  // Dialog
  readonly showDialog = signal(false);
  readonly isEditing = signal(false);
  readonly selectedPresentation = signal<Presentation | null>(null);
  readonly isSaving = signal(false);
  readonly showDeleteDialog = signal(false);

  loadPresentations(event: TableLazyLoadEvent): void {
    const payload: PageParams<null> = formatPageParams(event);
    this.isLoading.set(true);
    this.presentationsService.page(payload).subscribe({
      next: ({ data }) => {
        this.isLoading.set(false);
        this.presentations.set(data?.items ?? []);
        this.totalRecords.set(data?.total ?? 0);
      },
    });
  }

  onDelete(presentation: Presentation): void {
    this.showDeleteDialog.set(true);
    this.selectedPresentation.set(presentation);
  }

  onEdit(presentation: Presentation): void {
    this.showDialog.set(true);
    this.isEditing.set(true);
    this.selectedPresentation.set(presentation);
  }

  deletePresentation(): void {
    if (!this.selectedPresentation()) return;
    this.presentationsService.delete(this.selectedPresentation()!.id!).subscribe({
      next: (res) => {
        if (!res.error) {
          this.showDeleteDialog.set(false);
          this.selectedPresentation.set(null);
          this.toastr.success(this.translate.instant('MESSAGES.DELETE_SUCCESS'));
          this.loadPresentations({ first: 0, rows: 10 } as TableLazyLoadEvent);
        }
      },
    });
  }

  hideDialog(): void {
    this.showDialog.set(false);
    this.isEditing.set(false);
    this.selectedPresentation.set(null);
  }
}