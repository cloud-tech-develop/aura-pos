import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '@environment/environment';
import { httpErrorHandler } from '@shared/utils';
import { Composition, CompositionRequest, CompositionResponse, CompositionListResponse } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class CompositionsApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.API_URL;

  getAll(): Observable<{ error: boolean; msg: string; data?: Composition[] }> {
    const res = { error: true, msg: 'Error undefined', data: undefined as Composition[] | undefined };

    return this.http.get<CompositionListResponse>(`${this.apiUrl}/compositions`).pipe(
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

  getById(id: string): Observable<{ error: boolean; msg: string; data?: Composition }> {
    const res = { error: true, msg: 'Error undefined', data: undefined as Composition | undefined };

    return this.http.get<CompositionResponse>(`${this.apiUrl}/compositions/${id}`).pipe(
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

  create(payload: CompositionRequest): Observable<{ error: boolean; msg: string; data?: Composition }> {
    const res = { error: true, msg: 'Error undefined', data: undefined as Composition | undefined };

    return this.http.post<CompositionResponse>(`${this.apiUrl}/compositions`, payload).pipe(
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

  update(id: string, payload: CompositionRequest): Observable<{ error: boolean; msg: string; data?: Composition }> {
    const res = { error: true, msg: 'Error undefined', data: undefined as Composition | undefined };

    return this.http.put<CompositionResponse>(`${this.apiUrl}/compositions/${id}`, payload).pipe(
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

    return this.http.delete<CompositionResponse>(`${this.apiUrl}/compositions/${id}`).pipe(
      map((r) => {
        res.msg = r.message;
        res.error = r.error;
        return res;
      }),
      catchError(httpErrorHandler),
    );
  }
}