import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ResponseBase } from '@core/interfaces';
import { environment } from '@environment/environment';
import { ApiConnectionService } from '@services/api-connection.service';
import { downloadFileFromBlob, httpErrorHandler } from '@shared/utils';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CommonService {
  private http = inject(HttpClient);
  private apiConnection = inject(ApiConnectionService);

  get apiUrl(): string {
    return this.apiConnection.apiUrl();
  }

  public downloadOffLineApi() {
    this.http.get(`${this.apiUrl}/download/offline-pos`, { responseType: 'blob' }).subscribe({
      next: (blob) => {
        downloadFileFromBlob(blob, 'aura-pos-offline.exe');
      },
      error: (err) => {
        console.error('Error al descargar', err);
      },
    });
  }

  public pingOffLineApi(): Observable<{ error: boolean; msg: string }> {
    const res = {
      error: true,
      msg: 'Api offline',
    };
    // Ping siempre al API offline local
    return this.http.get<ResponseBase<null>>(`${environment.API_OFFLINE}/offline/ping`).pipe(
      map((r) => {
        res.msg = r.message;
        if (!r.success) return res;
        res.error = false;
        return res;
      }),
      catchError(httpErrorHandler),
    );
  }
}
