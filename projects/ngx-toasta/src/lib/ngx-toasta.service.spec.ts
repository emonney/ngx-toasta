import { TestBed, inject } from '@angular/core/testing';

import { NgxToastaService } from './ngx-toasta.service';

describe('NgxToastaService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NgxToastaService]
    });
  });

  it('should be created', inject([NgxToastaService], (service: NgxToastaService) => {
    expect(service).toBeTruthy();
  }));
});
