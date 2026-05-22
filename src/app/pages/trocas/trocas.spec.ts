import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Trocas } from './trocas';

describe('Trocas', () => {
  let component: Trocas;
  let fixture: ComponentFixture<Trocas>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Trocas],
    }).compileComponents();

    fixture = TestBed.createComponent(Trocas);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
