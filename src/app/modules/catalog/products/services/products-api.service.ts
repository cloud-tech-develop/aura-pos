import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '@environment/environment';
import { httpErrorHandler } from '@shared/utils';
import {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  ProductListResponse,
  ProductPaginationRequest,
  ProductPageResponse,
} from '../interfaces';
import { PageData, ResponseBase } from '@core/interfaces';

@Injectable({
  providedIn: 'root',
})
export class ProductsApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.API_URL + '/catalog/products';

  getAll(): Observable<{ error: boolean; msg: string; data?: Product[] }> {
    const res = { error: true, msg: 'Error undefined', data: undefined as Product[] | undefined };

    return this.http.get<ResponseBase<Product[]>>(`${this.apiUrl}`).pipe(
      map((r) => {
        res.msg = r.message;
        if (!r.success) return res;
        res.data = r.data;
        res.error = false;
        return res;
      }),
      catchError(httpErrorHandler),
    );
  }

  getById(id: number): Observable<{ error: boolean; msg: string; data?: Product }> {
    const res = { error: true, msg: 'Error undefined', data: undefined as Product | undefined };

    return this.http.get<ResponseBase<Product>>(`${this.apiUrl}/${id}`).pipe(
      map((r) => {
        res.msg = r.message;
        if (!r.success) return res;
        res.data = r.data;
        res.error = false;
        return res;
      }),
      catchError(httpErrorHandler),
    );
  }

  create(
    payload: CreateProductRequest,
  ): Observable<{ error: boolean; msg: string; data?: Product }> {
    const res = { error: true, msg: 'Error undefined', data: undefined as Product | undefined };

    return this.http.post<ResponseBase<Product>>(`${this.apiUrl}`, payload).pipe(
      map((r) => {
        res.msg = r.message;
        if (!r.success) return res;
        res.data = r.data;
        res.error = false;
        return res;
      }),
      catchError(httpErrorHandler),
    );
  }

  update(
    id: number,
    payload: UpdateProductRequest,
  ): Observable<{ error: boolean; msg: string; data?: Product }> {
    const res = { error: true, msg: 'Error undefined', data: undefined as Product | undefined };

    return this.http.put<ResponseBase<Product>>(`${this.apiUrl}/${id}`, payload).pipe(
      map((r) => {
        res.msg = r.message;
        if (!r.success) return res;
        res.data = r.data;
        res.error = false;
        return res;
      }),
      catchError(httpErrorHandler),
    );
  }

  delete(id: number): Observable<{ error: boolean; msg: string }> {
    const res = { error: true, msg: 'Error undefined' };

    return this.http.delete<ResponseBase<void>>(`${this.apiUrl}/${id}`).pipe(
      map((r) => {
        res.msg = r.message;
        res.error = !r.success;
        return res;
      }),
      catchError(httpErrorHandler),
    );
  }

  page(
    params: ProductPaginationRequest,
  ): Observable<{ error: boolean; msg: string; data?: PageData<Product> }> {
    const res = {
      error: true,
      msg: 'Error undefined',
      data: undefined as PageData<Product> | undefined,
    };

    return this.http.post<ResponseBase<PageData<Product>>>(`${this.apiUrl}/page`, params).pipe(
      map((r) => {
        res.msg = r.message;
        if (!r.success) return res;
        res.data = r.data;
        res.error = false;
        return res;
      }),
      catchError(httpErrorHandler),
    );
  }
}
