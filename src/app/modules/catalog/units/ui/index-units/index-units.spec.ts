import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { IndexUnits } from './index-units';
import { UnitsService } from '../../services';
import { Unit } from '../../interfaces';

describe('IndexUnits', () => {
  let component: IndexUnits;
  let fixture: ComponentFixture<IndexUnits>;

  // Mock de UnitsService
  const mockUnitsService = {
    page: () => {
      return {
        subscribe: (callbacks: { next: (res: { error: boolean; data?: { items: Unit[]; total: number; page: number; limit: number } }) => void }) => {
          callbacks.next({
            error: false,
            data: {
              items: [
                { id: 1, name: 'Kilogramo', abbreviation: 'kg', active: true, allow_decimals: true },
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
      imports: [IndexUnits, HttpClientTestingModule],
      providers: [
        { provide: UnitsService, useValue: mockUnitsService },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(IndexUnits);
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

    it('should have empty units initially', () => {
      expect(component.units()).toEqual([]);
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

    it('should have selectedUnit as null initially', () => {
      expect(component.selectedUnit()).toBeNull();
    });
  });

  describe('loadUnits', () => {
    it('should load units successfully', () => {
      const mockEvent = { first: 0, rows: 10 } as any;
      component.loadUnits(mockEvent);

      expect(component.isLoading()).toBe(true);
    });

    it('should update units after loading', () => {
      const mockEvent = { first: 0, rows: 10 } as any;
      component.loadUnits(mockEvent);

      expect(component.units().length).toBe(1);
      expect(component.totalRecords()).toBe(1);
    });
  });

  describe('onSearch', () => {
    it('should call loadUnits with default values', () => {
      component.onSearch();
      expect(component.isLoading()).toBe(true);
    });
  });

  describe('openCreateDialog', () => {
    it('should open create dialog', () => {
      component.openCreateDialog();

      expect(component.showDialog()).toBe(true);
      expect(component.isEditing()).toBe(false);
      expect(component.selectedUnit()).toBeNull();
    });
  });

  describe('openEditDialog', () => {
    it('should open edit dialog with unit', () => {
      const unit: Unit = { id: 1, name: 'Kilogramo', abbreviation: 'kg', active: true, allow_decimals: true };
      component.openEditDialog(unit);

      expect(component.showDialog()).toBe(true);
      expect(component.isEditing()).toBe(true);
      expect(component.selectedUnit()).toEqual(unit);
    });
  });

  describe('hideDialog', () => {
    it('should hide dialog and clear selected unit', () => {
      component.showDialog.set(true);
      component.selectedUnit.set({ id: 1, name: 'Test', abbreviation: 't', active: true, allow_decimals: false } as Unit);

      component.hideDialog();

      expect(component.showDialog()).toBe(false);
      expect(component.selectedUnit()).toBeNull();
    });
  });

  describe('deleteUnit', () => {
    it('should delete unit successfully', () => {
      const unit: Unit = { id: 1, name: 'Kilogramo', abbreviation: 'kg', active: true, allow_decimals: true };
      component.deleteUnit(unit);

      expect(component.isLoading()).toBe(true);
    });
  });
});