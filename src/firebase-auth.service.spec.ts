/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { FirebaseAuthService } from './firebase-auth.service';
import { environment } from '../environment.test'
import { FirebaseModule, Firebase } from './firebase.module'

describe('Service: FirebaseAuth', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FirebaseModule.forRoot([{ config: environment.firebaseConfig }])],
    });
  });

  it('should ...', inject([Firebase], (service: Firebase) => {
    expect(service).toBeTruthy();
  }));
});
