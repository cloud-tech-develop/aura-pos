import { ChangeDetectionStrategy, Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { SellersService } from '../../services';
import { Seller } from '../../interfaces';

@Component({
  selector: 'app-index-list',
  imports: [TranslateModule],
  template: `
    <div class="container mx-auto p-6">
      <div class="flex justify-between items-center mb-6">
        <h1 class="text-2xl font-bold">{{ 'SELLERS.TITLE' | translate }}</h1>
        <button
          class="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 transition-colors"
          (click)="navigateToForm()"
        >
          {{ 'SELLERS.ADD_NEW' | translate }}
        </button>
      </div>

      @if (isLoading()) {
        <div class="flex justify-center items-center py-12">
          <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      } @else if (sellers().length === 0) {
        <div class="text-center py-12 text-gray-500">
          <p>{{ 'SELLERS.EMPTY' | translate }}</p>
        </div>
      } @else {
        <div class="bg-white rounded-lg shadow overflow-hidden">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ 'SELLERS.NAME' | translate }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ 'SELLERS.EMAIL' | translate }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ 'SELLERS.PHONE' | translate }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ 'SELLERS.COMMISSION' | translate }}
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ 'SELLERS.STATUS' | translate }}
                </th>
                <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {{ 'SELLERS.ACTIONS' | translate }}
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              @for (seller of sellers(); track seller.id) {
                <tr class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap">{{ seller.name }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ seller.email }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ seller.phone }}</td>
                  <td class="px-6 py-4 whitespace-nowrap">{{ seller.commission }}%</td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span
                      [class]="seller.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                      class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                    >
                      {{ seller.isActive ? ('SELLERS.ACTIVE' | translate) : ('SELLERS.INACTIVE' | translate) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      class="text-primary-500 hover:text-primary-700 mr-3"
                      (click)="editSeller(seller)"
                    >
                      {{ 'COMMON.EDIT' | translate }}
                    </button>
                    <button
                      class="text-red-500 hover:text-red-700"
                      (click)="deleteSeller(seller)"
                    >
                      {{ 'COMMON.DELETE' | translate }}
                    </button>
                  </td>
                </tr>
              }
            </tbody>
          </table>
        </div>
      }
    </div>
  `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class IndexList implements OnInit {
  private readonly sellersService = inject(SellersService);
  private readonly router = inject(Router);

  readonly sellers = this.sellersService.sellers;
  readonly isLoading = this.sellersService.isLoading;

  ngOnInit(): void {
    this.sellersService.getAll().subscribe();
  }

  navigateToForm(): void {
    this.router.navigate(['/sellers/form']);
  }

  editSeller(seller: Seller): void {
    this.router.navigate(['/sellers/form', seller.id]);
  }

  deleteSeller(seller: Seller): void {
    if (seller.id && confirm(`¿Eliminar vendedor ${seller.name}?`)) {
      this.sellersService.delete(seller.id).subscribe(() => {
        this.sellersService.getAll().subscribe();
      });
    }
  }
}
