import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IndexBrands } from './index-brands';
import { BrandsService } from '../../services';
import { Brand } from '../../interfaces';

describe('IndexBrands', () => {
  let component: IndexBrands;
  let fixture: ComponentFixture<IndexBrands>;

  // Mock de BrandsService
  const mockBrandsService = {
    page: () => {
      return {
        subscribe: (callbacks: { next: (res: { error: boolean; data?: { items: Brand[]; total: number; page: number; limit: number } }) => void }) => {
          callbacks.next({
            error: false,
            data: {
              items: [
                { id: 1, name: 'Nestlé', active: true },
              ],
              total: 1,
              page: 1,
              limit: 10,
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
      imports: [IndexBrands, HttpClientTestingModule],
      providers: [
        { provide: BrandsService, useValue: mockBrandsService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(IndexBrands);
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

    it('should have empty brands initially', () => {
      expect(component.brands()).toEqual([]);
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

    it('should have selectedBrand as null initially', () => {
      expect(component.selectedBrand()).toBeNull();
    });
  });

  describe('loadBrands', () => {
    it('should load brands successfully', () => {
      const mockEvent = { first: 0, rows: 10 } as any;
      component.loadBrands(mockEvent);

      expect(component.isLoading()).toBe(true);
    });

    it('should update brands after loading', () => {
      const mockEvent = { first: 0, rows: 10 } as any;
      component.loadBrands(mockEvent);

      expect(component.brands().length).toBe(1);
      expect(component.totalRecords()).toBe(1);
    });
  });

  describe('onSearch', () => {
    it('should call loadBrands with default values', () => {
      component.onSearch();
      expect(component.isLoading()).toBe(true);
    });
  });

  describe('openCreateDialog', () => {
    it('should open create dialog', () => {
      component.openCreateDialog();

      expect(component.showDialog()).toBe(true);
      expect(component.isEditing()).toBe(false);
      expect(component.selectedBrand()).toBeNull();
    });
  });

  describe('openEditDialog', () => {
    it('should open edit dialog with brand', () => {
      const brand: Brand = { id: 1, name: 'Nestlé', active: true };
      component.openEditDialog(brand);

      expect(component.showDialog()).toBe(true);
      expect(component.isEditing()).toBe(true);
      expect(component.selectedBrand()).toEqual(brand);
    });
  });

  describe('hideDialog', () => {
    it('should hide dialog and clear selected brand', () => {
      component.showDialog.set(true);
      component.selectedBrand.set({ id: 1, name: 'Test', active: true } as Brand);

      component.hideDialog();

      expect(component.showDialog()).toBe(false);
      expect(component.selectedBrand()).toBeNull();
    });
  });

  describe('deleteBrand', () => {
    it('should delete brand successfully', () => {
      const brand: Brand = { id: 1, name: 'Nestlé', active: true };
      component.deleteBrand(brand);

      expect(component.isLoading()).toBe(true);
    });
  });
});