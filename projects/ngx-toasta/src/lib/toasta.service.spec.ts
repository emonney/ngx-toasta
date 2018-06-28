import { TestBed, inject } from '@angular/core/testing';

import { ToastaService } from './toasta.service';

describe('NgxToastaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ToastaService]
    });
  });

  it('should be created', inject([ToastaService], (service: ToastaService) => {
    expect(service).toBeTruthy();
  }));
});
