import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UnitsApiService } from './units-api.service';
import { Unit, UnitRequest } from '../interfaces';
import { PageParams, ResponseBase, ListId } from '@core/interfaces';

describe('UnitsApiService', () => {
  let httpMock: HttpTestingController;
  let service: UnitsApiService;
  const apiUrl = '/api/catalog/units';

  beforeEach(() => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UnitsApiService],
    });

    service = TestBed.inject(UnitsApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  function getService(): UnitsApiService {
    return TestBed.inject(UnitsApiService);
  }

  describe('should be created', () => {
    it('should create service instance', () => {
      const svc = getService();
      expect(svc).toBeTruthy();
    });
  });

  describe('list', () => {
    it('should return units list successfully', () => {
      const mockResponse: ResponseBase<ListId[]> = {
        success: true,
        message: 'Units retrieved',
        data: [
          { id: 1, name: 'Kilogramo' },
          { id: 2, name: 'Litro' },
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
        message: 'Error retrieving units',
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
    it('should return unit by id successfully', () => {
      const unitId = 1;
      const mockResponse: ResponseBase<Unit> = {
        success: true,
        message: 'Unit retrieved',
        data: { id: 1, name: 'Kilogramo', abbreviation: 'kg', active: true, allow_decimals: true },
      };

      service.getById(unitId).subscribe((res) => {
        expect(res.error).toBe(false);
        expect(res.data?.id).toBe(unitId);
      });

      const req = httpMock.expectOne(`${apiUrl}/${unitId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });

    it('should return error when unit not found', () => {
      const unitId = 999;
      const mockResponse = {
        success: false,
        message: 'Unit not found',
      };

      service.getById(unitId).subscribe((res) => {
        expect(res.error).toBe(true);
      });

      const req = httpMock.expectOne(`${apiUrl}/${unitId}`);
      req.flush(mockResponse);
    });
  });

  describe('create', () => {
    it('should create unit successfully', () => {
      const payload: UnitRequest = { name: 'Nueva Unidad', abbreviation: 'un', active: true };
      const mockResponse: ResponseBase<Unit> = {
        success: true,
        message: 'Unit created',
        data: { id: 3, name: 'Nueva Unidad', abbreviation: 'un', active: true, allow_decimals: false },
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
      const payload: UnitRequest = { name: 'Invalid', abbreviation: 'x' };
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
    it('should update unit successfully', () => {
      const unitId = 1;
      const payload: UnitRequest = { name: 'Unidad Actualizada', abbreviation: 'kg' };
      const mockResponse: ResponseBase<Unit> = {
        success: true,
        message: 'Unit updated',
        data: { id: 1, name: 'Unidad Actualizada', abbreviation: 'kg', active: true, allow_decimals: true },
      };

      service.update(unitId, payload).subscribe((res) => {
        expect(res.error).toBe(false);
        expect(res.data?.name).toBe('Unidad Actualizada');
      });

      const req = httpMock.expectOne(`${apiUrl}/${unitId}`);
      expect(req.request.method).toBe('PUT');
      req.flush(mockResponse);
    });

    it('should return error when update fails', () => {
      const unitId = 999;
      const payload: UnitRequest = { name: 'Test', abbreviation: 't' };
      const mockResponse = {
        success: false,
        message: 'Unit not found',
      };

      service.update(unitId, payload).subscribe((res) => {
        expect(res.error).toBe(true);
      });

      const req = httpMock.expectOne(`${apiUrl}/${unitId}`);
      req.flush(mockResponse);
    });
  });

  describe('delete', () => {
    it('should delete unit successfully', () => {
      const unitId = 1;
      const mockResponse = {
        success: true,
        message: 'Unit deleted',
      };

      service.delete(unitId).subscribe((res) => {
        expect(res.error).toBe(false);
      });

      const req = httpMock.expectOne(`${apiUrl}/${unitId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush(mockResponse);
    });

    it('should return error when delete fails', () => {
      const unitId = 999;
      const mockResponse = {
        success: false,
        message: 'Cannot delete unit',
      };

      service.delete(unitId).subscribe((res) => {
        expect(res.error).toBe(true);
      });

      const req = httpMock.expectOne(`${apiUrl}/${unitId}`);
      req.flush(mockResponse);
    });
  });

  describe('page', () => {
    it('should return paginated units successfully', () => {
      const payload: PageParams<null> = { page: 1, limit: 10, search: '', sort: 'id', order: 'asc' };
      const mockResponse = {
        success: true,
        message: 'Units retrieved',
        data: {
          items: [
            { id: 1, name: 'Kilogramo', abbreviation: 'kg', active: true, allow_decimals: true },
            { id: 2, name: 'Litro', abbreviation: 'L', active: true, allow_decimals: true },
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
        message: 'Error retrieving units',
      };

      service.page(payload).subscribe((res) => {
        expect(res.error).toBe(true);
      });

      const req = httpMock.expectOne(`${apiUrl}/page`);
      req.flush(mockResponse);
    });
  });
});