import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginData, LoginRequest, LoginResponse } from '../interfaces';
import { catchError, map, Observable } from 'rxjs';
import { httpErrorHandler } from '@shared/utils';
import { environment } from '@environment/environment';

@Injectable({
  providedIn: 'root',
})
export class AuthApiService {
  private http = inject(HttpClient);
  private apiUrl = environment.API_URL;

  login(credentials: LoginRequest): Observable<{
    error: boolean;
    msg: string;
    data?: LoginData;
  }> {
    const res = {
      error: true,
      msg: 'Error undefined',
      data: undefined as LoginData | undefined,
    };
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, credentials).pipe(
      map((r) => {
        res.msg = r.message;
        if (r.error) {
          return res;
        }

        res.data = r.data;
        res.error = false;
        return res;
      }),
      catchError(httpErrorHandler),
    );
  }
}
