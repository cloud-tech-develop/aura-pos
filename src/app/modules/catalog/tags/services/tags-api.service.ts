import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { httpErrorHandler } from '@shared/utils';
import { Tag, TagRequest, TagResponse, TagListResponse } from '../interfaces';
import { CatalogApiBase } from '../../services/catalog-api-base.service';

@Injectable({
  providedIn: 'root',
})
export class TagsApiService extends CatalogApiBase {
  private http = inject(HttpClient);

  get apiUrl(): string {
    return this.getApiUrl('/tags');
  }

  getAll(): Observable<{ error: boolean; msg: string; data?: Tag[] }> {
    const res = { error: true, msg: 'Error undefined', data: undefined as Tag[] | undefined };

    return this.http.get<TagListResponse>(`${this.apiUrl}/tags`).pipe(
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

  getById(id: string): Observable<{ error: boolean; msg: string; data?: Tag }> {
    const res = { error: true, msg: 'Error undefined', data: undefined as Tag | undefined };

    return this.http.get<TagResponse>(`${this.apiUrl}/tags/${id}`).pipe(
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

  create(payload: TagRequest): Observable<{ error: boolean; msg: string; data?: Tag }> {
    const res = { error: true, msg: 'Error undefined', data: undefined as Tag | undefined };

    return this.http.post<TagResponse>(`${this.apiUrl}/tags`, payload).pipe(
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

  update(id: string, payload: TagRequest): Observable<{ error: boolean; msg: string; data?: Tag }> {
    const res = { error: true, msg: 'Error undefined', data: undefined as Tag | undefined };

    return this.http.put<TagResponse>(`${this.apiUrl}/tags/${id}`, payload).pipe(
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

    return this.http.delete<TagResponse>(`${this.apiUrl}/tags/${id}`).pipe(
      map((r) => {
        res.msg = r.message;
        res.error = r.error;
        return res;
      }),
      catchError(httpErrorHandler),
    );
  }
}