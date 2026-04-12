import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductsApiService } from './products-api.service';
import { Product, ProductRequest } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private productsApiService = inject(ProductsApiService);

  getAll(): Observable<{ error: boolean; msg: string; data?: Product[] }> {
    return this.productsApiService.getAll();
  }

  getById(id: string): Observable<{ error: boolean; msg: string; data?: Product }> {
    return this.productsApiService.getById(id);
  }

  create(payload: ProductRequest): Observable<{ error: boolean; msg: string; data?: Product }> {
    return this.productsApiService.create(payload);
  }

  update(id: string, payload: ProductRequest): Observable<{ error: boolean; msg: string; data?: Product }> {
    return this.productsApiService.update(id, payload);
  }

  delete(id: string): Observable<{ error: boolean; msg: string }> {
    return this.productsApiService.delete(id);
  }

  paginate(params: {
    page?: number;
    limit?: number;
    search?: string;
    categoryId?: string;
    brandId?: string;
  }): Observable<{
    error: boolean;
    msg: string;
    data?: { products: Product[]; total: number; page: number; limit: number; totalPages: number };
  }> {
    return this.productsApiService.paginate(params);
  }
}