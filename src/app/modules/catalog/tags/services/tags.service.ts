import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TagsApiService } from './tags-api.service';
import { Tag, TagRequest } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class TagsService {
  private tagsApiService = inject(TagsApiService);

  getAll(): Observable<{ error: boolean; msg: string; data?: Tag[] }> {
    return this.tagsApiService.getAll();
  }

  getById(id: string): Observable<{ error: boolean; msg: string; data?: Tag }> {
    return this.tagsApiService.getById(id);
  }

  create(payload: TagRequest): Observable<{ error: boolean; msg: string; data?: Tag }> {
    return this.tagsApiService.create(payload);
  }

  update(id: string, payload: TagRequest): Observable<{ error: boolean; msg: string; data?: Tag }> {
    return this.tagsApiService.update(id, payload);
  }

  delete(id: string): Observable<{ error: boolean; msg: string }> {
    return this.tagsApiService.delete(id);
  }
}