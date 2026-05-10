import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable } from 'rxjs';
import { httpErrorHandler } from '@shared/utils';
import { CatalogApiBase } from '@module-catalog/services/catalog-api-base.service';
import {
  Presentation,
  PresentationRequest,
  PresentationPaginationRequest,
  PresentationResponse,
  PresentationPageResponse,
} from '../interfaces';
import { PageData, ResponseBase } from '@core/interfaces';

@Injectable({
  providedIn: 'root',
})
export class PresentationsApiService extends CatalogApiBase {
  private http = inject(HttpClient);

  get apiUrl(): string {
    return this.catalogUrl + '/presentations';
  }

  getAll(): Observable<{ error: boolean; msg: string; data?: Presentation[] }> {
    const res = {
      error: true,
      msg: 'Error undefined',
      data: undefined as Presentation[] | undefined,
    };

    return this.http.get<ResponseBase<Presentation[]>>(`${this.apiUrl}`).pipe(
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

  getById(id: number): Observable<{ error: boolean; msg: string; data?: Presentation }> {
    const res = {
      error: true,
      msg: 'Error undefined',
      data: undefined as Presentation | undefined,
    };

    return this.http.get<ResponseBase<Presentation>>(`${this.apiUrl}/${id}`).pipe(
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
    payload: PresentationRequest,
  ): Observable<{ error: boolean; msg: string; data?: Presentation }> {
    const res = {
      error: true,
      msg: 'Error undefined',
      data: undefined as Presentation | undefined,
    };

    return this.http.post<ResponseBase<Presentation>>(`${this.apiUrl}`, payload).pipe(
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
    payload: PresentationRequest,
  ): Observable<{ error: boolean; msg: string; data?: Presentation }> {
    const res = {
      error: true,
      msg: 'Error undefined',
      data: undefined as Presentation | undefined,
    };

    return this.http.put<ResponseBase<Presentation>>(`${this.apiUrl}/${id}`, payload).pipe(
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
    params: PresentationPaginationRequest,
  ): Observable<{ error: boolean; msg: string; data?: PageData<Presentation> }> {
    const res = {
      error: true,
      msg: 'Error undefined',
      data: undefined as PageData<Presentation> | undefined,
    };

    return this.http.post<ResponseBase<PageData<Presentation>>>(`${this.apiUrl}/page`, params).pipe(
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