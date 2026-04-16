import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '@environment/environment';
import { httpErrorHandler } from '@shared/utils';
import { Brand, BrandRequest } from '../interfaces';
import { ListId, PageData, PageParams, PageResponse, ResponseBase } from '@core/interfaces';

@Injectable({
  providedIn: 'root',
})
export class BrandsApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.API_URL + '/catalog/brands';

  list(): Observable<{ error: boolean; msg: string; data?: ListId[] }> {
    const res = { error: true, msg: 'Error undefined', data: undefined as ListId[] | undefined };

    return this.http.get<ResponseBase<ListId[]>>(`${this.apiUrl}`).pipe(
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

  getById(id: number): Observable<{ error: boolean; msg: string; data?: Brand }> {
    const res = { error: true, msg: 'Error undefined', data: undefined as Brand | undefined };

    return this.http.get<ResponseBase<Brand>>(`${this.apiUrl}/${id}`).pipe(
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

  create(payload: BrandRequest): Observable<{ error: boolean; msg: string; data?: Brand }> {
    const res = { error: true, msg: 'Error undefined', data: undefined as Brand | undefined };

    return this.http.post<ResponseBase<Brand>>(`${this.apiUrl}`, payload).pipe(
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

  update(id: number, payload: BrandRequest): Observable<{ error: boolean; msg: string; data?: Brand }> {
    const res = { error: true, msg: 'Error undefined', data: undefined as Brand | undefined };

    return this.http.put<ResponseBase<Brand>>(`${this.apiUrl}/${id}`, payload).pipe(
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

    return this.http.delete<ResponseBase<Brand>>(`${this.apiUrl}/${id}`).pipe(
      map((r) => {
        res.msg = r.message;
        res.error = !r.success;
        return res;
      }),
      catchError(httpErrorHandler),
    );
  }

  page(payload: PageParams<null>): Observable<{
    error: boolean;
    msg: string;
    data?: PageData<Brand>;
  }> {
    const res = {
      error: true,
      msg: 'Error undefined',
      data: undefined as PageData<Brand> | undefined,
    };

    return this.http.post<PageResponse<Brand>>(`${this.apiUrl}/page`, payload).pipe(
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
