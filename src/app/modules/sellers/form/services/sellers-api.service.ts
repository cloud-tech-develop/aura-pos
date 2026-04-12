import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '@environment/environment';
import { CreateSellerDto, Seller, UpdateSellerDto } from '../interfaces';

export class SellersApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = `${environment.API_URL}/sellers`;

  getById(id: number): Observable<Seller> {
    return this.http.get<Seller>(`${this.baseUrl}/${id}`);
  }

  create(dto: CreateSellerDto): Observable<Seller> {
    return this.http.post<Seller>(this.baseUrl, dto);
  }

  update(id: number, dto: UpdateSellerDto): Observable<Seller> {
    return this.http.put<Seller>(`${this.baseUrl}/${id}`, dto);
  }
}
