import { Injectable, signal } from '@angular/core';
import { Client } from '../interfaces/client.interface';

@Injectable({
  providedIn: 'root'
})
export class ClientsService {
  readonly clients = signal<Client[]>([
    { id: 1, name: 'Juan Pérez', email: 'juan@example.com', phone: '+52 555 123 4567', totalPurchases: 2450, status: 'active' },
    { id: 2, name: 'María García', email: 'maria@example.com', phone: '+52 555 987 6543', totalPurchases: 1890, status: 'active' },
    { id: 3, name: 'Carlos López', email: 'carlos@example.com', phone: '+1 555 456 7890', totalPurchases: 750, status: 'inactive' },
  ]);
  
  getActiveClients(): Client[] {
    return this.clients().filter(c => c.status === 'active');
  }
  
  getClientById(id: number): Client | undefined {
    return this.clients().find(c => c.id === id);
  }
}
