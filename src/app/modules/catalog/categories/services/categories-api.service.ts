import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '@environment/environment';
import { httpErrorHandler } from '@shared/utils';
import { Category, CategoryRequest, CategoryResponse, CategoryListResponse } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class CategoriesApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.API_URL;

  getAll(): Observable<{ error: boolean; msg: string; data?: Category[] }> {
    const res = { error: true, msg: 'Error undefined', data: undefined as Category[] | undefined };

    return this.http.get<CategoryListResponse>(`${this.apiUrl}/categories`).pipe(
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

  getById(id: string): Observable<{ error: boolean; msg: string; data?: Category }> {
    const res = { error: true, msg: 'Error undefined', data: undefined as Category | undefined };

    return this.http.get<CategoryResponse>(`${this.apiUrl}/categories/${id}`).pipe(
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

  create(payload: CategoryRequest): Observable<{ error: boolean; msg: string; data?: Category }> {
    const res = { error: true, msg: 'Error undefined', data: undefined as Category | undefined };

    return this.http.post<CategoryResponse>(`${this.apiUrl}/categories`, payload).pipe(
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

  update(id: string, payload: CategoryRequest): Observable<{ error: boolean; msg: string; data?: Category }> {
    const res = { error: true, msg: 'Error undefined', data: undefined as Category | undefined };

    return this.http.put<CategoryResponse>(`${this.apiUrl}/categories/${id}`, payload).pipe(
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

    return this.http.delete<CategoryResponse>(`${this.apiUrl}/categories/${id}`).pipe(
      map((r) => {
        res.msg = r.message;
        res.error = r.error;
        return res;
      }),
      catchError(httpErrorHandler),
    );
  }
}