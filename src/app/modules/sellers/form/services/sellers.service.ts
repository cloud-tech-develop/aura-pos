import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { SellersApiService } from './sellers-api.service';
import { CreateSellerDto, Seller, UpdateSellerDto } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class SellersService {
  private readonly api = inject(SellersApiService);

  readonly currentSeller = signal<Seller | null>(null);
  readonly isLoading = signal<boolean>(false);
  readonly isSaving = signal<boolean>(false);

  getById(id: number): Observable<Seller> {
    this.isLoading.set(true);
    return this.api.getById(id);
  }

  create(dto: CreateSellerDto): Observable<Seller> {
    this.isSaving.set(true);
    return this.api.create(dto);
  }

  update(id: number, dto: UpdateSellerDto): Observable<Seller> {
    this.isSaving.set(true);
    return this.api.update(id, dto);
  }

  setCurrentSeller(seller: Seller | null): void {
    this.currentSeller.set(seller);
    this.isLoading.set(false);
  }

  setSaving(value: boolean): void {
    this.isSaving.set(value);
  }
}
