import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginData, LoginRequest } from '../interfaces';
import { catchError, map, Observable } from 'rxjs';
import { httpErrorHandler } from '@shared/utils';
import { environment } from '@environment/environment';

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
  private apiUrl = environment.API_URL;

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
