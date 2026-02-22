import { inject, Injectable } from '@angular/core';
import { AuthApiService } from './auth-api.service';
import { LoginData, LoginRequest } from '../interfaces';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private authApiService = inject(AuthApiService);

  login(credentials: LoginRequest): Observable<{
    error: boolean;
    msg: string;
    data?: LoginData;
  }> {
    return this.authApiService.login(credentials);
  }
}
