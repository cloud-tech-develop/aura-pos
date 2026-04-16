import { TestBed } from '@angular/core/testing';
import { BrandsService } from './brands.service';
import { Brand, BrandRequest } from '../interfaces';
import { PageParams, ListId } from '@core/interfaces';
import { Observable, of } from 'rxjs';

describe('BrandsService', () => {
  let service: BrandsService;

  // Crear un mock del API service
  const mockBrandsApiService = {
    list: () => of({ error: false, msg: 'Success', data: [{ id: 1, name: 'Test' }] }),
    getById: () => of({ error: false, msg: 'Success', data: { id: 1, name: 'Test', active: true } }),
    create: () => of({ error: false, msg: 'Success', data: { id: 1, name: 'Test', active: true } }),
    update: () => of({ error: false, msg: 'Success', data: { id: 1, name: 'Test', active: true } }),
    delete: () => of({ error: false, msg: 'Success' }),
    page: () => of({ error: false, msg: 'Success', data: { items: [], total: 0, page: 1, limit: 10, totalPages: 0 } }),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        BrandsService,
        { provide: BrandsService, useValue: mockBrandsApiService },
      ],
    });

    service = TestBed.inject(BrandsService);
  });

  describe('should be created', () => {
    it('should create service instance', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('list', () => {
    it('should return brands list', () => {
      service.list().subscribe((res) => {
        expect(res.error).toBe(false);
        expect(res.data).toBeDefined();
      });
    });
  });

  describe('getById', () => {
    it('should return brand by id', () => {
      service.getById(1).subscribe((res) => {
        expect(res.error).toBe(false);
        expect(res.data?.id).toBe(1);
      });
    });
  });

  describe('create', () => {
    it('should create brand', () => {
      const payload: BrandRequest = { name: 'New Brand' };
      service.create(payload).subscribe((res) => {
        expect(res.error).toBe(false);
      });
    });
  });

  describe('update', () => {
    it('should update brand', () => {
      const payload: BrandRequest = { name: 'Updated Brand' };
      service.update(1, payload).subscribe((res) => {
        expect(res.error).toBe(false);
      });
    });
  });

  describe('delete', () => {
    it('should delete brand', () => {
      service.delete(1).subscribe((res) => {
        expect(res.error).toBe(false);
      });
    });
  });

  describe('page', () => {
    it('should return paginated brands', () => {
      const payload: PageParams<null> = { page: 1, limit: 10, search: '', sort: 'id', order: 'asc' };
      service.page(payload).subscribe((res) => {
        expect(res.error).toBe(false);
        expect(res.data).toBeDefined();
      });
    });
  });
});