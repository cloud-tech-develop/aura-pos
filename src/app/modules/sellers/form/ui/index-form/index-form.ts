import { ChangeDetectionStrategy, Component, inject, OnInit, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { ToastAlertService } from '@services/toast-alert.service';
import { SellersService } from '../../services';
import { CreateSellerDto } from '../../interfaces';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-index-form',
  imports: [TranslateModule, FormsModule],
  template: `
    <div class="container mx-auto p-6 max-w-2xl">
      <div class="flex items-center mb-6">
        <button
          class="mr-4 text-gray-600 hover:text-gray-800"
          (click)="goBack()"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
        </button>
        <h1 class="text-2xl font-bold">
          {{ isEditing() ? ('SELLERS.EDIT_TITLE' | translate) : ('SELLERS.CREATE_TITLE' | translate) }}
        </h1>
      </div>

      @if (isLoading()) {
        <div class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      } @else {
        <form class="bg-white rounded-lg shadow p-6 space-y-4" (ngSubmit)="onSubmit()">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ 'SELLERS.NAME' | translate }} *
            </label>
            <input
              type="text"
              [(ngModel)]="formData.name"
              name="name"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              [placeholder]="'SELLERS.NAME_PLACEHOLDER' | translate"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ 'SELLERS.EMAIL' | translate }} *
            </label>
            <input
              type="email"
              [(ngModel)]="formData.email"
              name="email"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              [placeholder]="'SELLERS.EMAIL_PLACEHOLDER' | translate"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ 'SELLERS.PHONE' | translate }} *
            </label>
            <input
              type="tel"
              [(ngModel)]="formData.phone"
              name="phone"
              required
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              [placeholder]="'SELLERS.PHONE_PLACEHOLDER' | translate"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">
              {{ 'SELLERS.COMMISSION' | translate }} (%) *
            </label>
            <input
              type="number"
              [(ngModel)]="formData.commission"
              name="commission"
              required
              min="0"
              max="100"
              class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500"
              [placeholder]="'SELLERS.COMMISSION_PLACEHOLDER' | translate"
            />
          </div>

          <div class="flex items-center">
            <input
              type="checkbox"
              [(ngModel)]="formData.isActive"
              name="isActive"
              id="isActive"
              class="w-4 h-4 text-primary-500 border-gray-300 rounded focus:ring-primary-500"
            />
            <label for="isActive" class="ml-2 text-sm text-gray-700">
              {{ 'SELLERS.ACTIVE' | translate }}
            </label>
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              class="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              (click)="goBack()"
            >
              {{ 'COMMON.CANCEL' | translate }}
            </button>
            <button
              type="submit"
              [disabled]="isSaving()"
              class="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              @if (isSaving()) {
                <span class="flex items-center">
                  <svg class="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {{ 'COMMON.SAVING' | translate }}
                </span>
              } @else {
                {{ 'COMMON.SAVE' | translate }}
              }
            </button>
          </div>
        </form>
      }
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexForm implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly sellersService = inject(SellersService);
  private readonly toast = inject(ToastAlertService);

  readonly isLoading = this.sellersService.isLoading;
  readonly isSaving = this.sellersService.isSaving;
  readonly isEditing = signal<boolean>(false);
  private sellerId: number | null = null;

  formData: CreateSellerDto = {
    name: '',
    email: '',
    phone: '',
    commission: 0,
    isActive: true,
  };

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.sellerId = parseInt(idParam, 10);
      this.isEditing.set(true);
      this.sellersService.getById(this.sellerId).subscribe({
        next: (seller) => {
          this.formData = {
            name: seller.name,
            email: seller.email,
            phone: seller.phone,
            commission: seller.commission,
            isActive: seller.isActive,
          };
        },
        error: () => {
          this.toast.error('Error al cargar vendedor');
          this.goBack();
        },
      });
    }
  }

  onSubmit(): void {
    if (this.isEditing() && this.sellerId) {
      this.sellersService.update(this.sellerId, this.formData).subscribe({
        next: () => {
          this.toast.success('Vendedor actualizado correctamente');
          this.goBack();
        },
        error: () => {
          this.toast.error('Error al actualizar vendedor');
        },
      });
    } else {
      this.sellersService.create(this.formData).subscribe({
        next: () => {
          this.toast.success('Vendedor creado correctamente');
          this.goBack();
        },
        error: () => {
          this.toast.error('Error al crear vendedor');
        },
      });
    }
  }

  goBack(): void {
    this.router.navigate(['/sellers/list']);
  }
}
