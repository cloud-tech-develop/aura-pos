import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { CategoriesApiService } from './categories-api.service';
import { Category, CategoryRequest } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class CategoriesService {
  private categoriesApiService = inject(CategoriesApiService);

  getAll(): Observable<{ error: boolean; msg: string; data?: Category[] }> {
    return this.categoriesApiService.getAll();
  }

  getById(id: string): Observable<{ error: boolean; msg: string; data?: Category }> {
    return this.categoriesApiService.getById(id);
  }

  create(payload: CategoryRequest): Observable<{ error: boolean; msg: string; data?: Category }> {
    return this.categoriesApiService.create(payload);
  }

  update(id: string, payload: CategoryRequest): Observable<{ error: boolean; msg: string; data?: Category }> {
    return this.categoriesApiService.update(id, payload);
  }

  delete(id: string): Observable<{ error: boolean; msg: string }> {
    return this.categoriesApiService.delete(id);
  }
}