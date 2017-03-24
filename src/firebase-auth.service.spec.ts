/* tslint:disable:no-unused-variable */
import { inject, TestBed } from '@angular/core/testing'
import { FirebaseApp } from './firebase-app.service'
import { FirebaseAuth } from './firebase-auth.service'
import { FirebaseModule } from './firebase.module'

let firebaseApp: FirebaseApp

describe('Service: FirebaseAuth', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FirebaseModule.primaryApp({ options: firebaseConfig })],
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
