import { inject, Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoriesApiService } from './categories-api.service';
import { Category, CategoryRequest } from '../interfaces';
import { ListId, PageData, PageParams } from '@core/interfaces';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private categoriesApiService = inject(CategoriesApiService);

  list(): Observable<{ error: boolean; msg: string; data?: ListId[] }> {
    return this.categoriesApiService.list();
  }

  getById(id: number): Observable<{ error: boolean; msg: string; data?: Category }> {
    return this.categoriesApiService.getById(id);
  }

  create(payload: CategoryRequest): Observable<{ error: boolean; msg: string; data?: Category }> {
    return this.categoriesApiService.create(payload);
  }

  update(
    id: number,
    payload: CategoryRequest,
  ): Observable<{ error: boolean; msg: string; data?: Category }> {
    return this.categoriesApiService.update(id, payload);
  }

  delete(id: number): Observable<{ error: boolean; msg: string }> {
    return this.categoriesApiService.delete(id);
  }

  page(payload: PageParams<null>): Observable<{
    error: boolean;
    msg: string;
    data?: PageData<Category>;
  }> {
    return this.categoriesApiService.page(payload);
  }
}
