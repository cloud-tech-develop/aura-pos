import { TestBed } from '@angular/core/testing';
import { UnitsService } from './units.service';
import { Unit, UnitRequest } from '../interfaces';
import { PageParams, ListId } from '@core/interfaces';
import { Observable, of } from 'rxjs';

describe('UnitsService', () => {
  let service: UnitsService;

  // Crear un mock del API service
  const mockUnitsApiService = {
    list: () => of({ error: false, msg: 'Success', data: [{ id: 1, name: 'Test' }] }),
    getById: () => of({ error: false, msg: 'Success', data: { id: 1, name: 'Test', abbreviation: 't', active: true, allow_decimals: false } }),
    create: () => of({ error: false, msg: 'Success', data: { id: 1, name: 'Test', abbreviation: 't', active: true, allow_decimals: false } }),
    update: () => of({ error: false, msg: 'Success', data: { id: 1, name: 'Test', abbreviation: 't', active: true, allow_decimals: false } }),
    delete: () => of({ error: false, msg: 'Success' }),
    page: () => of({ error: false, msg: 'Success', data: { items: [], total: 0, page: 1, limit: 10, totalPages: 0 } }),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        UnitsService,
        { provide: UnitsService, useValue: mockUnitsApiService },
      ],
    });

    service = TestBed.inject(UnitsService);
  });

  describe('should be created', () => {
    it('should create service instance', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('list', () => {
    it('should return units list', () => {
      service.list().subscribe((res) => {
        expect(res.error).toBe(false);
        expect(res.data).toBeDefined();
      });
    });
  });

  describe('getById', () => {
    it('should return unit by id', () => {
      service.getById(1).subscribe((res) => {
        expect(res.error).toBe(false);
        expect(res.data?.id).toBe(1);
      });
    });
  });

  describe('create', () => {
    it('should create unit', () => {
      const payload: UnitRequest = { name: 'New Unit', abbreviation: 'un' };
      service.create(payload).subscribe((res) => {
        expect(res.error).toBe(false);
      });
    });
  });

  describe('update', () => {
    it('should update unit', () => {
      const payload: UnitRequest = { name: 'Updated Unit', abbreviation: 'un' };
      service.update(1, payload).subscribe((res) => {
        expect(res.error).toBe(false);
      });
    });
  });

  describe('delete', () => {
    it('should delete unit', () => {
      service.delete(1).subscribe((res) => {
        expect(res.error).toBe(false);
      });
    });
  });

  describe('page', () => {
    it('should return paginated units', () => {
      const payload: PageParams<null> = { page: 1, limit: 10, search: '', sort: 'id', order: 'asc' };
      service.page(payload).subscribe((res) => {
        expect(res.error).toBe(false);
        expect(res.data).toBeDefined();
      });
    });
  });
});