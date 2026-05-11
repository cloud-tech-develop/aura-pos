import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { httpErrorHandler } from '@shared/utils';
import {
  Composition,
  CreateCompositionRequest,
  UpdateCompositionRequest,
} from '../interfaces';
import { CatalogApiBase } from '@module-catalog/services/catalog-api-base.service';
import { PageData, PageParams, PageResponse, ResponseBase } from '@core/interfaces';

@Injectable({
  providedIn: 'root',
})
export class CompositionsApiService extends CatalogApiBase {
  private http = inject(HttpClient);

  get apiUrl(): string {
    return this.catalogUrl + '/compositions';
  }

  getById(
    id: number,
  ): Observable<{ error: boolean; msg: string; data?: Composition }> {
    const res = {
      error: true,
      msg: 'Error undefined',
      data: undefined as Composition | undefined,
    };

    return this.http.get<ResponseBase<Composition>>(`${this.apiUrl}/${id}`).pipe(
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
    payload: CreateCompositionRequest,
  ): Observable<{ error: boolean; msg: string; data?: Composition }> {
    const res = {
      error: true,
      msg: 'Error undefined',
      data: undefined as Composition | undefined,
    };

    return this.http.post<ResponseBase<Composition>>(`${this.apiUrl}`, payload).pipe(
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
    payload: UpdateCompositionRequest,
  ): Observable<{ error: boolean; msg: string; data?: Composition }> {
    const res = {
      error: true,
      msg: 'Error undefined',
      data: undefined as Composition | undefined,
    };

    return this.http.put<ResponseBase<Composition>>(`${this.apiUrl}/${id}`, payload).pipe(
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
    payload: PageParams<null>,
  ): Observable<{ error: boolean; msg: string; data?: PageData<Composition> }> {
    const res = {
      error: true,
      msg: 'Error undefined',
      data: undefined as PageData<Composition> | undefined,
    };

    return this.http.post<PageResponse<Composition>>(`${this.apiUrl}/page`, payload).pipe(
      map(({ data, success, message }) => {
        res.msg = message;
        if (!success) return res;
        res.data = {
          items: data.items || [],
          page: data.page || 1,
          limit: data.limit || 10,
          total: data.total,
          totalPages: data.totalPages,
        };
        res.error = false;
        return res;
      }),
      catchError(httpErrorHandler),
    );
  }
}
