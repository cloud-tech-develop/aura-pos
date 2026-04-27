import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { ChangeDetectionStrategy, Component, OnInit, effect, inject } from '@angular/core';
import { CommonService } from '@services/index';
import { AppStore } from '@store/app.store';
import { MenuItem, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { SpeedDialModule } from 'primeng/speeddial';
import { ToastModule } from 'primeng/toast';

@Component({
  selector: 'app-header-options',
  imports: [ButtonModule, SpeedDialModule, ToastModule, CommonModule],
  styleUrl: './header-options.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './header-options.html',
})
export class HeaderOptions {
  items: MenuItem[] = [];
  private messageService = inject(MessageService);
  private commonService = inject(CommonService);
  private appStore = inject(AppStore);

  constructor() {
    effect(() => {
      const isConnected = this.appStore.isLocalConnected();
      this.items = this.createItems(isConnected);
    });
  }

  ngOnInit() {
    this.onPingOffLineApi();
    this.items = [
      {
        visible: false,
        label: 'Comentarios',
        icon: 'pi pi-comments',
        command: () => {
          this.messageService.add({
            severity: 'info',
            summary: 'Comentarios',
            detail: 'Data Added',
          });
        },
      },
      {
        label: 'Actualizar',
        icon: 'pi pi-refresh',
        command: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Actualizar',
            detail: 'Data Updated',
          });
        },
      },
    ];
  }

  private createItems(isConnected: boolean) {
    const itemComentary: MenuItem = {
      visible: false,
      label: 'Comentarios',
      icon: 'pi pi-comments',
      command: () => {
        this.messageService.add({
          severity: 'info',
          summary: 'Comentarios',
          detail: 'Data Added',
        });
      },
    };
    const itemUpdate: MenuItem = {
      label: 'Actualizar',
      icon: 'pi pi-refresh',
      command: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Actualizar',
          detail: 'Data Updated',
        });
      },
    };

    const itemUpdateLocal: MenuItem = {
      label: 'Actualizar Local',
      icon: 'pi pi-refresh',
      command: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Actualizar',
          detail: 'Data Updated',
        });
      },
    };

    const itemPingOffLineApi: MenuItem = {
      label: 'Ping',
      icon: 'pi pi-cloud-upload',
      command: () => {
        this.commonService.pingOffLineApi().subscribe((r) => console.log(r));
      },
    };

    return [
      itemComentary,
      itemUpdate,
      isConnected ? itemUpdateLocal : null,
      itemPingOffLineApi,
    ].filter((item) => item !== null);
  }

  onPingOffLineApi() {
    this.commonService.pingOffLineApi().subscribe((res) => {
      this.appStore.setLocalConnected(!res.error);
    });
  }
}
