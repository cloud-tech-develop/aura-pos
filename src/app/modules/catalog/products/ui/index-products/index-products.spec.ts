import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IndexProducts } from './index-products';
import { ProductsService } from '../../services';
import { Product } from '../../interfaces';

describe('IndexProducts', () => {
  let component: IndexProducts;
  let fixture: ComponentFixture<IndexProducts>;

  // Mock de ProductsService
  const mockProductsService = {
    page: () => {
      return {
        subscribe: (callbacks: { next: (res: { error: boolean; data?: { items: Product[]; total: number } }) => void }) => {
          callbacks.next({
            error: false,
            data: {
              items: [
                { id: 1, sku: 'PROD001', name: 'Café Americano', cost_price: 25, sale_price: 45, status: 'ACTIVE' },
              ],
              total: 1,
            },
          });
        },
      };
    },
    delete: () => {
      return {
        subscribe: (callbacks: { next: (res: { error: boolean }) => void }) => {
          callbacks.next({ error: false });
        },
      };
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndexProducts, HttpClientTestingModule],
      providers: [
        { provide: ProductsService, useValue: mockProductsService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(IndexProducts);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('should be created', () => {
    it('should create component instance', () => {
      expect(component).toBeTruthy();
    });
  });

  describe('Initial State', () => {
    it('should have default page value', () => {
      expect(component.page()).toBe(1);
    });

    it('should have default rows value', () => {
      expect(component.rows()).toBe(10);
    });

    it('should have empty products initially', () => {
      expect(component.products()).toEqual([]);
    });

    it('should have totalRecords as 0 initially', () => {
      expect(component.totalRecords()).toBe(0);
    });

    it('should have isLoading as false initially', () => {
      expect(component.isLoading()).toBe(false);
    });

    it('should have showDialog as false initially', () => {
      expect(component.showDialog()).toBe(false);
    });

    it('should have isEditing as false initially', () => {
      expect(component.isEditing()).toBe(false);
    });

    it('should have empty searchQuery initially', () => {
      expect(component.searchQuery()).toBe('');
    });

    it('should have selectedProduct as null initially', () => {
      expect(component.selectedProduct()).toBeNull();
    });
  });

  describe('loadProducts', () => {
    it('should load products successfully', () => {
      const mockEvent = { first: 0, rows: 10 } as any;
      component.loadProducts(mockEvent);

      expect(component.isLoading()).toBe(true);
    });

    it('should update products after loading', () => {
      const mockEvent = { first: 0, rows: 10 } as any;
      component.loadProducts(mockEvent);

      expect(component.products().length).toBe(1);
      expect(component.totalRecords()).toBe(1);
    });
  });

  describe('getStatusSeverity', () => {
    it('should return success for ACTIVE status', () => {
      expect(component.getStatusSeverity('ACTIVE')).toBe('success');
    });

    it('should return warn for INACTIVE status', () => {
      expect(component.getStatusSeverity('INACTIVE')).toBe('warn');
    });

    it('should return danger for DISCONTINUED status', () => {
      expect(component.getStatusSeverity('DISCONTINUED')).toBe('danger');
    });

    it('should return secondary for unknown status', () => {
      expect(component.getStatusSeverity('UNKNOWN' as any)).toBe('secondary');
    });
  });

  describe('deleteProduct', () => {
    it('should delete product successfully', () => {
      const product: Product = { id: 1, sku: 'PROD001', name: 'Test', cost_price: 10, sale_price: 20, status: 'ACTIVE' };
      component.deleteProduct(product);

      expect(component.isLoading()).toBe(true);
    });
  });

  describe('hideDialog', () => {
    it('should hide dialog', () => {
      component.showDialog.set(true);
      component.hideDialog();

      expect(component.showDialog()).toBe(false);
    });
  });

  describe('statusOptions', () => {
    it('should have correct status options', () => {
      expect(component.statusOptions.length).toBe(3);
      expect(component.statusOptions).toContain({ label: 'Active', value: 'ACTIVE' });
      expect(component.statusOptions).toContain({ label: 'Inactive', value: 'INACTIVE' });
      expect(component.statusOptions).toContain({ label: 'Discontinued', value: 'DISCONTINUED' });
    });
  });
});