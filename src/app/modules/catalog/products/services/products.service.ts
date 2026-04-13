import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ProductsApiService } from './products-api.service';
import {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  ProductListResponse,
  ProductPaginationRequest,
} from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private productsApiService = inject(ProductsApiService);

  readonly products = signal<Product[]>([]);
  readonly isLoading = signal<boolean>(false);
  readonly pagination = signal<{
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } | null>(null);

  getAll(): Observable<{ error: boolean; msg: string; data?: Product[] }> {
    this.isLoading.set(true);
    return this.productsApiService.getAll().pipe(
      tap((res) => {
        if (!res.error && res.data) {
          this.products.set(res.data);
        }
        this.isLoading.set(false);
      }),
    );
  }

  getById(id: number): Observable<{ error: boolean; msg: string; data?: Product }> {
    return this.productsApiService.getById(id);
  }

  create(
    payload: CreateProductRequest,
  ): Observable<{ error: boolean; msg: string; data?: Product }> {
    return this.productsApiService.create(payload);
  }

  update(
    id: number,
    payload: UpdateProductRequest,
  ): Observable<{ error: boolean; msg: string; data?: Product }> {
    return this.productsApiService.update(id, payload);
  }

  delete(id: number): Observable<{ error: boolean; msg: string }> {
    return this.productsApiService.delete(id);
  }

  page(params: ProductPaginationRequest): Observable<{
    error: boolean;
    msg: string;
    data?: ProductListResponse;
  }> {
    this.isLoading.set(true);
    return this.productsApiService.page(params).pipe(
      tap((res) => {
        console.log({ res });

        if (!res.error && res.data) {
          this.products.set(res.data.items);
          this.pagination.set({
            page: res.data.page,
            limit: res.data.limit,
            total: res.data.total,
            totalPages: res.data.totalPages,
          });
        }
        this.isLoading.set(false);
      }),
    );
  }
}
