import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StickerCard } from './sticker-card';

describe('StickerCard', () => {
  let component: StickerCard;
  let fixture: ComponentFixture<StickerCard>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StickerCard],
    }).compileComponents();

    fixture = TestBed.createComponent(StickerCard);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
