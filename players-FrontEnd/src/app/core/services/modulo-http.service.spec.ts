import { TestBed } from '@angular/core/testing';

import { ModuloHTTPService } from './modulo-http.service';

describe('ModuloHTTPService', () => {
  let service: ModuloHTTPService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ModuloHTTPService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
