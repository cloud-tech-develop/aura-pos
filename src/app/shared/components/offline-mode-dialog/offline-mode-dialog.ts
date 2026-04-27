import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  signal,
  effect,
  OnDestroy,
} from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ApiConnectionService } from '@services/api-connection.service';

@Component({
  selector: 'app-offline-mode-dialog',
  imports: [CommonModule, ButtonModule, DialogModule, ToastModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './offline-mode-dialog.html',
  styleUrl: './offline-mode-dialog.css',
})
export class OfflineModeDialog implements OnDestroy {
  private apiConnection = inject(ApiConnectionService);
  private messageService = inject(MessageService);

  // Estado del semáforo
  private _connectionStatus = signal<'online' | 'offline' | 'checking'>('online');
  private _connectionMessage = signal<string>('Conectado');

  // Estado del diálogo
  isDialogVisible = signal(false);

  // Verificación periódica
  private checkInterval: ReturnType<typeof setInterval> | null = null;

  // Getters para los estados del ApiConnectionService
  private hasInternet = this.apiConnection.hasInternet;
  private isServerReachable = this.apiConnection.isServerReachable;
  private useOffline = this.apiConnection.useOffline;
  private isOnline = this.apiConnection.isOnline;

  // Exponer señales para el template
  connectionStatus = this._connectionStatus.asReadonly();
  connectionMessage = this._connectionMessage.asReadonly();

  constructor() {
    // Inicializar estado
    this.updateConnectionStatus();

    // Effect para actualizar estado cuando cambie
    effect(() => {
      this.updateConnectionStatus();

      // Iniciar/detener verificación periódica
      const useOffline = this.useOffline();
      const serverOk = this.isServerReachable();

      if (useOffline && serverOk && !this.checkInterval) {
        this.startPeriodicCheck();
      } else if ((!useOffline || !serverOk) && this.checkInterval) {
        this.stopPeriodicCheck();
      }
    });

    // Mostrar diálogo cuando sea necesario
    effect(() => {
      const showDialog = this.apiConnection.showReconnectDialog();
      this.isDialogVisible.set(showDialog);
    });

    // Iniciar verificación si está en modo offline con servidor disponible
    if (this.useOffline() && this.isServerReachable()) {
      this.startPeriodicCheck();
    }
  }

  private updateConnectionStatus(): void {
    const useOffline = this.useOffline();
    const isReachable = this.isServerReachable();
    const hasInternet = this.hasInternet();

    if (useOffline) {
      if (isReachable) {
        this._connectionStatus.set('offline');
        this._connectionMessage.set('Modo offline (servidor disponible)');
      } else {
        this._connectionStatus.set('offline');
        this._connectionMessage.set('Modo offline');
      }
    } else if (!hasInternet) {
      this._connectionStatus.set('offline');
      this._connectionMessage.set('Sin conexión a internet');
    } else if (!isReachable) {
      this._connectionStatus.set('offline');
      this._connectionMessage.set('Servidor no disponible');
    } else {
      this._connectionStatus.set('online');
      this._connectionMessage.set('Conectado');
    }
  }

  private startPeriodicCheck(): void {
    if (this.checkInterval) return;

    this.checkInterval = setInterval(() => {
      this.checkServerStatus();
    }, 60000); // Cada minuto
  }

  private stopPeriodicCheck(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  private async checkServerStatus(): Promise<void> {
    const wasOffline = this.useOffline();
    if (!wasOffline) return;

    // Verificar si el servidor principal ha vuelto
    const connected = await this.apiConnection.verifyConnectivity();

    if (connected) {
      // Actualizar estado
      this._connectionStatus.set('online');
      this._connectionMessage.set('Servidor disponible - Click para cambiar');

      // Mostrar toast de notificación
      this.messageService.add({
        severity: 'success',
        summary: 'Servidor disponible',
        detail: 'El servidor principal ha vuelto. ¿Deseas volver al modo online?',
        life: 10000,
      });
    }
  }

  // Métodos públicos
  toggleDialog(): void {
    this.isDialogVisible.update((v) => !v);
  }

  shouldShowGoOnlineButton(): boolean {
    const offline = this.useOffline();
    const serverOk = this.isServerReachable();
    return offline && serverOk;
  }

  // Propiedades del diálogo
  get dialogTitle(): string {
    const hasNet = this.hasInternet();
    const serverOk = this.isServerReachable();
    const offline = this.useOffline();

    if (offline && serverOk) return 'Modo Offline';
    if (!hasNet) return 'Sin conexión a internet';
    if (!serverOk) return 'Servidor no disponible';
    return 'Conexión perdida';
  }

  get dialogIcon(): string {
    const hasNet = this.hasInternet();
    const serverOk = this.isServerReachable();
    const offline = this.useOffline();

    if (offline) return 'pi pi-database';
    if (!hasNet) return 'pi pi-wifi-off';
    if (!serverOk) return 'pi pi-server';
    return 'pi pi-exclamation-triangle';
  }

  get dialogMessage(): string {
    const hasNet = this.hasInternet();
    const serverOk = this.isServerReachable();
    const offline = this.useOffline();

    if (offline && serverOk)
      return 'Estás usando el servidor offline. ¿Deseas volver al servidor principal?';
    if (!hasNet) return 'No hay conexión a internet. ¿Deseas usar la versión offline (localhost)?';
    if (!serverOk)
      return 'No se puede conectar al servidor principal. ¿Deseas usar la versión offline (localhost)?';
    return 'Se perdió la conexión. ¿Deseas usar la versión offline?';
  }

  get dialogInfo(): string {
    const offline = this.useOffline();
    const serverOk = this.isServerReachable();

    if (offline && serverOk) return 'El servidor principal está disponible.';
    if (offline) return 'Actualmente estás usando el modo offline.';
    return 'La versión offline usa datos locales.';
  }

  get canCloseDialog(): boolean {
    const hasNet = this.hasInternet();
    const offline = this.useOffline();
    const serverOk = this.isServerReachable();
    return hasNet || offline || serverOk;
  }

  shouldShowRetry(): boolean {
    const hasNet = this.hasInternet();
    const offline = this.useOffline();
    return hasNet && !offline;
  }

  shouldShowGoOnline(): boolean {
    const offline = this.useOffline();
    const serverOk = this.isServerReachable();
    return offline && serverOk;
  }

  get primaryButtonLabel(): string {
    return this.useOffline() ? 'Permanecer Offline' : 'Usar Offline';
  }

  // Acciones
  onPrimaryAction(): void {
    const offline = this.useOffline();
    if (offline) {
      this.apiConnection.dismissReconnectDialog();
    } else {
      this.apiConnection.enableOfflineMode();
      this.startPeriodicCheck();
    }
    this.updateConnectionStatus();
  }

  onGoOnline(event?: Event): void {
    event?.stopPropagation();
    this.onGoOnlineDialog();
  }

  onGoOnlineDialog(): void {
    this.apiConnection.resetOfflinePreference();
    this.stopPeriodicCheck();
    this.updateConnectionStatus();
    this.isDialogVisible.set(false);

    this.messageService.add({
      severity: 'success',
      summary: 'Cambiado a Online',
      detail: 'Ahora estás conectado al servidor principal',
    });
  }

  onRetry(): void {
    this.apiConnection.verifyConnectivity().then((connected) => {
      if (connected) {
        this.apiConnection.stayOnline();
        this.updateConnectionStatus();
      }
    });
  }

  onDismiss(): void {
    const offline = this.useOffline();
    const serverOk = this.isServerReachable();
    const hasNet = this.hasInternet();

    if (offline || serverOk || hasNet) {
      this.apiConnection.dismissReconnectDialog();
    }
  }

  ngOnDestroy(): void {
    this.stopPeriodicCheck();
  }
}
