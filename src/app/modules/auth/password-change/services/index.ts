import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ChangePasswordRequest, ChangePasswordResponse } from '../interfaces';

@Injectable({
  providedIn: 'root',
})
export class PasswordChangeService {
  private http = inject(HttpClient);
  private apiUrl = '/api/auth/change-password';

  changePassword(request: ChangePasswordRequest): Observable<ChangePasswordResponse | null> {
    return this.http.post<ChangePasswordResponse>(this.apiUrl, request).pipe(
      map((response) => response),
      catchError((error) => {
        console.warn('Password change failed:', error);
        return of(null);
      }),
    );
  }
}
