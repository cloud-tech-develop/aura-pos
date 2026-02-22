import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidatorErrors } from './validator-errors';

describe('ValidatorErrors', () => {
  let component: ValidatorErrors;
  let fixture: ComponentFixture<ValidatorErrors>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidatorErrors],
    }).compileComponents();

    fixture = TestBed.createComponent(ValidatorErrors);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
