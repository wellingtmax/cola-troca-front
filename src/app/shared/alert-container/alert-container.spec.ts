import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertContainer } from './alert-container';

describe('AlertContainer', () => {
  let component: AlertContainer;
  let fixture: ComponentFixture<AlertContainer>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AlertContainer],
    }).compileComponents();

    fixture = TestBed.createComponent(AlertContainer);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
