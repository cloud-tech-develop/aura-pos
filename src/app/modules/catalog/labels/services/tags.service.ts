import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TagsApiService } from './tags-api.service';
import { Product } from '@module-catalog/products/interfaces';

@Injectable({
  providedIn: 'root',
})
export class TagsService {
  private tagsApiService = inject(TagsApiService);

  getAllProducts(): Observable<{ error: boolean; msg: string; data?: Product[] }> {
    return this.tagsApiService.getAllProducts();
  }

  updateBarcode(
    id: number,
    barcode: string,
  ): Observable<{ error: boolean; msg: string; data?: Product }> {
    return this.tagsApiService.updateBarcode(id, barcode);
  }
}
