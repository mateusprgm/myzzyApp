import { TestBed } from '@angular/core/testing';

import { SocketioServiceService } from './socketio-service.service';

describe('SocketioServiceService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SocketioServiceService = TestBed.get(SocketioServiceService);
    expect(service).toBeTruthy();
  });
});
