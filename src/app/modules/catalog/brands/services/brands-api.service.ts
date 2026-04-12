import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '@environment/environment';
import { httpErrorHandler } from '@shared/utils';
import { Brand, BrandRequest, BrandResponse, BrandListResponse } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class BrandsApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.API_URL;

  getAll(): Observable<{ error: boolean; msg: string; data?: Brand[] }> {
    const res = { error: true, msg: 'Error undefined', data: undefined as Brand[] | undefined };

    return this.http.get<BrandListResponse>(`${this.apiUrl}/brands`).pipe(
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

  getById(id: string): Observable<{ error: boolean; msg: string; data?: Brand }> {
    const res = { error: true, msg: 'Error undefined', data: undefined as Brand | undefined };

    return this.http.get<BrandResponse>(`${this.apiUrl}/brands/${id}`).pipe(
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

  create(payload: BrandRequest): Observable<{ error: boolean; msg: string; data?: Brand }> {
    const res = { error: true, msg: 'Error undefined', data: undefined as Brand | undefined };

    return this.http.post<BrandResponse>(`${this.apiUrl}/brands`, payload).pipe(
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

  update(id: string, payload: BrandRequest): Observable<{ error: boolean; msg: string; data?: Brand }> {
    const res = { error: true, msg: 'Error undefined', data: undefined as Brand | undefined };

    return this.http.put<BrandResponse>(`${this.apiUrl}/brands/${id}`, payload).pipe(
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

    return this.http.delete<BrandResponse>(`${this.apiUrl}/brands/${id}`).pipe(
      map((r) => {
        res.msg = r.message;
        res.error = r.error;
        return res;
      }),
      catchError(httpErrorHandler),
    );
  }
}