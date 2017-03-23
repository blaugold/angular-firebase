import { Injectable } from '@angular/core'
import { Observable } from 'rxjs/Observable'
import { ReplaySubject } from 'rxjs/ReplaySubject'
import { AuthProvider, AuthCredential } from './reexports'
import { NativeFirebaseAuth, FirebaseError } from './native-firebase'
import { wrapPromise } from './utils'
import './observable/add/run-in-zone'
import { FirebaseUser, FirebaseUserCredential } from './firebase-user'
import 'rxjs/add/operator/map'

export type AuthErrorCodeType =
  'auth/app-deleted'
    | 'auth/app-not-authorized'
    | 'auth/argument-error'
    | 'auth/invalid-api-key'
    | 'auth/invalid-user-token'
    | 'auth/network-request-failed'
    | 'auth/operation-not-allowed'
    | 'auth/requires-recent-login'
    | 'auth/too-many-requests'
    | 'auth/unauthorized-domain'
    | 'auth/user-disabled'
    | 'auth/user-token-expired'
    | 'auth/web-storage-unsupported'

export interface AuthError extends FirebaseError {
  code: AuthErrorCodeType | string
  email?: string
  credential?: AuthCredential
}

export interface ActionCodeError extends AuthError {
  code: AuthErrorCodeType
    | 'auth/expired-action-code'
    | 'auth/invalid-action-code'
    | 'auth/user-disabled'
    | 'auth/user-not-found'
}

export interface ConfirmPasswordResetError extends AuthError {
  code: AuthErrorCodeType
    | 'auth/expired-action-code'
    | 'auth/invalid-action-code'
    | 'auth/user-disabled'
    | 'auth/user-not-found'
    | 'auth/weak-password'
}

export interface CreateUserWithEmailAndPasswordError extends AuthError {
  code: AuthErrorCodeType
    | 'auth/email-already-in-use'
    | 'auth/invalid-email'
    | 'auth/operation-not-allowed'
    | 'auth/weak-password'
}

export interface FetchProvidersForEmailError extends AuthError {
  code: AuthErrorCodeType
    | 'auth/invalid-email'
}

export interface GetRedirectResultError extends AuthError {
  code: AuthErrorCodeType
    | 'auth/invalid-email'
    | 'auth/user-not-found'
}

export interface SendPasswordResetEmailError extends AuthError {
  code: AuthErrorCodeType
    | 'auth/invalid-email'
    | 'auth/user-not-found'
}

export interface SignInAnonymouslyError extends AuthError {
  code: AuthErrorCodeType
    | 'auth/operation-not-allowed'
}

export interface SignInWithCredentialError extends AuthError {
  code: AuthErrorCodeType
    | 'auth/account-exists-with-different-credential'
    | 'auth/invalid-credential'
    | 'auth/operation-not-allowed'
    | 'auth/user-disabled'
    | 'auth/user-not-found'
    | 'auth/wrong-password'
}

export interface SignInWithCustomTokenError extends AuthError {
  code: AuthErrorCodeType
    | 'auth/custom-token-mismatch'
    | 'auth/invalid-custom-token'
}

export interface SignInWithEmailAndPasswordError extends AuthError {
  code: AuthErrorCodeType
    | 'auth/invalid-email'
    | 'auth/user-disabled'
    | 'auth/user-not-found'
    | 'auth/wrong-password'
}

export interface SignInWithPopupError extends AuthError {
  code: AuthErrorCodeType
    | 'auth/account-exists-with-different-credential'
    | 'auth/auth-domain-config-required'
    | 'auth/cancelled-popup-request'
    | 'auth/operation-not-allowed'
    | 'auth/operation-not-supported-in-this-environment'
    | 'auth/popup-blocked'
    | 'auth/popup-closed-by-user'
    | 'auth/unauthorized-domain'
}

export interface SignInWithRedirectError extends AuthError {
  code: AuthErrorCodeType
    |'auth/auth-domain-config-required'
    | 'auth/operation-not-supported-in-this-environment'
    | 'auth/unauthorized-domain'
}

export interface VerifyPasswordResetCodeError extends AuthError {
  code: AuthErrorCodeType
    | 'auth/expired-action-code'
    | 'auth/invalid-action-code'
    | 'auth/user-disabled'
    | 'auth/user-not-found'
}

export interface ActionCodeInfo {
  email: string
}

@Injectable()
export class FirebaseAuth {

  $user: Observable<FirebaseUser | null>

  constructor(private fbAuth: NativeFirebaseAuth) {
    this.$user = new ReplaySubject<FirebaseUser | null>(1)

    new Observable<FirebaseUser | null>(sub => fbAuth.onAuthStateChanged(
      (user: firebase.User) => sub.next(user ? new FirebaseUser(user) : null),
      err => sub.error(err),
      () => sub.complete()
    ))
      .runInZone()
      .subscribe(this.$user as ReplaySubject<FirebaseUser | null>)
  }

  /**
   * @param code
   * @returns {Observable<void>} - Returns {@link ActionCodeError} if operation fails.
   */
  applyActionCode(code: string): Observable<void> {
    return wrapPromise<void>(() => this.fbAuth.applyActionCode(code))
  }

  /**
   * @param code
   * @returns {Observable<ActionCodeInfo>} - Returns {@link ActionCodeError} if operation fails.
   */
  checkActionCode(code: string): Observable<ActionCodeInfo> {
    return wrapPromise<ActionCodeInfo>(() => this.fbAuth.checkActionCode(code))
  }

  /**
   * @param code
   * @param newPassword
   * @returns {Observable<void>} - Returns {@link ConfirmPasswordResetError} if operation fails.
   */
  confirmPasswordReset(code: string, newPassword: string): Observable<void> {
    return wrapPromise<void>(() => this.fbAuth.confirmPasswordReset(code, newPassword))
  }

  /**
   *
   * @param email
   * @param password
   * @returns {Observable<FirebaseUser>} - Returns {@link CreateUserWithEmailAndPasswordError} if
   *     operation fails.
   */
  createUserWithEmailAndPassword(email: string, password: string): Observable<FirebaseUser> {
    return wrapPromise(() => this.fbAuth.createUserWithEmailAndPassword(email, password))
      .map(user => new FirebaseUser(user));
  }

  /**
   *
   * @param email
   * @returns {Observable<string[]>} - Returns {@link FetchProvidersForEmailError} if operation
   *     fails.
   */
  fetchProvidersForEmail(email: string): Observable<string[]> {
    return wrapPromise<string[]>(() => this.fbAuth.fetchProvidersForEmail(email))
  }

  /**
   * @returns {Observable<FirebaseUserCredential>} - Returns {@link GetRedirectResultError} if
   *     operation fails.
   */
  getRedirectResult(): Observable<FirebaseUserCredential> {
    return wrapPromise(() => this.fbAuth.getRedirectResult())
      .map(cred => new FirebaseUserCredential(cred));
  }

  /**
   * @param email
   * @returns {Observable<void>} - Returns {@link SendPasswordResetEmailError} if operation fails.
   */
  sendPasswordResetEmail(email: string): Observable<void> {
    return wrapPromise<void>(() => this.fbAuth.sendPasswordResetEmail(email))
  }

  /**
   *
   * @returns {Observable<FirebaseUser>} - Returns {@link SignInAnonymouslyError} if operation
   *     fails.
   */
  signInAnonymously(): Observable<FirebaseUser> {
    return wrapPromise(() => this.fbAuth.signInAnonymously())
      .map(user => new FirebaseUser(user));
  }

  /**
   * @param credential
   * @returns {Observable<FirebaseUser>} - Returns {@link SignInWithCredentialError} if operation
   *     fails.
   */
  signInWithCredential(credential: AuthCredential): Observable<FirebaseUser> {
    return wrapPromise(() => this.fbAuth.signInWithCredential(credential))
      .map(user => new FirebaseUser(user));
  }

  /**
   * @param token
   * @returns {Observable<FirebaseUser>} - Returns {@link SignInWithCustomTokenError} if operation
   *     fails.
   */
  signInWithCustomToken(token: string): Observable<FirebaseUser> {
    return wrapPromise(() => this.fbAuth.signInWithCustomToken(token))
      .map(user => new FirebaseUser(user));
  }

  /**
   * @param email
   * @param password
   * @returns {Observable<FirebaseUser>} - Returns {@link SignInWithEmailAndPasswordError} if
   *     operation fails.
   */
  signInWithEmailAndPassword(email: string, password: string): Observable<FirebaseUser> {
    return wrapPromise(() => this.fbAuth.signInWithEmailAndPassword(email, password))
      .map(user => new FirebaseUser(user));
  }

  /**
   * @param provider
   * @returns {Observable<FirebaseUser>} - Returns {@link SignInWithPopupError} if operation fails.
   */
  signInWithPopup(provider: AuthProvider): Observable<FirebaseUserCredential> {
    return wrapPromise(() => this.fbAuth.signInWithPopup(provider))
      .map(cred => new FirebaseUserCredential(cred));
  }

  /**
   * @param provider
   * @returns {Observable<FirebaseUser>} - Returns {@link SignInWithRedirectError} if operation
   *     fails.
   */
  signInWithRedirect(provider: AuthProvider): Observable<FirebaseUserCredential> {
    return wrapPromise(() => this.fbAuth.signInWithRedirect(provider))
      .map(cred => new FirebaseUserCredential(cred));
  }

  signOut(): Observable<void> {
    return wrapPromise<void>(() => this.fbAuth.signOut())
  }

  /**
   *
   * @param code
   * @returns {Observable<string>} - Returns {@link VerifyPasswordResetCodeError} if operation
   * fails.
   */
  verifyPasswordResetCode(code: string): Observable<string> {
    return wrapPromise<string>(() => this.fbAuth.verifyPasswordResetCode(code))
  }
}
