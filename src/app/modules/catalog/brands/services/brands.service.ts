import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BrandsApiService } from './brands-api.service';
import { Brand, BrandRequest } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class BrandsService {
  private brandsApiService = inject(BrandsApiService);

  getAll(): Observable<{ error: boolean; msg: string; data?: Brand[] }> {
    return this.brandsApiService.getAll();
  }

  getById(id: string): Observable<{ error: boolean; msg: string; data?: Brand }> {
    return this.brandsApiService.getById(id);
  }

  create(payload: BrandRequest): Observable<{ error: boolean; msg: string; data?: Brand }> {
    return this.brandsApiService.create(payload);
  }

  update(id: string, payload: BrandRequest): Observable<{ error: boolean; msg: string; data?: Brand }> {
    return this.brandsApiService.update(id, payload);
  }

  delete(id: string): Observable<{ error: boolean; msg: string }> {
    return this.brandsApiService.delete(id);
  }
}