import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal, computed, PLATFORM_ID, effect, OnDestroy } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '@environment/environment';
import { catchError, map, Observable, of, Subject, interval, takeUntil } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ApiConnectionService implements OnDestroy {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private destroy$ = new Subject<void>();

  // Señal para determinar si estamos en modo offline (usa API local)
  private _useOffline = signal<boolean>(false);

  // Señal para determinar si el servidor principal está disponible
  private _isServerReachable = signal<boolean>(true);

  // Señal para determinar si hay conexión a internet
  private _hasInternet = signal<boolean>(true);

  // Señal para mostrar el diálogo de reconexión
  private _showReconnectDialog = signal<boolean>(false);

  // Señal que indica si el modo offline fue elegido explícitamente por el usuario
  private _offlineModeChosen = signal<boolean>(false);

  // Señal para saber si ya se verificó la conectividad al iniciar
  private _initialCheckDone = signal<boolean>(false);

  // Intervalo de verificación (en ms)
  private readonly CHECK_INTERVAL = 30000; // 30 segundos

  // Computed: URL actual del API según el modo
  readonly apiUrl = computed(() =>
    this._useOffline() ? environment.API_OFFLINE : environment.API_URL
  );

  // Estado actual (público)
  readonly useOffline = this._useOffline.asReadonly();
  readonly isServerReachable = this._isServerReachable.asReadonly();
  readonly hasInternet = this._hasInternet.asReadonly();
  readonly showReconnectDialog = this._showReconnectDialog.asReadonly();
  readonly offlineModeChosen = this._offlineModeChosen.asReadonly();
  readonly isOnline = computed(() => this._hasInternet() && this._isServerReachable());

  // Effect para mostrar el diálogo cuando hay pérdida de conexión
  private connectionEffectInitialized = false;

  constructor() {
    if (isPlatformBrowser(this.platformId)) {
      this.init();
    }
  }

  private init(): void {
    // Restaurar preferencia del usuario desde localStorage
    const savedPreference = localStorage.getItem('aura_use_offline');
    if (savedPreference === 'true') {
      this._useOffline.set(true);
      this._offlineModeChosen.set(true);
    }

    // Escuchar eventos de online/offline del navegador
    this.setupNetworkListener();

    // Efecto para mostrar diálogo cuando hay pérdida de conexión
    effect(() => {
      const hasInternet = this._hasInternet();
      const serverReachable = this._isServerReachable();
      const showDialog = this._showReconnectDialog();
      const offlineChosen = this._offlineModeChosen();

      // Solo mostrar si no ha elegido offline y hay problemas de conexión
      if (!offlineChosen && !hasInternet && !showDialog) {
        this._showReconnectDialog.set(true);
      } else if (!offlineChosen && hasInternet && serverReachable && showDialog) {
        this._showReconnectDialog.set(false);
      }
    });

    this.connectionEffectInitialized = true;

    // Verificar conectividad inicial
    this.checkConnectivity();

    // Iniciar verificación periódica
    this.startPeriodicCheck();
  }

  private setupNetworkListener(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const updateOnlineStatus = (): void => {
      const isOnline = navigator.onLine;
      this._hasInternet.set(isOnline);

      if (!isOnline && !this._offlineModeChosen()) {
        this._showReconnectDialog.set(true);
      }
    };

    window.addEventListener('online', updateOnlineStatus);
    window.addEventListener('offline', updateOnlineStatus);

    // Estado inicial
    updateOnlineStatus();
  }

  private startPeriodicCheck(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    interval(this.CHECK_INTERVAL)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        // Solo verificar si no estamos en modo offline elegido por el usuario
        if (!this._offlineModeChosen()) {
          this.checkConnectivity();
        }
      });
  }

  /**
   * Verifica la conectividad con el servidor principal
   */
  checkConnectivity(): Observable<boolean> {
    // Si ya eligió offline, no verificar
    if (this._offlineModeChosen()) {
      this._isServerReachable.set(true);
      return of(true);
    }

    return this.http
      .get<ResponseBase<null>>(`${environment.API_URL}/ping`, {
        observe: 'response',
        timeout: 5000,
      })
      .pipe(
        map((response) => {
          const isConnected = response.status === 200;
          this._isServerReachable.set(isConnected);
          return isConnected;
        }),
        catchError(() => {
          this._isServerReachable.set(false);
          // Mostrar diálogo de reconexión si no está activo
          if (!this._offlineModeChosen() && !this._showReconnectDialog()) {
            this._showReconnectDialog.set(true);
          }
          return of(false);
        })
      );
  }

  /**
   * Verifica conectividad inmediatamente
   */
  async verifyConnectivity(): Promise<boolean> {
    return this.checkConnectivity().toPromise() as Promise<boolean>;
  }

  /**
   * Intenta verificar conectividad y pregunta al usuario si desea usar modo offline
   * Solo pregunta una vez por sesión
   */
  async promptOfflineMode(): Promise<boolean> {
    // Si ya eligió offline, no preguntar de nuevo
    if (this._offlineModeChosen()) {
      return this._useOffline();
    }

    const isConnected = await this.checkConnectivity().toPromise();

    if (!isConnected) {
      this._showReconnectDialog.set(true);
    }

    return this._useOffline();
  }

  /**
   * El usuario confirma usar la versión offline
   */
  enableOfflineMode(): void {
    this._useOffline.set(true);
    this._offlineModeChosen.set(true);
    this._showReconnectDialog.set(false);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('aura_use_offline', 'true');
    }
  }

  /**
   * El usuario decide quedarse en modo online aunque hay problemas
   */
  stayOnline(): void {
    this._useOffline.set(false);
    this._showReconnectDialog.set(false);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('aura_use_offline', 'false');
    }
  }

  /**
   * Cerrar el diálogo de reconexión
   */
  dismissReconnectDialog(): void {
    if (!this._offlineModeChosen()) {
      this._showReconnectDialog.set(false);
    }
  }

  /**
   * Restablecer la preferencia de modo offline (para testing o manualmente)
   */
  resetOfflinePreference(): void {
    this._useOffline.set(false);
    this._offlineModeChosen.set(false);

    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('aura_use_offline');
    }

    // Verificar conectividad después de restablecer
    this.checkConnectivity();
  }

  /**
   * Detectar cuando hay error de red y ofrecer cambio a offline
   */
  handleNetworkError(): boolean {
    // Si ya estamos en offline, no hacer nada
    if (this._useOffline()) {
      return false;
    }

    // El servidor está caido, ofrecer offline
    this._isServerReachable.set(false);
    this._showReconnectDialog.set(true);

    return false;
  }

  /**
   * Retryrequest con servidor alternativo
   * Ejecuta el request con el API offline si el principal falla
   */
  retryWithOffline<T>(request: () => Observable<T>): Observable<T> {
    return new Observable((subscriber) => {
      this.checkConnectivity().subscribe({
        next: (isConnected) => {
          if (isConnected) {
            // Ejecutar request normal
            request().subscribe(subscriber);
          } else {
            // Cambiar a offline y reintentar
            this.enableOfflineMode();
            request().subscribe(subscriber);
          }
        },
        error: () => {
          this.enableOfflineMode();
          request().subscribe(subscriber);
        },
      });
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}

interface ResponseBase<T> {
  success: boolean;
  message: string;
  data: T;
}