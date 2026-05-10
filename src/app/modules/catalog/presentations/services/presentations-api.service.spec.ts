import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PresentationsApiService } from './presentations-api.service';
import { Presentation } from '../interfaces/presentation.interface';

describe('PresentationsApiService', () => {
  let service: PresentationsApiService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    service = TestBed.inject(PresentationsApiService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAll', () => {
    it('should return an array of presentations', () => {
      const testPresentations: Presentation[] = [
        {
          id: 1,
          name: 'Kilo',
          product_id: 1,
          factor: 1,
          barcode: '1234567890123',
          cost_price: 100,
          sale_price: 150,
          default_purchase: false,
          default_sale: true,
          enterprise_id: 1,
        },
      ];

      service.getAll().subscribe((response) => {
        expect(response.error).toBeFalse();
        expect(response.data).toEqual(testPresentations);
      });

      const req = httpTestingController.expectOne(`${service.apiUrl}/presentations`);
      expect(req.request.method).toBe('GET');
      req.flush({ message: 'Success', error: false, data: testPresentations });
    });
  });

  describe('getById', () => {
    it('should return a single presentation', () => {
      const testPresentation: Presentation = {
        id: 1,
        name: 'Libra',
        product_id: 1,
        factor: 0.453592,
        barcode: '9876543210987',
        cost_price: 200,
        sale_price: 300,
        default_purchase: true,
        default_sale: false,
        enterprise_id: 1,
      };

      service.getById('1').subscribe((response) => {
        expect(response.error).toBeFalse();
        expect(response.data).toEqual(testPresentation);
      });

      const req = httpTestingController.expectOne(`${service.apiUrl}/presentations/1`);
      expect(req.request.method).toBe('GET');
      req.flush({ message: 'Success', error: false, data: testPresentation });
    });
  });

  describe('create', () => {
    it('should create a new presentation', () => {
      const testPresentation: Presentation = {
        id: 2,
        name: 'Gramo',
        product_id: 2,
        factor: 0.001,
        barcode: '1111111111111',
        cost_price: 50,
        sale_price: 75,
        default_purchase: false,
        default_sale: false,
        enterprise_id: 1,
      };

      service.create(testPresentation).subscribe((response) => {
        expect(response.error).toBeFalse();
        expect(response.data).toEqual(testPresentation);
      });

      const req = httpTestingController.expectOne(`${service.apiUrl}/presentations`);
      expect(req.request.method).toBe('POST');
      req.flush({ message: 'Success', error: false, data: testPresentation });
    });
  });

  describe('update', () => {
    it('should update an existing presentation', () => {
      const updatedPresentation: Presentation = {
        id: 1,
        name: 'Kilo Actualizado',
        product_id: 1,
        factor: 1,
        barcode: '1234567890123',
        cost_price: 120,
        sale_price: 180,
        default_purchase: false,
        default_sale: true,
        enterprise_id: 1,
      };

      service.update('1', updatedPresentation).subscribe((response) => {
        expect(response.error).toBeFalse();
        expect(response.data).toEqual(updatedPresentation);
      });

      const req = httpTestingController.expectOne(`${service.apiUrl}/presentations/1`);
      expect(req.request.method).toBe('PUT');
      req.flush({ message: 'Success', error: false, data: updatedPresentation });
    });
  });

  describe('delete', () => {
    it('should delete a presentation', () => {
      service.delete(1).subscribe((response) => {
        expect(response.error).toBeFalse();
        expect(response.msg).toBe('Success');
      });

      const req = httpTestingController.expectOne(`${service.apiUrl}/presentations/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({ error: false, msg: 'Success' });
    });
  });
});