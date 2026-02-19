import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ClientsService } from './services/clients.service';

@Component({
  selector: 'app-clients',
  imports: [CommonModule],
  template: `
    <div class="clients-container">
      <div class="clients-header">
        <div>
          <h1 class="page-title">Clientes</h1>
          <p class="page-subtitle">Gestión de clientes del módulo de ventas</p>
        </div>
      </div>

      <div class="clients-list">
        <div *ngFor="let client of clients()" class="client-card">
          <div class="client-avatar">
            {{ client.name.charAt(0) }}
          </div>
          <div class="client-info">
            <h3>{{ client.name }}</h3>
            <p>{{ client.email }}</p>
            <span class="status-badge" [class.active]="client.status === 'active'">
              {{ client.status === 'active' ? 'Activo' : 'Inactivo' }}
            </span>
          </div>
          <div class="client-stats">
            <span class="purchase-amount">{{ '$' + client.totalPurchases.toLocaleString() }}</span>
            <span class="purchase-label">Total compras</span>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .clients-container {
        padding: 1.5rem;
      }

      .clients-header {
        margin-bottom: 1.5rem;
      }

      .page-title {
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--text-primary);
        margin: 0 0 0.25rem 0;
      }

      .page-subtitle {
        color: var(--text-secondary);
        font-size: 0.875rem;
        margin: 0;
      }

      .clients-list {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
        gap: 1rem;
      }

      .client-card {
        background: var(--surface-0);
        border: 1px solid var(--border-color);
        border-radius: 0.75rem;
        padding: 1rem;
        display: flex;
        align-items: center;
        gap: 1rem;
      }

      .client-avatar {
        width: 48px;
        height: 48px;
        border-radius: 50%;
        background: linear-gradient(135deg, var(--primary-500), var(--primary-700));
        color: white;
        display: flex;
        align-items: center;
        justify-content: center;
        font-weight: 600;
        font-size: 1.25rem;
      }

      .client-info {
        flex: 1;
      }

      .client-info h3 {
        margin: 0 0 0.25rem 0;
        font-size: 1rem;
        color: var(--text-primary);
      }

      .client-info p {
        margin: 0 0 0.5rem 0;
        font-size: 0.875rem;
        color: var(--text-secondary);
      }

      .status-badge {
        font-size: 0.75rem;
        padding: 0.25rem 0.5rem;
        border-radius: 9999px;
        background: var(--surface-200);
        color: var(--text-secondary);
      }

      .status-badge.active {
        background: rgba(34, 197, 94, 0.1);
        color: #22c55e;
      }

      .client-stats {
        text-align: right;
      }

      .purchase-amount {
        display: block;
        font-size: 1.25rem;
        font-weight: 700;
        color: var(--primary-600);
      }

      .purchase-label {
        font-size: 0.75rem;
        color: var(--text-secondary);
      }
    `,
  ],
})
export class ClientsComponent {
  private clientsService = inject(ClientsService);

  readonly clients = this.clientsService.clients;
}
