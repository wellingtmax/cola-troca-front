import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Duplicates } from './duplicates';

describe('Duplicates', () => {
  let component: Duplicates;
  let fixture: ComponentFixture<Duplicates>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Duplicates],
    }).compileComponents();

    fixture = TestBed.createComponent(Duplicates);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
