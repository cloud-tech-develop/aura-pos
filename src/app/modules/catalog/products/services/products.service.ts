import { inject, Injectable, signal } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { ProductsApiService } from './products-api.service';
import {
  Product,
  ProductRequest,
  ProductListResponse,
  ProductPaginationRequest,
} from '../interfaces';
import { PageData } from '@core/interfaces';
import { Presentation } from '@module-catalog/presentations/interfaces';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private productsApiService = inject(ProductsApiService);

  getById(id: number): Observable<{ error: boolean; msg: string; data?: Product }> {
    return this.productsApiService.getById(id);
  }

  create(payload: ProductRequest): Observable<{ error: boolean; msg: string; data?: Product }> {
    return this.productsApiService.create(payload);
  }

  update(
    id: number,
    payload: ProductRequest,
  ): Observable<{ error: boolean; msg: string; data?: Product }> {
    return this.productsApiService.update(id, payload);
  }

  delete(id: number): Observable<{ error: boolean; msg: string }> {
    return this.productsApiService.delete(id);
  }

  page(params: ProductPaginationRequest): Observable<{
    error: boolean;
    msg: string;
    data?: PageData<Product>;
  }> {
    return this.productsApiService.page(params);
  }

  existsBySku(sku: string): Observable<boolean> {
    return this.productsApiService.existsBySku(sku);
  }

  getPresentations(id: number): Observable<{ error: boolean; msg: string; data?: Presentation[] }> {
    return this.productsApiService.getPresentations(id);
  }

  upsertPresentations(
    id: number,
    payload: Presentation[],
  ): Observable<{ error: boolean; msg: string; data: null }> {
    return this.productsApiService.upsertPresentations(id, payload);
  }
}
