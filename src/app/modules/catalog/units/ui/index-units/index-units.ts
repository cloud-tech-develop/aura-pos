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
import { CreateUnitModal } from '../create-unit-modal/create-unit-modal';
import { UnitsService } from '../../services';
import { Unit } from '../../interfaces';
import { PageParams } from '@core/interfaces';
import { formatPageParams } from '@shared/utils/table';

@Component({
  selector: 'app-index-units',
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
    CreateUnitModal,
  ],
  templateUrl: './index-units.html',
  styleUrl: './index-units.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexUnits {
  private unitsService = inject(UnitsService);

  readonly page = signal(1);
  readonly rows = signal(10);
  readonly totalRecords = signal(0);
  readonly units = signal<Unit[]>([]);
  readonly isLoading = signal(false);

  readonly showDialog = signal(false);
  readonly isEditing = signal(false);
  readonly searchQuery = signal('');
  readonly selectedUnit = signal<Unit | null>(null);

  loadUnits(event: TableLazyLoadEvent): void {
    const payload: PageParams<null> = formatPageParams(event);
    this.isLoading.set(true);
    this.unitsService.page(payload).subscribe((res) => {
      this.isLoading.set(false);
      if (!res.error && res.data) {
        this.totalRecords.set(res.data.total);
        this.units.set(res.data.items);
        this.page.set(res.data.page);
        this.rows.set(res.data.limit);
      }
    });
  }

  onSearch(): void {
    this.loadUnits({
      first: 0,
      rows: this.rows(),
    } as TableLazyLoadEvent);
  }

  openCreateDialog(): void {
    this.isEditing.set(false);
    this.selectedUnit.set(null);
    this.showDialog.set(true);
  }

  openEditDialog(unit: Unit): void {
    this.isEditing.set(true);
    this.selectedUnit.set(unit);
    this.showDialog.set(true);
  }

  hideDialog(): void {
    this.showDialog.set(false);
    this.selectedUnit.set(null);
  }

  deleteUnit(unit: Unit): void {
    this.unitsService.delete(unit.id).subscribe({
      next: (res) => {
        if (!res.error) {
          this.loadUnits({ first: 0, rows: this.rows() } as TableLazyLoadEvent);
        }
      },
    });
  }
}
