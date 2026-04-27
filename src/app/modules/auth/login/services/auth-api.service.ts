import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginData, LoginRequest } from '../interfaces';
import { catchError, map, Observable } from 'rxjs';
import { httpErrorHandler } from '@shared/utils';
import { ApiConnectionService } from '@services/api-connection.service';

interface LoginResponse {
  data: LoginData;
  message: string;
  success: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private http = inject(HttpClient);
  private apiConnection = inject(ApiConnectionService);

  get apiUrl(): string {
    return this.apiConnection.apiUrl();
  }

  login(credentials: LoginRequest): Observable<{
    msg: string;
    data?: LoginData;
  }> {
    const res = {
      msg: 'Error undefined',
      data: undefined as LoginData | undefined,
    };
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      map((r) => {
        res.msg = r.message;
        if (!r.success) {
          return res;
        }

        res.data = r.data;
        return res;
      }),
      catchError(httpErrorHandler),
    );
  }
}
