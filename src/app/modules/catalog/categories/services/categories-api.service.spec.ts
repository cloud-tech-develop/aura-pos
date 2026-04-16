import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CategoriesApiService } from './categories-api.service';
import { Category, CategoryRequest } from '../interfaces';
import { PageParams, ResponseBase } from '@core/interfaces';

describe('CategoriesApiService', () => {
  let httpMock: HttpTestingController;
  let service: CategoriesApiService;
  const apiUrl = '/api/catalog/categories';

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CategoriesApiService],
    });

    service = TestBed.inject(CategoriesApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  function getService(): CategoriesApiService {
    return TestBed.inject(CategoriesApiService);
  }

  describe('should be created', () => {
    it('should create service instance', () => {
      const svc = getService();
      expect(svc).toBeTruthy();
    });
  });

  describe('list', () => {
    it('should return categories list successfully', () => {
      const mockResponse: ResponseBase<Category[]> = {
        success: true,
        message: 'Categories retrieved',
        data: [
          { id: 1, name: 'Bebidas', default_tax_rate: 16, active: true },
          { id: 2, name: 'Comidas', default_tax_rate: 16, active: true },
        ],
      };

      service.list().subscribe((res) => {
        expect(res.error).toBe(false);
        expect(res.data).toBeDefined();
        expect(res.data?.length).toBe(2);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should return error when API fails', () => {
      const mockResponse: ResponseBase<Category[]> = {
        success: false,
        message: 'Error retrieving categories',
        data: [],
      };

      service.list().subscribe((res) => {
        expect(res.error).toBe(true);
        expect(res.msg).toBe('Error retrieving categories');
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush(mockResponse);
    });
  });

  describe('getById', () => {
    it('should return category by id successfully', () => {
      const categoryId = 1;
      const mockResponse: ResponseBase<Category> = {
        success: true,
        message: 'Category retrieved',
        data: { id: 1, name: 'Bebidas', default_tax_rate: 16, active: true },
      };

      service.getById(categoryId).subscribe((res) => {
        expect(res.error).toBe(false);
        expect(res.data?.id).toBe(categoryId);
        expect(res.data?.name).toBe('Bebidas');
      });

      const req = httpMock.expectOne(`${apiUrl}/${categoryId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should return error when category not found', () => {
      const categoryId = 999;
      const mockResponse = {
        success: false,
        message: 'Category not found',
      } as ResponseBase<Category>;

      service.getById(categoryId).subscribe((res) => {
        expect(res.error).toBe(true);
      });

      const req = httpMock.expectOne(`${apiUrl}/${categoryId}`);
      req.flush(mockResponse);
    });
  });

  describe('create', () => {
    it('should create category successfully', () => {
      const payload: CategoryRequest = {
        name: 'Nueva Categoria',
        default_tax_rate: 16,
        active: true,
      };
      const mockResponse: ResponseBase<Category> = {
        success: true,
        message: 'Category created',
        data: { id: 3, name: 'Nueva Categoria', default_tax_rate: 16, active: true },
      };

      service.create(payload).subscribe((res) => {
        expect(res.error).toBe(false);
        expect(res.data?.id).toBe(3);
      });

      const req = httpMock.expectOne(apiUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(payload);
      req.flush(mockResponse);
    });

    it('should return error when create fails', () => {
      const payload: CategoryRequest = { name: 'Invalid' };
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
    it('should update category successfully', () => {
      const categoryId = 1;
      const payload: CategoryRequest = {
        name: 'Bebidas Actualizado',
        default_tax_rate: 8,
      };
      const mockResponse: ResponseBase<Category> = {
        success: true,
        message: 'Category updated',
        data: { id: 1, name: 'Bebidas Actualizado', default_tax_rate: 8, active: true },
      };

      service.update(categoryId, payload).subscribe((res) => {
        expect(res.error).toBe(false);
        expect(res.data?.name).toBe('Bebidas Actualizado');
      });

      const req = httpMock.expectOne(`${apiUrl}/${categoryId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(payload);
      req.flush(mockResponse);
    });

    it('should return error when update fails', () => {
      const categoryId = 999;
      const payload: CategoryRequest = { name: 'Test' };
      const mockResponse = {
        success: false,
        message: 'Category not found',
      };

      service.update(categoryId, payload).subscribe((res) => {
        expect(res.error).toBe(true);
      });

      const req = httpMock.expectOne(`${apiUrl}/${categoryId}`);
      req.flush(mockResponse);
    });
  });

  describe('delete', () => {
    it('should delete category successfully', () => {
      const categoryId = 1;
      const mockResponse = {
        success: true,
        message: 'Category deleted',
      };

      service.delete(categoryId).subscribe((res) => {
        expect(res.error).toBe(false);
        expect(res.msg).toBe('Category deleted');
      });

      const req = httpMock.expectOne(`${apiUrl}/${categoryId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });

    it('should return error when delete fails', () => {
      const categoryId = 999;
      const mockResponse = {
        success: false,
        message: 'Cannot delete category',
      };

      service.delete(categoryId).subscribe((res) => {
        expect(res.error).toBe(true);
      });

      const req = httpMock.expectOne(`${apiUrl}/${categoryId}`);
      req.flush(mockResponse);
    });
  });

  describe('page', () => {
    it('should return paginated categories successfully', () => {
      const payload: PageParams<null> = { page: 1, limit: 10, search: '', sort: 'id', order: 'asc' };
      const mockResponse = {
        success: true,
        message: 'Categories retrieved',
        data: {
          items: [
            { id: 1, name: 'Bebidas', default_tax_rate: 16, active: true },
            { id: 2, name: 'Comidas', default_tax_rate: 16, active: true },
          ],
          page: 1,
          limit: 10,
          total: 2,
          totalPages: 1,
        },
      };

      service.page(payload).subscribe((res) => {
        expect(res.error).toBe(false);
        expect(res.data).toBeDefined();
        expect(res.data?.items.length).toBe(2);
        expect(res.data?.total).toBe(2);
      });

      const req = httpMock.expectOne(`${apiUrl}/page`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should return error when page request fails', () => {
      const payload: PageParams<null> = { page: 1, limit: 10, search: '', sort: 'id', order: 'asc' };
      const mockResponse = {
        success: false,
        message: 'Error retrieving categories',
        data: undefined,
      };

      service.page(payload).subscribe((res) => {
        expect(res.error).toBe(true);
      });

      const req = httpMock.expectOne(`${apiUrl}/page`);
      req.flush(mockResponse);
    });
  });
});