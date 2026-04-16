import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BrandsApiService } from './brands-api.service';
import { Brand, BrandRequest } from '../interfaces';
import { ListId, PageData, PageParams } from '@core/interfaces';

@Injectable({
  providedIn: 'root',
})
export class BrandsService {
  private brandsApiService = inject(BrandsApiService);

  list(): Observable<{ error: boolean; msg: string; data?: ListId[] }> {
    return this.brandsApiService.list();
  }

  getById(id: number): Observable<{ error: boolean; msg: string; data?: Brand }> {
    return this.brandsApiService.getById(id);
  }

  create(payload: BrandRequest): Observable<{ error: boolean; msg: string; data?: Brand }> {
    return this.brandsApiService.create(payload);
  }

  update(id: number, payload: BrandRequest): Observable<{ error: boolean; msg: string; data?: Brand }> {
    return this.brandsApiService.update(id, payload);
  }

  delete(id: number): Observable<{ error: boolean; msg: string }> {
    return this.brandsApiService.delete(id);
  }

  page(payload: PageParams<null>): Observable<{
    error: boolean;
    msg: string;
    data?: PageData<Brand>;
  }> {
    return this.brandsApiService.page(payload);
  }
}
