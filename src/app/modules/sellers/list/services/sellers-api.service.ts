import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiConnectionService } from '@services/api-connection.service';
import { CreateSellerDto, Seller, UpdateSellerDto } from '../interfaces';

export class SellersApiService {
  private readonly http = inject(HttpClient);
  private apiConnection = inject(ApiConnectionService);

  get baseUrl(): string {
    return `${this.apiConnection.apiUrl()}/sellers`;
  }

  getAll(): Observable<Seller[]> {
    return this.http.get<Seller[]>(this.baseUrl);
  }

  getById(id: number): Observable<Seller> {
    return this.http.get<Seller>(`${this.baseUrl}/${id}`);
  }

  create(dto: CreateSellerDto): Observable<Seller> {
    return this.http.post<Seller>(this.baseUrl, dto);
  }

  update(id: number, dto: UpdateSellerDto): Observable<Seller> {
    return this.http.put<Seller>(`${this.baseUrl}/${id}`, dto);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
