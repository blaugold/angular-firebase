/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing'
import { FirebaseModule, Firebase } from './firebase.module'

describe('Service: FirebaseAuth', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FirebaseModule.forRoot([{ config: firebaseConfig }])],
    });
  });

  it('should ...', inject([Firebase], (service: Firebase) => {
    expect(service).toBeTruthy();
  }));
});
