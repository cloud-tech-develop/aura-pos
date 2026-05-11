import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CompositionsApiService } from './compositions-api.service';
import {
  Composition,
  CreateCompositionRequest,
  UpdateCompositionRequest,
} from '../interfaces';
import { PageData, PageParams } from '@core/interfaces';

@Injectable({
  providedIn: 'root',
})
export class CompositionsService {
  private apiService = inject(CompositionsApiService);

  getById(
    id: number,
  ): Observable<{ error: boolean; msg: string; data?: Composition }> {
    return this.apiService.getById(id);
  }

  create(
    payload: CreateCompositionRequest,
  ): Observable<{ error: boolean; msg: string; data?: Composition }> {
    return this.apiService.create(payload);
  }

  update(
    id: number,
    payload: UpdateCompositionRequest,
  ): Observable<{ error: boolean; msg: string; data?: Composition }> {
    return this.apiService.update(id, payload);
  }

  delete(id: number): Observable<{ error: boolean; msg: string }> {
    return this.apiService.delete(id);
  }

  page(
    payload: PageParams<null>,
  ): Observable<{
    error: boolean;
    msg: string;
    data?: PageData<Composition>;
  }> {
    return this.apiService.page(payload);
  }
}
