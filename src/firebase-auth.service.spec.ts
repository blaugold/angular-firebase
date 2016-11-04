/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing'
import { FirebaseModule, Firebase } from './firebase.module'
import { FirebaseAppConfig, FirebaseApp } from './firebase-app.service'
import { FirebaseAuth } from './firebase-auth.service'

let firebaseApp: FirebaseApp

describe('Service: FirebaseAuth', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FirebaseModule.forRoot([new FirebaseAppConfig({ options: firebaseConfig })])],
    });

    firebaseApp = TestBed.get(FirebaseApp)
  });

  afterEach(done => {
    firebaseApp.delete().toPromise().then(done, done)
  })

  it('should provide default FirebaseAuth', inject([FirebaseAuth], (auth: FirebaseAuth) => {
    expect(auth).toBe(firebaseApp.auth())
  }));
});
