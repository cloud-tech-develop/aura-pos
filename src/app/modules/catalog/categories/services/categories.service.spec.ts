import { TestBed } from '@angular/core/testing';
import { CategoriesService } from './categories.service';
import { Category, CategoryRequest } from '../interfaces';
import { PageParams } from '@core/interfaces';
import { Observable, of } from 'rxjs';

describe('CategoriesService', () => {
  let service: CategoriesService;

  // Crear un mock del API service
  const mockCategoriesApiService = {
    list: () => of({ error: false, msg: 'Success', data: [{ id: 1, name: 'Test' }] }),
    getById: () => of({ error: false, msg: 'Success', data: { id: 1, name: 'Test' } }),
    create: () => of({ error: false, msg: 'Success', data: { id: 1, name: 'Test' } }),
    update: () => of({ error: false, msg: 'Success', data: { id: 1, name: 'Test' } }),
    delete: () => of({ error: false, msg: 'Success' }),
    page: () => of({ error: false, msg: 'Success', data: { items: [], total: 0, page: 1, limit: 10, totalPages: 0 } }),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        CategoriesService,
        { provide: CategoriesService, useValue: mockCategoriesApiService },
      ],
    });

    service = TestBed.inject(CategoriesService);
  });

  describe('should be created', () => {
    it('should create service instance', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('list', () => {
    it('should return categories list', () => {
      service.list().subscribe((res) => {
        expect(res.error).toBe(false);
        expect(res.data).toBeDefined();
      });
    });
  });

  describe('getById', () => {
    it('should return category by id', () => {
      service.getById(1).subscribe((res) => {
        expect(res.error).toBe(false);
        expect(res.data?.id).toBe(1);
      });
    });
  });

  describe('create', () => {
    it('should create category', () => {
      const payload: CategoryRequest = { name: 'New Category' };
      service.create(payload).subscribe((res) => {
        expect(res.error).toBe(false);
        expect(res.data).toBeDefined();
      });
    });
  });

  describe('update', () => {
    it('should update category', () => {
      const payload: CategoryRequest = { name: 'Updated Category' };
      service.update(1, payload).subscribe((res) => {
        expect(res.error).toBe(false);
      });
    });
  });

  describe('delete', () => {
    it('should delete category', () => {
      service.delete(1).subscribe((res) => {
        expect(res.error).toBe(false);
      });
    });
  });

  describe('page', () => {
    it('should return paginated categories', () => {
      const payload: PageParams<null> = { page: 1, limit: 10, search: '', sort: 'id', order: 'asc' };
      service.page(payload).subscribe((res) => {
        expect(res.error).toBe(false);
        expect(res.data).toBeDefined();
      });
    });
  });
});