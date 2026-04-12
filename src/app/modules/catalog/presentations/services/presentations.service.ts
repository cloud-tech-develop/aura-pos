import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PresentationsApiService } from './presentations-api.service';
import { Presentation, PresentationRequest } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class PresentationsService {
  private presentationsApiService = inject(PresentationsApiService);

  getAll(): Observable<{ error: boolean; msg: string; data?: Presentation[] }> {
    return this.presentationsApiService.getAll();
  }

  getById(id: string): Observable<{ error: boolean; msg: string; data?: Presentation }> {
    return this.presentationsApiService.getById(id);
  }

  create(payload: PresentationRequest): Observable<{ error: boolean; msg: string; data?: Presentation }> {
    return this.presentationsApiService.create(payload);
  }

  update(id: string, payload: PresentationRequest): Observable<{ error: boolean; msg: string; data?: Presentation }> {
    return this.presentationsApiService.update(id, payload);
  }

  delete(id: string): Observable<{ error: boolean; msg: string }> {
    return this.presentationsApiService.delete(id);
  }
}