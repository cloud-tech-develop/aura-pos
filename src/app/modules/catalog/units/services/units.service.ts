import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UnitsApiService } from './units-api.service';
import { Unit, UnitRequest } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class UnitsService {
  private unitsApiService = inject(UnitsApiService);

  getAll(): Observable<{ error: boolean; msg: string; data?: Unit[] }> {
    return this.unitsApiService.getAll();
  }

  getById(id: string): Observable<{ error: boolean; msg: string; data?: Unit }> {
    return this.unitsApiService.getById(id);
  }

  create(payload: UnitRequest): Observable<{ error: boolean; msg: string; data?: Unit }> {
    return this.unitsApiService.create(payload);
  }

  update(id: string, payload: UnitRequest): Observable<{ error: boolean; msg: string; data?: Unit }> {
    return this.unitsApiService.update(id, payload);
  }

  delete(id: string): Observable<{ error: boolean; msg: string }> {
    return this.unitsApiService.delete(id);
  }
}