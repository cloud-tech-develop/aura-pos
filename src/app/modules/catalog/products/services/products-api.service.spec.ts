import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductsApiService } from './products-api.service';
import { Product, CreateProductRequest, UpdateProductRequest, ProductPaginationRequest } from '../interfaces';
import { ResponseBase, PageData } from '@core/interfaces';

describe('ProductsApiService', () => {
  let httpMock: HttpTestingController;
  let service: ProductsApiService;
  const apiUrl = '/api/catalog/products';

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductsApiService],
    });

    service = TestBed.inject(ProductsApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  function getService(): ProductsApiService {
    return TestBed.inject(ProductsApiService);
  }

  describe('should be created', () => {
    it('should create service instance', () => {
      const svc = getService();
      expect(svc).toBeTruthy();
    });
  });

  describe('getAll', () => {
    it('should return all products successfully', () => {
      const mockResponse: ResponseBase<Product[]> = {
        success: true,
        message: 'Products retrieved',
        data: [
          { id: 1, sku: 'PROD001', name: 'Café Americano', cost_price: 25, sale_price: 45, status: 'ACTIVE' },
          { id: 2, sku: 'PROD002', name: 'Café Latte', cost_price: 30, sale_price: 55, status: 'ACTIVE' },
        ],
      };

      service.getAll().subscribe((res) => {
        expect(res.error).toBe(false);
        expect(res.data).toBeDefined();
        expect(res.data?.length).toBe(2);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should return error when API fails', () => {
      const mockResponse: ResponseBase<Product[]> = {
        success: false,
        message: 'Error retrieving products',
        data: [],
      };

      service.getAll().subscribe((res) => {
        expect(res.error).toBe(true);
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush(mockResponse);
    });
  });

  describe('getById', () => {
    it('should return product by id successfully', () => {
      const productId = 1;
      const mockResponse: ResponseBase<Product> = {
        success: true,
        message: 'Product retrieved',
        data: { id: 1, sku: 'PROD001', name: 'Café Americano', cost_price: 25, sale_price: 45, status: 'ACTIVE' },
      };

      service.getById(productId).subscribe((res) => {
        expect(res.error).toBe(false);
        expect(res.data?.id).toBe(productId);
      });

      const req = httpMock.expectOne(`${apiUrl}/${productId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should return error when product not found', () => {
      const productId = 999;
      const mockResponse = {
        success: false,
        message: 'Product not found',
      };

      service.getById(productId).subscribe((res) => {
        expect(res.error).toBe(true);
      });

      const req = httpMock.expectOne(`${apiUrl}/${productId}`);
      req.flush(mockResponse);
    });
  });

  describe('create', () => {
    it('should create product successfully', () => {
      const payload: CreateProductRequest = {
        sku: 'PROD003',
        name: 'Nuevo Producto',
        cost_price: 20,
        sale_price: 40,
        status: 'ACTIVE',
      };
      const mockResponse: ResponseBase<Product> = {
        success: true,
        message: 'Product created',
        data: { id: 3, sku: 'PROD003', name: 'Nuevo Producto', cost_price: 20, sale_price: 40, status: 'ACTIVE' },
      };

      service.create(payload).subscribe((res) => {
        expect(res.error).toBe(false);
        expect(res.data?.id).toBe(3);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should return error when create fails', () => {
      const payload: CreateProductRequest = { sku: 'INVALID', name: 'Test', cost_price: 0, sale_price: 0 };
      const mockResponse = {
        success: false,
        message: 'Validation error',
      };

      service.create(payload).subscribe((res) => {
        expect(res.error).toBe(true);
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush(mockResponse);
    });
  });

  describe('update', () => {
    it('should update product successfully', () => {
      const productId = 1;
      const payload: UpdateProductRequest = { name: 'Producto Actualizado', sale_price: 50 };
      const mockResponse: ResponseBase<Product> = {
        success: true,
        message: 'Product updated',
        data: { id: 1, sku: 'PROD001', name: 'Producto Actualizado', cost_price: 25, sale_price: 50, status: 'ACTIVE' },
      };

      service.update(productId, payload).subscribe((res) => {
        expect(res.error).toBe(false);
        expect(res.data?.name).toBe('Producto Actualizado');
      });

      const req = httpMock.expectOne(`${apiUrl}/${productId}`);
      expect(req.request.method).toBe('PUT');
      req.flush(mockResponse);
    });

    it('should return error when update fails', () => {
      const productId = 999;
      const payload: UpdateProductRequest = { name: 'Test' };
      const mockResponse = {
        success: false,
        message: 'Product not found',
      };

      service.update(productId, payload).subscribe((res) => {
        expect(res.error).toBe(true);
      });

      const req = httpMock.expectOne(`${apiUrl}/${productId}`);
      req.flush(mockResponse);
    });
  });

  describe('delete', () => {
    it('should delete product successfully', () => {
      const productId = 1;
      const mockResponse = {
        success: true,
        message: 'Product deleted',
      };

      service.delete(productId).subscribe((res) => {
        expect(res.error).toBe(false);
      });

      const req = httpMock.expectOne(`${apiUrl}/${productId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });

    it('should return error when delete fails', () => {
      const productId = 999;
      const mockResponse = {
        success: false,
        message: 'Cannot delete product',
      };

      service.delete(productId).subscribe((res) => {
        expect(res.error).toBe(true);
      });

      const req = httpMock.expectOne(`${apiUrl}/${productId}`);
      req.flush(mockResponse);
    });
  });

  describe('page', () => {
    it('should return paginated products successfully', () => {
      const params: ProductPaginationRequest = { page: 1, limit: 10, search: '' };
      const mockResponse: ResponseBase<PageData<Product>> = {
        success: true,
        message: 'Products retrieved',
        data: {
          items: [
            { id: 1, sku: 'PROD001', name: 'Café Americano', cost_price: 25, sale_price: 45, status: 'ACTIVE' },
          ],
          total: 1,
          page: 1,
          limit: 10,
          totalPages: 1,
        },
      };

      service.page(params).subscribe((res) => {
        expect(res.error).toBe(false);
        expect(res.data).toBeDefined();
        expect(res.data?.items.length).toBe(1);
      });

      const req = httpMock.expectOne(`${apiUrl}/page`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should return error when page request fails', () => {
      const params: ProductPaginationRequest = { page: 1, limit: 10 };
      const mockResponse = {
        success: false,
        message: 'Error retrieving products',
      };

      service.page(params).subscribe((res) => {
        expect(res.error).toBe(true);
      });

      const req = httpMock.expectOne(`${apiUrl}/page`);
      req.flush(mockResponse);
    });
  });
});