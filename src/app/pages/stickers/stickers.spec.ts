import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Stickers } from './stickers';

describe('Stickers', () => {
  let component: Stickers;
  let fixture: ComponentFixture<Stickers>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Stickers],
    }).compileComponents();

    fixture = TestBed.createComponent(Stickers);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
