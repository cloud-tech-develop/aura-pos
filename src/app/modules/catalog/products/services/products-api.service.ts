import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '@environment/environment';
import { httpErrorHandler } from '@shared/utils';
import {
  Product,
  ProductRequest,
  ProductResponse,
  ProductListResponse,
  ProductPaginationRequest,
  ProductPaginationResponse,
} from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class ProductsApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.API_URL;

  getAll(): Observable<{ error: boolean; msg: string; data?: Product[] }> {
    const res = { error: true, msg: 'Error undefined', data: undefined as Product[] | undefined };

    return this.http.get<ProductListResponse>(`${this.apiUrl}/products`).pipe(
      map((r) => {
        res.msg = r.message;
        if (r.error) return res;
        res.data = r.data;
        res.error = false;
        return res;
      }),
      catchError(httpErrorHandler),
    );
  }

  getById(id: string): Observable<{ error: boolean; msg: string; data?: Product }> {
    const res = { error: true, msg: 'Error undefined', data: undefined as Product | undefined };

    return this.http.get<ProductResponse>(`${this.apiUrl}/products/${id}`).pipe(
      map((r) => {
        res.msg = r.message;
        if (r.error) return res;
        res.data = r.data;
        res.error = false;
        return res;
      }),
      catchError(httpErrorHandler),
    );
  }

  create(payload: ProductRequest): Observable<{ error: boolean; msg: string; data?: Product }> {
    const res = { error: true, msg: 'Error undefined', data: undefined as Product | undefined };

    return this.http.post<ProductResponse>(`${this.apiUrl}/products`, payload).pipe(
      map((r) => {
        res.msg = r.message;
        if (r.error) return res;
        res.data = r.data;
        res.error = false;
        return res;
      }),
      catchError(httpErrorHandler),
    );
  }

  update(id: string, payload: ProductRequest): Observable<{ error: boolean; msg: string; data?: Product }> {
    const res = { error: true, msg: 'Error undefined', data: undefined as Product | undefined };

    return this.http.put<ProductResponse>(`${this.apiUrl}/products/${id}`, payload).pipe(
      map((r) => {
        res.msg = r.message;
        if (r.error) return res;
        res.data = r.data;
        res.error = false;
        return res;
      }),
      catchError(httpErrorHandler),
    );
  }

  delete(id: string): Observable<{ error: boolean; msg: string }> {
    const res = { error: true, msg: 'Error undefined' };

    return this.http.delete<ProductResponse>(`${this.apiUrl}/products/${id}`).pipe(
      map((r) => {
        res.msg = r.message;
        res.error = r.error;
        return res;
      }),
      catchError(httpErrorHandler),
    );
  }

  paginate(
    params: ProductPaginationRequest,
  ): Observable<{
    error: boolean;
    msg: string;
    data?: { products: Product[]; total: number; page: number; limit: number; totalPages: number };
  }> {
    const res = {
      error: true,
      msg: 'Error undefined',
      data: undefined as
        | { products: Product[]; total: number; page: number; limit: number; totalPages: number }
        | undefined,
    };

    let httpParams = new HttpParams();
    if (params.page !== undefined) httpParams = httpParams.set('page', params.page.toString());
    if (params.limit !== undefined) httpParams = httpParams.set('limit', params.limit.toString());
    if (params.search) httpParams = httpParams.set('search', params.search);
    if (params.categoryId) httpParams = httpParams.set('categoryId', params.categoryId);
    if (params.brandId) httpParams = httpParams.set('brandId', params.brandId);

    return this.http.get<ProductPaginationResponse>(`${this.apiUrl}/products/paginate`, { params: httpParams }).pipe(
      map((r) => {
        res.msg = r.message;
        if (r.error) return res;
        res.data = r.data;
        res.error = false;
        return res;
      }),
      catchError(httpErrorHandler),
    );
  }
}