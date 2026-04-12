import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '@environment/environment';
import { httpErrorHandler } from '@shared/utils';
import { Presentation, PresentationRequest, PresentationResponse, PresentationListResponse } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class PresentationsApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.API_URL;

  getAll(): Observable<{ error: boolean; msg: string; data?: Presentation[] }> {
    const res = { error: true, msg: 'Error undefined', data: undefined as Presentation[] | undefined };

    return this.http.get<PresentationListResponse>(`${this.apiUrl}/presentations`).pipe(
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

  getById(id: string): Observable<{ error: boolean; msg: string; data?: Presentation }> {
    const res = { error: true, msg: 'Error undefined', data: undefined as Presentation | undefined };

    return this.http.get<PresentationResponse>(`${this.apiUrl}/presentations/${id}`).pipe(
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

  create(payload: PresentationRequest): Observable<{ error: boolean; msg: string; data?: Presentation }> {
    const res = { error: true, msg: 'Error undefined', data: undefined as Presentation | undefined };

    return this.http.post<PresentationResponse>(`${this.apiUrl}/presentations`, payload).pipe(
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

  update(id: string, payload: PresentationRequest): Observable<{ error: boolean; msg: string; data?: Presentation }> {
    const res = { error: true, msg: 'Error undefined', data: undefined as Presentation | undefined };

    return this.http.put<PresentationResponse>(`${this.apiUrl}/presentations/${id}`, payload).pipe(
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

    return this.http.delete<PresentationResponse>(`${this.apiUrl}/presentations/${id}`).pipe(
      map((r) => {
        res.msg = r.message;
        res.error = r.error;
        return res;
      }),
      catchError(httpErrorHandler),
    );
  }
}