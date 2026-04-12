import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { environment } from '@environment/environment';
import { httpErrorHandler } from '@shared/utils';
import { Unit, UnitRequest, UnitResponse, UnitListResponse } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class UnitsApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.API_URL;

  getAll(): Observable<{ error: boolean; msg: string; data?: Unit[] }> {
    const res = { error: true, msg: 'Error undefined', data: undefined as Unit[] | undefined };

    return this.http.get<UnitListResponse>(`${this.apiUrl}/units`).pipe(
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

  getById(id: string): Observable<{ error: boolean; msg: string; data?: Unit }> {
    const res = { error: true, msg: 'Error undefined', data: undefined as Unit | undefined };

    return this.http.get<UnitResponse>(`${this.apiUrl}/units/${id}`).pipe(
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

  create(payload: UnitRequest): Observable<{ error: boolean; msg: string; data?: Unit }> {
    const res = { error: true, msg: 'Error undefined', data: undefined as Unit | undefined };

    return this.http.post<UnitResponse>(`${this.apiUrl}/units`, payload).pipe(
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

  update(id: string, payload: UnitRequest): Observable<{ error: boolean; msg: string; data?: Unit }> {
    const res = { error: true, msg: 'Error undefined', data: undefined as Unit | undefined };

    return this.http.put<UnitResponse>(`${this.apiUrl}/units/${id}`, payload).pipe(
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

    return this.http.delete<UnitResponse>(`${this.apiUrl}/units/${id}`).pipe(
      map((r) => {
        res.msg = r.message;
        res.error = r.error;
        return res;
      }),
      catchError(httpErrorHandler),
    );
  }
}