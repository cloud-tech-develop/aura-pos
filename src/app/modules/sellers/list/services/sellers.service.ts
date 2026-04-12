import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { SellersApiService } from './sellers-api.service';
import { CreateSellerDto, Seller, UpdateSellerDto } from '../interfaces';

@Injectable({ providedIn: 'root' })
export class SellersService {
  private readonly api = inject(SellersApiService);

  readonly sellers = signal<Seller[]>([]);
  readonly isLoading = signal<boolean>(false);

  getAll(): Observable<Seller[]> {
    this.isLoading.set(true);
    return this.api.getAll().pipe(
      tap((sellers) => {
        this.sellers.set(sellers);
        this.isLoading.set(false);
      })
    );
  }

  getById(id: number): Observable<Seller> {
    return this.api.getById(id);
  }

  create(dto: CreateSellerDto): Observable<Seller> {
    return this.api.create(dto);
  }

  update(id: number, dto: UpdateSellerDto): Observable<Seller> {
    return this.api.update(id, dto);
  }

  delete(id: number): Observable<void> {
    return this.api.delete(id);
  }
}
