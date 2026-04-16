import { TestBed } from '@angular/core/testing';
import { ProductsService } from './products.service';
import { Product, CreateProductRequest, UpdateProductRequest, ProductPaginationRequest } from '../interfaces';
import { Observable, of } from 'rxjs';

describe('ProductsService', () => {
  let service: ProductsService;

  // Crear un mock del API service
  const mockProductsApiService = {
    getById: () => of({ error: false, msg: 'Success', data: { id: 1, sku: 'TEST', name: 'Test', cost_price: 10, sale_price: 20, status: 'ACTIVE' } }),
    create: () => of({ error: false, msg: 'Success', data: { id: 1, sku: 'TEST', name: 'Test', cost_price: 10, sale_price: 20, status: 'ACTIVE' } }),
    update: () => of({ error: false, msg: 'Success', data: { id: 1, sku: 'TEST', name: 'Test', cost_price: 10, sale_price: 20, status: 'ACTIVE' } }),
    delete: () => of({ error: false, msg: 'Success' }),
    page: () => of({ error: false, msg: 'Success', data: { items: [], total: 0, page: 1, limit: 10, totalPages: 0 } }),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductsService,
        { provide: ProductsService, useValue: mockProductsApiService },
      ],
    });

    service = TestBed.inject(ProductsService);
  });

  describe('should be created', () => {
    it('should create service instance', () => {
      expect(service).toBeTruthy();
    });
  });

  describe('getById', () => {
    it('should return product by id', () => {
      service.getById(1).subscribe((res) => {
        expect(res.error).toBe(false);
        expect(res.data?.id).toBe(1);
      });
    });
  });

  describe('create', () => {
    it('should create product', () => {
      const payload: CreateProductRequest = { sku: 'NEW001', name: 'New Product', cost_price: 10, sale_price: 20 };
      service.create(payload).subscribe((res) => {
        expect(res.error).toBe(false);
      });
    });
  });

  describe('update', () => {
    it('should update product', () => {
      const payload: UpdateProductRequest = { name: 'Updated' };
      service.update(1, payload).subscribe((res) => {
        expect(res.error).toBe(false);
      });
    });
  });

  describe('delete', () => {
    it('should delete product', () => {
      service.delete(1).subscribe((res) => {
        expect(res.error).toBe(false);
      });
    });
  });

  describe('page', () => {
    it('should return paginated products', () => {
      const params: ProductPaginationRequest = { page: 1, limit: 10 };
      service.page(params).subscribe((res) => {
        expect(res.error).toBe(false);
        expect(res.data).toBeDefined();
      });
    });
  });
});