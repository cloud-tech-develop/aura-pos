import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ProductsApiService } from '@module-catalog/products/services/products-api.service';
import { Product, ProductRequest } from '@module-catalog/products/interfaces';

@Injectable({
  providedIn: 'root',
})
export class TagsApiService {
  private productsApi = inject(ProductsApiService);

  getAllProducts(): Observable<{ error: boolean; msg: string; data?: Product[] }> {
    return this.productsApi.getAll();
  }

  updateBarcode(
    id: number,
    barcode: string,
  ): Observable<{ error: boolean; msg: string; data?: Product }> {
    const payload: Partial<ProductRequest> = { barcode };
    return this.productsApi.update(id, payload as ProductRequest);
  }
}
