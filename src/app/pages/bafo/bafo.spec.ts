import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Bafo } from './bafo';

describe('Bafo', () => {
  let component: Bafo;
  let fixture: ComponentFixture<Bafo>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Bafo],
    }).compileComponents();

    fixture = TestBed.createComponent(Bafo);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
