import { TestBed } from '@angular/core/testing';

import { StoreService } from './store.js';

describe('StoreTs', () => {
  let service: StoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
