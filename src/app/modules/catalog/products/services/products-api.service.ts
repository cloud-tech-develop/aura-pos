import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '@environment/environment';
import { httpErrorHandler } from '@shared/utils';
import {
  Product,
  CreateProductRequest,
  UpdateProductRequest,
  ProductResponse,
  ProductListResponse,
  ProductPaginationRequest,
  ProductPagination,
} from '../interfaces';

interface ApiResponse<T> {
  message: string;
  success: boolean;
  data?: T;
}

interface ApiListResponse {
  message: string;
  success: boolean;
  data: Product[];
  pagination?: ProductPagination;
}

@Injectable({
  providedIn: 'root',
})
export class ProductsApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.API_URL + '/catalog/products';

  getAll(): Observable<{ error: boolean; msg: string; data?: Product[] }> {
    const res = { error: true, msg: 'Error undefined', data: undefined as Product[] | undefined };

    return this.http.get<ApiListResponse>(`${this.apiUrl}`).pipe(
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

    return this.http.get<ApiResponse<Product>>(`${this.apiUrl}/${id}`).pipe(
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

    return this.http.post<ApiResponse<Product>>(`${this.apiUrl}`, payload).pipe(
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

    return this.http.put<ApiResponse<Product>>(`${this.apiUrl}/${id}`, payload).pipe(
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

    return this.http.delete<ApiResponse<void>>(`${this.apiUrl}/${id}`).pipe(
      map((r) => {
        res.msg = r.message;
        res.error = !r.success;
        return res;
      }),
      catchError(httpErrorHandler),
    );
  }

  paginate(
    params: ProductPaginationRequest,
  ): Observable<{ error: boolean; msg: string; data?: ProductListResponse }> {
    const res = {
      error: true,
      msg: 'Error undefined',
      data: undefined as ProductListResponse | undefined,
    };

    return this.http.post<ApiListResponse>(`${this.apiUrl}/page`, params).pipe(
      map((r) => {
        console.log({ r });

        res.msg = r.message;
        if (!r.success) return res;
        res.data = {
          message: r.message,
          success: r.success,
          data: r.data,
          pagination: r.pagination,
        };
        res.error = false;
        return res;
      }),
      catchError(httpErrorHandler),
    );
  }
}
