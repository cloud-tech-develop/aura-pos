import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { BrandsApiService } from './brands-api.service';
import { Brand, BrandRequest } from '../interfaces';
import { PageParams, ResponseBase, ListId } from '@core/interfaces';

describe('BrandsApiService', () => {
  let httpMock: HttpTestingController;
  let service: BrandsApiService;
  const apiUrl = '/api/catalog/brands';

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BrandsApiService],
    });

    service = TestBed.inject(BrandsApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  function getService(): BrandsApiService {
    return TestBed.inject(BrandsApiService);
  }

  describe('should be created', () => {
    it('should create service instance', () => {
      const svc = getService();
      expect(svc).toBeTruthy();
    });
  });

  describe('list', () => {
    it('should return brands list successfully', () => {
      const mockResponse: ResponseBase<ListId[]> = {
        success: true,
        message: 'Brands retrieved',
        data: [
          { id: 1, name: 'Nestlé' },
          { id: 2, name: 'Coca-Cola' },
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
      const mockResponse: ResponseBase<ListId[]> = {
        success: false,
        message: 'Error retrieving brands',
        data: [],
      };

      service.list().subscribe((res) => {
        expect(res.error).toBe(true);
      });

      const req = httpMock.expectOne(apiUrl);
      req.flush(mockResponse);
    });
  });

  describe('getById', () => {
    it('should return brand by id successfully', () => {
      const brandId = 1;
      const mockResponse: ResponseBase<Brand> = {
        success: true,
        message: 'Brand retrieved',
        data: { id: 1, name: 'Nestlé', active: true },
      };

      service.getById(brandId).subscribe((res) => {
        expect(res.error).toBe(false);
        expect(res.data?.id).toBe(brandId);
      });

      const req = httpMock.expectOne(`${apiUrl}/${brandId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should return error when brand not found', () => {
      const brandId = 999;
      const mockResponse = {
        success: false,
        message: 'Brand not found',
      };

      service.getById(brandId).subscribe((res) => {
        expect(res.error).toBe(true);
      });

      const req = httpMock.expectOne(`${apiUrl}/${brandId}`);
      req.flush(mockResponse);
    });
  });

  describe('create', () => {
    it('should create brand successfully', () => {
      const payload: BrandRequest = { name: 'Nueva Marca', active: true };
      const mockResponse: ResponseBase<Brand> = {
        success: true,
        message: 'Brand created',
        data: { id: 3, name: 'Nueva Marca', active: true },
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
      const payload: BrandRequest = { name: 'Invalid' };
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
    it('should update brand successfully', () => {
      const brandId = 1;
      const payload: BrandRequest = { name: 'Marca Actualizada' };
      const mockResponse: ResponseBase<Brand> = {
        success: true,
        message: 'Brand updated',
        data: { id: 1, name: 'Marca Actualizada', active: true },
      };

      service.update(brandId, payload).subscribe((res) => {
        expect(res.error).toBe(false);
        expect(res.data?.name).toBe('Marca Actualizada');
      });

      const req = httpMock.expectOne(`${apiUrl}/${brandId}`);
      expect(req.request.method).toBe('PUT');
      req.flush(mockResponse);
    });

    it('should return error when update fails', () => {
      const brandId = 999;
      const payload: BrandRequest = { name: 'Test' };
      const mockResponse = {
        success: false,
        message: 'Brand not found',
      };

      service.update(brandId, payload).subscribe((res) => {
        expect(res.error).toBe(true);
      });

      const req = httpMock.expectOne(`${apiUrl}/${brandId}`);
      req.flush(mockResponse);
    });
  });

  describe('delete', () => {
    it('should delete brand successfully', () => {
      const brandId = 1;
      const mockResponse = {
        success: true,
        message: 'Brand deleted',
      };

      service.delete(brandId).subscribe((res) => {
        expect(res.error).toBe(false);
      });

      const req = httpMock.expectOne(`${apiUrl}/${brandId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });

    it('should return error when delete fails', () => {
      const brandId = 999;
      const mockResponse = {
        success: false,
        message: 'Cannot delete brand',
      };

      service.delete(brandId).subscribe((res) => {
        expect(res.error).toBe(true);
      });

      const req = httpMock.expectOne(`${apiUrl}/${brandId}`);
      req.flush(mockResponse);
    });
  });

  describe('page', () => {
    it('should return paginated brands successfully', () => {
      const payload: PageParams<null> = { page: 1, limit: 10, search: '', sort: 'id', order: 'asc' };
      const mockResponse = {
        success: true,
        message: 'Brands retrieved',
        data: {
          items: [
            { id: 1, name: 'Nestlé', active: true },
            { id: 2, name: 'Coca-Cola', active: true },
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
      });

      const req = httpMock.expectOne(`${apiUrl}/page`);
      expect(req.request.method).toBe('POST');
      req.flush(mockResponse);
    });

    it('should return error when page request fails', () => {
      const payload: PageParams<null> = { page: 1, limit: 10, search: '', sort: 'id', order: 'asc' };
      const mockResponse = {
        success: false,
        message: 'Error retrieving brands',
      };

      service.page(payload).subscribe((res) => {
        expect(res.error).toBe(true);
      });

      const req = httpMock.expectOne(`${apiUrl}/page`);
      req.flush(mockResponse);
    });
  });
});