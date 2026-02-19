import { ComponentFixture, TestBed } from '@angular/core/testing';

import { IndexList } from './index-list';

describe('IndexList', () => {
  let component: IndexList;
  let fixture: ComponentFixture<IndexList>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IndexList]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IndexList);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
