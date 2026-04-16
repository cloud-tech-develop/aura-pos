import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IndexCategories } from './index-categories';
import { CategoriesService } from '../../services';
import { Category } from '../../interfaces';

describe('IndexCategories', () => {
  let component: IndexCategories;
  let fixture: ComponentFixture<IndexCategories>;

  // Mock de CategoriesService
  const mockCategoriesService = {
    page: () => {
      return {
        subscribe: (callbacks: { next: (res: { error: boolean; data?: { items: Category[]; total: number; page: number; limit: number } }) => void }) => {
          callbacks.next({
            error: false,
            data: {
              items: [
                { id: 1, name: 'Bebidas', default_tax_rate: 16, active: true },
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
      imports: [IndexCategories, HttpClientTestingModule],
      providers: [
        { provide: CategoriesService, useValue: mockCategoriesService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(IndexCategories);
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

    it('should have empty categories initially', () => {
      expect(component.categories()).toEqual([]);
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

    it('should have selectedCategory as null initially', () => {
      expect(component.selectedCategory()).toBeNull();
    });
  });

  describe('loadCategories', () => {
    it('should load categories successfully', () => {
      const mockEvent = { first: 0, rows: 10 } as any;
      component.loadCategories(mockEvent);

      expect(component.isLoading()).toBe(true);
    });

    it('should update categories after loading', () => {
      const mockEvent = { first: 0, rows: 10 } as any;
      component.loadCategories(mockEvent);

      expect(component.categories().length).toBe(1);
      expect(component.totalRecords()).toBe(1);
    });
  });

  describe('onSearch', () => {
    it('should call loadCategories with default values', () => {
      component.onSearch();
      expect(component.isLoading()).toBe(true);
    });
  });

  describe('openCreateDialog', () => {
    it('should open create dialog', () => {
      component.openCreateDialog();

      expect(component.showDialog()).toBe(true);
      expect(component.isEditing()).toBe(false);
      expect(component.selectedCategory()).toBeNull();
    });
  });

  describe('openEditDialog', () => {
    it('should open edit dialog with category', () => {
      const category: Category = { id: 1, name: 'Bebidas', default_tax_rate: 16, active: true };
      component.openEditDialog(category);

      expect(component.showDialog()).toBe(true);
      expect(component.isEditing()).toBe(true);
      expect(component.selectedCategory()).toEqual(category);
    });
  });

  describe('hideDialog', () => {
    it('should hide dialog and clear selected category', () => {
      component.showDialog.set(true);
      component.selectedCategory.set({ id: 1, name: 'Test', default_tax_rate: 16, active: true } as Category);

      component.hideDialog();

      expect(component.showDialog()).toBe(false);
      expect(component.selectedCategory()).toBeNull();
    });
  });

  describe('deleteCategory', () => {
    it('should delete category successfully', () => {
      const category: Category = { id: 1, name: 'Bebidas', default_tax_rate: 16, active: true };
      component.deleteCategory(category);

      expect(component.isLoading()).toBe(true);
    });
  });
});