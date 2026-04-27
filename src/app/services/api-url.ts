import { environment } from '@environment/environment';

/**
 * Utilidades para obtener la URL del API según el modo de conexión.
 *
 * Para usar con el ApiConnectionService (recomendado):
 * ```typescript
 * import { ApiConnectionService } from '@services/api-connection.service';
 *
 * @Injectable({ providedIn: 'root' })
 * class MyService {
 *   private apiConnection = inject(ApiConnectionService);
 *
 *   get apiUrl() {
 *     return this.apiConnection.apiUrl() + '/recurso';
 *   }
 * }
 * ```
 */

/**
 * Obtiene la URL del API de producción (servidor principal)
 * Útil para verificar conectividad
 */
export function getProductionApiUrl(): string {
  return environment.API_URL;
}

/**
 * Obtiene la URL del API offline (localhost)
 */
export function getOfflineApiUrl(): string {
  return environment.API_OFFLINE;
}

/**
 * Obtiene la URL base del API según el modo de conexión.
 * NOTE: Esta función retorna la URL base estática.
 * Para una implementación completa con Signals, injecta ApiConnectionService.
 */
export function getApiUrl(): string {
  return environment.API_URL;
}