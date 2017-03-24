import { TestBed } from '@angular/core/testing'
import { FirebaseModule } from './firebase.module'
import { FirebaseAuth } from './firebase-auth.service'
import { FirebaseUser } from './firebase-user'
import { awaitPromise } from './utils.spec'

describe('FirebaseUser', () => {

  describe('Password & Email', () => {
    const userCreds = { email: randomEmail(), password: 'password' };
    const profile   = { displayName: 'Bob', photoURL: 'photo://url' }
    let auth: FirebaseAuth;
    let user: FirebaseUser;

    it('should sign up', awaitPromise(async function () {
      TestBed.configureTestingModule({
        imports: [FirebaseModule.primaryApp({ options: firebaseConfig })]
      })

      auth = TestBed.get(FirebaseAuth);
      user = await auth.createUserWithEmailAndPassword(userCreds.email, userCreds.password)
        .toPromise()

    }));

    it('should update profile', awaitPromise(async function () {
      await user.updateProfile(profile).toPromise();
    }));

    it('should forward User fields', () => {
      expect(user.isAnonymous).toBeFalsy();
      expect(user.email).toEqual(userCreds.email);
      expect(user.displayName).toEqual(profile.displayName);
      expect(user.photoURL).toEqual(profile.photoURL);
      expect(user.emailVerified).toBe(false);
      expect(user.providerId).toBe('firebase');
      expect(user.uid.length > 10).toBeTruthy();
      expect(user.refreshToken).toBeDefined();
      expect(user.providerData[0]!.uid).toEqual(user.email as string)
    })

    it('should get token', awaitPromise(async function () {
      const token = await user.getToken(true).toPromise();
      expect(typeof token === 'string').toBeTruthy()
    }))

    // Only applicable for providers other than password.
    it('should reauthenticate', () => pending())

    it('should link', () => pending())
    it('should linkWithPopup', () => pending())
    it('should linkWithRedirect', () => pending())
    it('should unlink', () => pending())

    it('should reload user profile', awaitPromise(async function () {
      await user.reload().toPromise()
    }))

    it('should send email verification', awaitPromise(async function () {
      await user.sendEmailVerification().toPromise()
    }))

    it('should update email', awaitPromise(async function () {
      userCreds.email = randomEmail();
      await user.updateEmail(userCreds.email).toPromise();
      expect(user.email).toBe(userCreds.email);
    }))

    it('should update password', awaitPromise(async function () {
      userCreds.password = randomString();
      await user.updatePassword(userCreds.password).toPromise();
      user = await auth.signInWithEmailAndPassword(userCreds.email, userCreds.password).toPromise();
      expect(user).toBeDefined();
    }))

    it('should delete user', awaitPromise(async function () {
      await user.delete().toPromise();
    }));
  });
});


function randomString() {
  return Math.random().toString(36).substring(7);
}

function randomEmail() {
  return `${randomString()}@yopmail.com`;
}