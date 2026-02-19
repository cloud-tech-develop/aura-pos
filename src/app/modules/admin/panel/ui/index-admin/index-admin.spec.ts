import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexAdmin } from './index-admin';

describe('IndexAdmin', () => {
  let component: IndexAdmin;
  let fixture: ComponentFixture<IndexAdmin>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndexAdmin]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexAdmin);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
