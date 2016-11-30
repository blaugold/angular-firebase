import { UserInfo } from 'firebase'
import { Observable } from 'rxjs'
import { auth, User } from 'firebase'
import { FirebaseError } from './native-firebase'
import { AuthCredential } from './reexports'
import { wrapPromise } from './utils'

export type UserCredential = auth.UserCredential;

export class FirebaseUserCredential {
  credential?: AuthCredential;
  user?: FirebaseUser;

  constructor(cred: UserCredential) {
    this.credential = cred.credential;
    this.user = cred.user ? new FirebaseUser(cred.user) : null;
  }
}

export interface DeleteUserError extends FirebaseError {
  code: 'auth/requires-recent-login'
}

export interface LinkUserError extends FirebaseError {
  code: 'auth/provider-already-linked'
    | 'auth/invalid-credential'
    | 'auth/credential-already-in-use'
    | 'auth/email-already-in-use'
    | 'auth/operation-not-allowed'
    | 'auth/invalid-email'
    | 'auth/wrong-password'
}

export interface LinkUserWithPopupError extends FirebaseError {
  code: 'auth/auth-domain-config-required'
    | 'auth/cancelled-popup-request'
    | 'auth/credential-already-in-use'
    | 'auth/email-already-in-use'
    | 'auth/operation-not-allowed'
    | 'auth/popup-blocked'
    | 'auth/operation-not-supported-in-this-environment'
    | 'auth/popup-closed-by-user'
    | 'auth/provider-already-linked'
    | 'auth/unauthorized-domain'
}

export interface LinkUserWithRedirectError extends FirebaseError {
  code: 'auth/auth-domain-config-required'
    | 'auth/operation-not-supported-in-this-environment'
    | 'auth/provider-already-linked'
    | 'auth/unauthorized-domain'
}

export interface ReauthenticateError extends FirebaseError {
  code: 'auth/user-mismatch'
    | 'auth/user-not-found'
    | 'auth/invalid-credential'
    | 'auth/invalid-email'
    | 'auth/wrong-password'
}

export interface UpdateEmailError extends FirebaseError {
  code: 'auth/invalid-email'
    | 'auth/email-already-in-use'
    | 'auth/requires-recent-login'
}

export interface UpdatePasswordError extends FirebaseError {
  code: 'auth/weak-password'
    | 'auth/requires-recent-login'
}

export class FirebaseUser {

  get displayName(): string {
    return this.user.displayName
  }

  get email(): string {
    return this.user.email
  }

  get emailVerified(): boolean {
    return this.user.emailVerified;
  }

  get isAnonymous(): boolean {
    return this.user.isAnonymous;
  }

  get photoURL(): string {
    return this.user.photoURL;
  }

  get providerData(): UserInfo[] {
    return this.user.providerData;
  }

  get providerId(): string {
    return this.user.providerId;
  }

  get refreshToken(): string {
    return this.user.refreshToken;
  }

  get uid(): string {
    return this.user.uid
  }

  constructor(private user: User) {}

  /**
   * @returns {Observable<void>} - Returns {@link DeleteUserError} if operation fails.
   */
  delete(): Observable<void> {
    return wrapPromise(() => this.user.delete());
  }

  getToken(forceRefresh?: boolean): Observable<string> {
    return wrapPromise(() => this.user.getToken(forceRefresh));
  }

  /**
   * @returns {Observable<FirebaseUser>} - Returns {@link LinkUserError} if operation fails.
   */
  link(credential: AuthCredential): Observable<FirebaseUser> {
    return wrapPromise(() => this.user.link(credential))
      .map(user => new FirebaseUser(user));
  }

  /**
   * @returns {Observable<FirebaseUserCredential>} - Returns {@link LinkUserWithPopupError} if operation
   * fails.
   */
  linkWithPopup(provider: auth.AuthProvider): Observable<FirebaseUserCredential> {
    return wrapPromise(() => this.user.linkWithPopup(provider))
      .map(cred => new FirebaseUserCredential(cred));
  }

  /**
   * @returns {Observable<FirebaseUserCredential>} - Returns {@link LinkUserWithRedirectError} if operation
   * fails.
   */
  linkWithRedirect(provider: auth.AuthProvider): Observable<FirebaseUserCredential> {
    return wrapPromise(() => this.user.linkWithRedirect(provider))
      .map(cred => new FirebaseUserCredential(cred));
  }

  /**
   * @returns {Observable<void>} - Returns {@link ReauthenticateError} if operation
   * fails.
   */
  reauthenticate(credential: AuthCredential): Observable<void> {
    return wrapPromise(() => this.user.reauthenticate(credential));
  }

  reload(): Observable<void> {
    return wrapPromise(() => this.user.reload());
  }

  sendEmailVerification(): Observable<void> {
    return wrapPromise(() => this.user.sendEmailVerification());
  }

  unlink(providerId: string): Observable<FirebaseUser> {
    return wrapPromise(() => this.user.unlink(providerId))
      .map(user => new FirebaseUser(user));
  }

  /**
   * @returns {Observable<void>} - Returns {@link UpdateEmailError} if operation
   * fails.
   */
  updateEmail(newEmail: string): Observable<void> {
    return wrapPromise(() => this.user.updateEmail(newEmail));
  }

  /**
   * @returns {Observable<void>} - Returns {@link UpdatePasswordError} if operation
   * fails.
   */
  updatePassword(newPassword: string): Observable<void> {
    return wrapPromise(() => this.user.updatePassword(newPassword));
  }

  updateProfile(profile: {displayName?: string, photoURL?: string}): Observable<void> {
    return wrapPromise<void>(() => this.user.updateProfile(profile as any));
  }
}
