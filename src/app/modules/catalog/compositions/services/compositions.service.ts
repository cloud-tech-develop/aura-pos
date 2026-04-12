import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CompositionsApiService } from './compositions-api.service';
import { Composition, CompositionRequest } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class CompositionsService {
  private compositionsApiService = inject(CompositionsApiService);

  getAll(): Observable<{ error: boolean; msg: string; data?: Composition[] }> {
    return this.compositionsApiService.getAll();
  }

  getById(id: string): Observable<{ error: boolean; msg: string; data?: Composition }> {
    return this.compositionsApiService.getById(id);
  }

  create(payload: CompositionRequest): Observable<{ error: boolean; msg: string; data?: Composition }> {
    return this.compositionsApiService.create(payload);
  }

  update(id: string, payload: CompositionRequest): Observable<{ error: boolean; msg: string; data?: Composition }> {
    return this.compositionsApiService.update(id, payload);
  }

  delete(id: string): Observable<{ error: boolean; msg: string }> {
    return this.compositionsApiService.delete(id);
  }
}