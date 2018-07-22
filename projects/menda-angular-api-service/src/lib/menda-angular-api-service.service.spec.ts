import { TestBed, inject } from '@angular/core/testing';

import { MendaAngularApiServiceService } from './menda-angular-api-service.service';

describe('MendaAngularApiServiceService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [MendaAngularApiServiceService]
    });
  });

  it('should be created', inject([MendaAngularApiServiceService], (service: MendaAngularApiServiceService) => {
    expect(service).toBeTruthy();
  }));
});
