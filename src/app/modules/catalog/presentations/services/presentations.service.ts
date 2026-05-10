import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  Presentation,
  PresentationRequest,
  PresentationPaginationRequest,
} from '../interfaces';
import { PageData } from '@core/interfaces';
import { PresentationsApiService } from './presentations-api.service';

@Injectable({
  providedIn: 'root',
})
export class PresentationsService {
  private apiService = inject(PresentationsApiService);

  getAll(): Observable<{ error: boolean; msg: string; data?: Presentation[] }> {
    return this.apiService.getAll();
  }

  getById(id: number): Observable<{ error: boolean; msg: string; data?: Presentation }> {
    return this.apiService.getById(id);
  }

  create(
    payload: PresentationRequest,
  ): Observable<{ error: boolean; msg: string; data?: Presentation }> {
    return this.apiService.create(payload);
  }

  update(
    id: number,
    payload: PresentationRequest,
  ): Observable<{ error: boolean; msg: string; data?: Presentation }> {
    return this.apiService.update(id, payload);
  }

  delete(id: number): Observable<{ error: boolean; msg: string }> {
    return this.apiService.delete(id);
  }

  page(
    params: PresentationPaginationRequest,
  ): Observable<{
    error: boolean;
    msg: string;
    data?: PageData<Presentation>;
  }> {
    return this.apiService.page(params);
  }
}
