import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { httpErrorHandler } from '@shared/utils';
import {
  Product,
  ProductRequest,
  ProductListResponse,
  ProductPaginationRequest,
  ProductPageResponse,
} from '../interfaces';
import { PageData, ResponseBase } from '@core/interfaces';
import { Presentation } from '@module-catalog/presentations/interfaces';
import { CatalogApiBase } from '../../services/catalog-api-base.service';

@Injectable({
  providedIn: 'root',
})
export class ProductsApiService extends CatalogApiBase {
  private http = inject(HttpClient);

  get apiUrl(): string {
    return this.catalogUrl + '/products';
  }

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

  create(payload: ProductRequest): Observable<{ error: boolean; msg: string; data?: Product }> {
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
    payload: ProductRequest,
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
        res.msg = 'Producto eliminado correctamente';
        res.error = false;
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

  existsBySku(sku: string): Observable<boolean> {
    return this.http.get<ResponseBase<{ exists: boolean }>>(`${this.apiUrl}/exist/${sku}`).pipe(
      map((r) => r.data?.exists ?? false),
      catchError(() => of(false)),
    );
  }

  getPresentations(id: number): Observable<{ error: boolean; msg: string; data?: Presentation[] }> {
    const res = {
      error: true,
      msg: 'Error undefined',
      data: undefined as Presentation[] | undefined,
    };

    return this.http.get<ResponseBase<Presentation[]>>(`${this.apiUrl}/${id}/presentations`).pipe(
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

  upsertPresentations(
    id: number,
    payload: Presentation[],
  ): Observable<{ error: boolean; msg: string; data: null }> {
    const res = {
      error: true,
      msg: 'Error undefined',
      data: null,
    };

    return this.http.post<ResponseBase<null>>(`${this.apiUrl}/${id}/presentations`, payload).pipe(
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
