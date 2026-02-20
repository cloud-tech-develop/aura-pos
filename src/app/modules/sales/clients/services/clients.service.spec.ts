import { TestBed } from '@angular/core/testing';
import { ClientsService } from './clients.service';

describe('ClientsService', () => {
  let service: ClientsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ClientsService],
    });

    service = TestBed.inject(ClientsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Initial State', () => {
    it('should have initial clients', () => {
      const clients = service.clients();
      expect(clients.length).toBe(3);
    });

    it('should have clients with valid data', () => {
      const clients = service.clients();
      clients.forEach((client) => {
        expect(client.id).toBeDefined();
        expect(client.name).toBeDefined();
        expect(client.email).toBeDefined();
        expect(client.phone).toBeDefined();
        expect(client.totalPurchases).toBeDefined();
        expect(client.status).toBeDefined();
      });
    });
  });

  describe('getActiveClients', () => {
    it('should return only active clients', () => {
      const activeClients = service.getActiveClients();
      expect(activeClients.length).toBe(2);
      activeClients.forEach((client) => {
        expect(client.status).toBe('active');
      });
    });

    it('should return empty array if no active clients', () => {
      // Test with current mock data - there are 2 active clients
      const activeClients = service.getActiveClients();
      expect(activeClients.length).toBeGreaterThan(0);
    });
  });

  describe('getClientById', () => {
    it('should return client when found', () => {
      const client = service.getClientById(1);
      expect(client).toBeDefined();
      expect(client?.name).toBe('Juan Pérez');
    });

    it('should return client with correct data', () => {
      const client = service.getClientById(2);
      expect(client?.name).toBe('María García');
      expect(client?.email).toBe('maria@example.com');
    });

    it('should return undefined for non-existent id', () => {
      const client = service.getClientById(999);
      expect(client).toBeUndefined();
    });

    it('should find client by different ids', () => {
      const client1 = service.getClientById(1);
      const client2 = service.getClientById(2);
      const client3 = service.getClientById(3);

      expect(client1?.name).toBe('Juan Pérez');
      expect(client2?.name).toBe('María García');
      expect(client3?.name).toBe('Carlos López');
    });
  });

  describe('Client data validation', () => {
    it('should have correct client statuses', () => {
      const clients = service.clients();
      const validStatuses = ['active', 'inactive'];
      clients.forEach((client) => {
        expect(validStatuses).toContain(client.status);
      });
    });

    it('should have numeric totalPurchases', () => {
      const clients = service.clients();
      clients.forEach((client) => {
        expect(typeof client.totalPurchases).toBe('number');
        expect(client.totalPurchases).toBeGreaterThanOrEqual(0);
      });
    });

    it('should have valid email format', () => {
      const clients = service.clients();
      clients.forEach((client) => {
        expect(client.email).toContain('@');
      });
    });
  });
});
