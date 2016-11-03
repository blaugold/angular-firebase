/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FirebaseAuthService } from './firebase-auth.service';

describe('Service: FirebaseAuth', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [FirebaseAuthService]
    });
  });

  it('should ...', inject([FirebaseAuthService], (service: FirebaseAuthService) => {
    expect(service).toBeTruthy();
  }));
});
