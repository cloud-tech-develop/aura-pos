# Sistema de Modo Offline Automático

Este documento explica cómo funciona el sistema de detección de conectividad y cambio automático a API offline en Aura POS.

## Introducción

Aura POS puede funcionar contra dos servidores API diferentes:

1. **API Principal** (`environment.API_URL`) - Servidor de producción en la nube
2. **API Offline** (`environment.API_OFFLINE`) - Servidor local en `localhost:8091`

El sistema detecta automáticamente cuando hay pérdida de conexión y permite al usuario cambiar al modo offline sin perder funcionalidad.

## Arquitectura

### Componentes Principales

```
┌─────────────────────────────────────────────────────────────┐
│                    ApiConnectionService                     │
│  (src/app/services/api-connection.service.ts)              │
├─────────────────────────────────────────────────────────────┤
│  Señales:                                                 │
│  - hasInternet: boolean    → Estado de conexión a internet    │
│  - isServerReachable: boolean → Estado del servidor principal│
│  - useOffline: boolean   → Si está usando API offline       │
│  - showReconnectDialog: boolean → Mostrar diálogo de reconexión│
│  - apiUrl: string     → URL dinámica según el modo      │
├─────────────────────────────────────────────────────────────┤
│  Métodos:                                                 │
│  - checkConnectivity() → Verifica conexión al servidor     │
│  - enableOfflineMode() → Activa modo offline              │
│  - stayOnline()       → Permanece en modo online        │
│  - verifyConnectivity() → Verificación inmediata       │
│  - handleNetworkError() → Maneja errores de red        │
└─────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────┐
│                  OfflineModeDialog                         │
│  (src/app/shared/components/offline-mode-dialog/)         │
├─────────────────────────────────────────────────────────────┤
│  Muestra alertas contextuales según el tipo de caída:          │
│  - Sin internet        → "Sin conexión a internet"        │
│  - Servidor caído     → "Servidor no disponible"          │
│  - Error genérico   → "Conexión perdida"                  │
└─────────────────────────────────────────────────────────────┘
```

## Cómo Funciona la Detección

### 1. Detección de Internet (Navegador)

```typescript
// ApiConnectionService
window.addEventListener('online', updateOnlineStatus);
window.addEventListener('offline', updateOnlineStatus);
```

El navegador detecta automáticamente cuando se pierde la conexión a internet.

### 2. Detección de Servidor (HTTP)

```typescript
// Ping al servidor cada 30 segundos
checkConnectivity(): Observable<boolean> {
  return this.http.get(`${environment.API_URL}/ping`, {
    observe: 'response',
    timeout: 5000,
  });
}
```

### 3. Effect Reactivo

```typescript
effect(() => {
  const hasInternet = this._hasInternet();
  const serverReachable = this._isServerReachable();
  const showDialog = this._showReconnectDialog();
  const offlineChosen = this._offlineModeChosen();

  if (!offlineChosen && !hasInternet && !showDialog) {
    this._showReconnectDialog.set(true);
  }
});
```

## Flujo de Detección Automática

```
┌──────────────────┐
│  App Inicia       │
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────┐
│  setupNetworkListener()         │
│  - Escucha 'online'           │
│  - Escucha 'offline'         │
└────────┬───────────────────┘
         │
         ▼
┌──────────────────────────────┐
│  startPeriodicCheck()          │
│  - Verifica cada 30s         │
│  - Solo si no hay offline    │
└────────┬───────────────────┘
         │
         ▼
    ┌────────────────────────────────────────────┐
    │  Evento: 'offline' o error de HTTP        │
    └──────────────┬───────────────────────────┘
                 │
                 ▼
    ┌────────────────────────────────────────────┐
    │  _showReconnectDialog.set(true)           │
    └──────────────┬───────────────────────────┘
                 │
                 ▼
    ┌────────────────────────────────────────────┐
    │  OfflineModeDialog se muestra            │
    │  └── Opción: Usar Offline / Reintentar    │
    └────────────────────────────────────────────┘
```

## Uso en Servicios API

### Patrón 1: Extender CatalogApiBase (Módulo Catalog)

```typescript
// src/app/modules/catalog/services/catalog-api-base.service.ts
import { inject, Injectable } from '@angular/core';
import { ApiConnectionService } from '@services/api-connection.service';

@Injectable({ providedIn: 'root' })
export class CatalogApiBase {
  protected apiConnection = inject(ApiConnectionService);

  protected getApiUrl(endpoint: string = ''): string {
    return `${this.apiConnection.apiUrl()}${endpoint}`;
  }

  protected get catalogUrl(): string {
    return this.getApiUrl('/catalog');
  }
}
```

```typescript
// Ejemplo: products-api.service.ts
import { CatalogApiBase } from '../../services/catalog-api-base.service';

@Injectable({ providedIn: 'root' })
export class ProductsApiService extends CatalogApiBase {
  private http = inject(HttpClient);

  // Getter dinámico que siempre retorna la URL correcta
  get apiUrl(): string {
    return this.catalogUrl + '/products';
  }

  getAll(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/all`);
  }
}
```

### Patrón 2: Inyectar ApiConnectionService Directamente

```typescript
// En cualquier servicio
import { inject, Injectable } from '@angular/core';
import { ApiConnectionService } from '@services/api-connection.service';

@Injectable({ providedIn: 'root' })
export class MyService {
  private apiConnection = inject(ApiConnectionService);

  get apiUrl(): string {
    return `${this.apiConnection.apiUrl()}/mi-endpoint`;
  }

  fetchData(): Observable<Data> {
    // Automatically usa la URL correcta según el modo
    return this.http.get<Data>(`${this.apiUrl}`);
  }
}
```

### URLs por Defecto

| Variable | Valor en Desarrollo | Valor en Producción |
|----------|-----------------|------------------|
| `API_URL` | `http://localhost:8081` | Configurado en environment |
| `API_OFFLINE` | `http://localhost:8091` | Configurado en environment |

## Persistencia

La preferencia del usuario se guarda en localStorage:

```typescript
// Guardar preferencia
localStorage.setItem('aura_use_offline', 'true'); // o 'false'

// Restaurar preferencia
const savedPreference = localStorage.getItem('aura_use_offline');
```

Esto significa que si el usuario elige "Usar Offline", la app-recordará esa elección para futuras sesiones.

## Diálogo de Reconexión

### Estados del Diálogo

| Estado | Título | Icono | Acción Recomendada |
|--------|-------|------|------|-------------------|
| Sin internet | "Sin conexión a internet" | `pi pi-wifi-off` | Usar Offline |
| Servidor caído | "Servidor no disponible" | `pi pi-server` | Usar Offline o Reintentar |
| Conexión perdida | "Conexión perdida" | `pi pi-exclamation-triangle` | Reintentar |

### Botones

- **Reintentar**: Verifica conectividad inmediatamente
- **Usar Offline**: Cambia a API local y guarda preferencia
- **Permanecer Offline**: Se mantiene en modo offline

## Configuración de Tiempos

```typescript
// En ApiConnectionService
private readonly CHECK_INTERVAL = 30000; // 30 segundos
private readonly TIMEOUT = 5000;       // 5 segundos
```

## translations

El sistema incluye traducciones para español e inglés:

```json
// es.json / en.json
{
  "OFFLINE": {
    "DIALOG": {
      "TITLE": "Conexión perdida",
      "NO_INTERNET": "Sin conexión a internet",
      "SERVER_UNAVAILABLE": "Servidor no disponible",
      "MESSAGE": "No se puede conectar al servidor principal...",
      "INFO": "La versión offline usa datos locales.",
      "USE_OFFLINE": "Usar Offline",
      "RETRY": "Reintentar"
    }
  }
}
```

## Integración con la App

### 1. Incluir el Diálogo en app.component.html

```html
<!-- app.html -->
<router-outlet />
<app-offline-mode-dialog />
```

### 2. Importar en app.component.ts

```typescript
// app.ts
import { OfflineModeDialog } from '@shared/components/offline-mode-dialog/offline-mode-dialog';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, OfflineModeDialog],
  // ...
})
export class App { }
```

### 3. Inicializar en app.config.ts (Opcional)

```typescript
// app.config.ts
// El servicio se inicializa automáticamente como singleton
export const appConfig: ApplicationConfig = {
  providers: [
    // No es necesario agregar nada
    // ApiConnectionService ya es providedIn: 'root'
  ],
};
```

## Casos de Uso

### Caso 1: Sin Internet

```
Usuario conecta a WiFi sin internet → Navegador detecta 'offline'
→ _hasInternet.set(false) → Effect muestra diálogo
→ Usuario elige "Usar Offline"
→ _useOffline.set(true) + localStorage
→ Todos los servicios usan API_OFFLINE
```

### Caso 2: Servidor Caído

```
Usuario tiene internet pero servidor caído → Ping falla (timeout)
→ _isServerReachable.set(false) → Diálogo mostrado
→ Usuario elige "Usar Offline"
→ Cambio automático a API local
```

### Caso 3: Servidor Vuelve

```
Usuario en modo offline → Servidor vuelve
→ Verificación periódica exitosa
→ _isServerReachable.set(true)
→ Diálogo actualizado (opcional)
→ Usuario puede elegir "Volver a Online"
```

## Métodos del ApiConnectionService

### checkConnectivity()

Verifica si el servidor principal responde.

```typescript
const isConnected = await apiConnection.checkConnectivity().toPromise();
if (!isConnected) {
  // Mostrar opciones al usuario
}
```

### verifyConnectivity()

Verificación inmediata con retorno de promesa.

```typescript
const connected = await apiConnection.verifyConnectivity();
if (connected) {
  apiConnection.stayOnline();
}
```

### enableOfflineMode()

Activa el modo offline y guarda preferencia.

```typescript
apiConnection.enableOfflineMode();
// Ahora apiUrl() retorna API_OFFLINE
```

### stayOnline()

Permanece en modo online y cierra el diálogo.

```typescript
apiConnection.stayOnline();
```

### handleNetworkError()

Maneja errores de red desde interceptors.

```typescript
// En un HttpInterceptorFn
export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  return next(req).pipe(
    catchError((error) => {
      apiConnection.handleNetworkError();
      return throwError(() => error);
    })
  );
};
```

## Mantenimiento

### Agregar Verificación en Login

```typescript
// En el componente de login
async ngOnInit() {
  const connected = await this.apiConnection.verifyConnectivity();
  if (!connected) {
    this.showOfflineOption = true;
  }
}
```

### Verificar Conectividad Manualmente

```typescript
// Botón de "Verificar Conexión"
async verifyConnection() {
  const connected = await this.apiConnection.verifyConnectivity();
  this.messageService.add({
    severity: connected ? 'success' : 'warn',
    summary: connected ? 'Conectado' : 'Sin conexión',
  });
}
```

### Cambiar Intervalo de Verificación

```typescript
// En api-connection.service.ts
private readonly CHECK_INTERVAL = 60000; // 1 minuto
```

## Errores Comunes

### 1. Error de CORS

Si el servidor local no tiene CORS configurado:

```
Access to XMLHttpRequest has been blocked by CORS policy
```

**Solución**: Configurar CORS en el servidor backend.

### 2. Puerto Incorrecto

Verificar que el puerto en `environment.API_OFFLINE` coincida con el servidor:

```
// environment.ts
API_OFFLINE: 'http://localhost:8091' // Verificar puerto
```

### 3. Timeout Muy Corto

Si hay conexiones lentas, aumentar el timeout:

```typescript
// En checkConnectivity()
timeout: 10000, // 10 segundos
```

## Pruebas

### Probar Sin Internet

1. Desconectar cable de red / WiFi
2. Ver que aparezca el diálogo
3. Elegir "Usar Offline"
4. Verificar que las запросas usen API_OFFLINE

### Probar Servidor Caído

1. Apagar el servidor principal
2. Esperar ~30 segundos
3. Ver que aparezca el diálogo
4. Elegir "Usar Offline"

### Probar Reconexión

1. Estar en modo offline
2. Iniciar servidor principal
3. Elegir "Volver a Online" (si hay opción)

## Referencias

- **ApiConnectionService**: `src/app/services/api-connection.service.ts`
- **OfflineModeDialog**: `src/app/shared/components/offline-mode-dialog/`
- **CatalogApiBase**: `src/app/modules/catalog/services/catalog-api-base.service.ts`
- **Environment**: `src/environments/environment.ts`

## Changelog

### v1.0.0 - Sistema Inicial

- Detección de internet via Navigator
- Verificación periódica de servidor
- Diálogo de reconexión contextual
- Persistencia en localStorage
- Soporte para todos los servicios del catálogo