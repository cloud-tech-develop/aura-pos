import { inject, Injectable } from '@angular/core';
import { ApiConnectionService } from '@services/api-connection.service';

/**
 * Servicio base para los servicios API del módulo catalog.
 * Proporciona la URL base del API de forma dinámica según el estado de conexión.
 *
 * Extiende esta clase en los servicios API para obtener la URL correcta.
 */
@Injectable({ providedIn: 'root' })
export class CatalogApiBase {
  protected apiConnection = inject(ApiConnectionService);

  /**
   * Obtiene la URL base del API con el endpoint específico.
   * @param endpoint - Endpoint adicional (ej: '/catalog/products')
   */
  protected getApiUrl(endpoint: string = ''): string {
    return `${this.apiConnection.apiUrl()}${endpoint}`;
  }

  /**
   * Obtiene la URL del API de catalog.
   */
  protected get catalogUrl(): string {
    return this.getApiUrl('/catalog');
  }
}