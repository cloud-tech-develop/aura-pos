import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UnitsApiService } from './units-api.service';
import { Unit, UnitRequest } from '../interfaces';
import { ListId, PageData, PageParams } from '@core/interfaces';

@Injectable({
  providedIn: 'root',
})
export class UnitsService {
  private unitsApiService = inject(UnitsApiService);

  list(): Observable<{ error: boolean; msg: string; data?: ListId[] }> {
    return this.unitsApiService.list();
  }

  getById(id: number): Observable<{ error: boolean; msg: string; data?: Unit }> {
    return this.unitsApiService.getById(id);
  }

  create(payload: UnitRequest): Observable<{ error: boolean; msg: string; data?: Unit }> {
    return this.unitsApiService.create(payload);
  }

  update(id: number, payload: UnitRequest): Observable<{ error: boolean; msg: string; data?: Unit }> {
    return this.unitsApiService.update(id, payload);
  }

  delete(id: number): Observable<{ error: boolean; msg: string }> {
    return this.unitsApiService.delete(id);
  }

  page(payload: PageParams<null>): Observable<{
    error: boolean;
    msg: string;
    data?: PageData<Unit>;
  }> {
    return this.unitsApiService.page(payload);
  }
}
