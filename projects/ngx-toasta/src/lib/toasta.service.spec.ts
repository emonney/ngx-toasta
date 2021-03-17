import { TestBed } from '@angular/core/testing';

import { ToastaService } from './toasta.service';

describe('ToastaService', () => {
  let service: ToastaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ToastaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
