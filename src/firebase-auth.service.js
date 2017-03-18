"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const rxjs_1 = require("rxjs");
const native_firebase_1 = require("./native-firebase");
const utils_1 = require("./utils");
require("./observable/add/run-in-zone");
const firebase_user_1 = require("./firebase-user");
class FirebaseAuth {
    constructor(fbAuth, ngZone) {
        this.fbAuth = fbAuth;
        this.ngZone = ngZone;
        this.$user = new rxjs_1.BehaviorSubject('pending');
        new rxjs_1.Observable(sub => fbAuth.onAuthStateChanged(user => sub.next(user ? new firebase_user_1.FirebaseUser(user) : null), err => sub.error(err), () => sub.complete()))
            .runInZone(this.ngZone)
            .subscribe(this.$user);
    }
    /**
     * @param code
     * @returns {Observable<void>} - Returns {@link ActionCodeError} if operation fails.
     */
    applyActionCode(code) {
        return utils_1.wrapPromise(() => this.fbAuth.applyActionCode(code));
    }
    /**
     * @param code
     * @returns {Observable<ActionCodeInfo>} - Returns {@link ActionCodeError} if operation fails.
     */
    checkActionCode(code) {
        return utils_1.wrapPromise(() => this.fbAuth.checkActionCode(code));
    }
    /**
     * @param code
     * @param newPassword
     * @returns {Observable<void>} - Returns {@link ConfirmPasswordResetError} if operation fails.
     */
    confirmPasswordReset(code, newPassword) {
        return utils_1.wrapPromise(() => this.fbAuth.confirmPasswordReset(code, newPassword));
    }
    /**
     *
     * @param email
     * @param password
     * @returns {Observable<FirebaseUser>} - Returns {@link CreateUserWithEmailAndPasswordError} if
     *     operation fails.
     */
    createUserWithEmailAndPassword(email, password) {
        return utils_1.wrapPromise(() => this.fbAuth.createUserWithEmailAndPassword(email, password))
            .map(user => new firebase_user_1.FirebaseUser(user));
    }
    /**
     *
     * @param email
     * @returns {Observable<string[]>} - Returns {@link FetchProvidersForEmailError} if operation
     *     fails.
     */
    fetchProvidersForEmail(email) {
        return utils_1.wrapPromise(() => this.fbAuth.fetchProvidersForEmail(email));
    }
    /**
     * @returns {Observable<FirebaseUserCredential>} - Returns {@link GetRedirectResultError} if
     *     operation fails.
     */
    getRedirectResult() {
        return utils_1.wrapPromise(() => this.fbAuth.getRedirectResult())
            .map(cred => new firebase_user_1.FirebaseUserCredential(cred));
    }
    /**
     * @param email
     * @returns {Observable<void>} - Returns {@link SendPasswordResetEmailError} if operation fails.
     */
    sendPasswordResetEmail(email) {
        return utils_1.wrapPromise(() => this.fbAuth.sendPasswordResetEmail(email));
    }
    /**
     *
     * @returns {Observable<FirebaseUser>} - Returns {@link SignInAnonymouslyError} if operation
     *     fails.
     */
    signInAnonymously() {
        return utils_1.wrapPromise(() => this.fbAuth.signInAnonymously())
            .map(user => new firebase_user_1.FirebaseUser(user));
    }
    /**
     * @param credential
     * @returns {Observable<FirebaseUser>} - Returns {@link SignInWithCredentialError} if operation
     *     fails.
     */
    signInWithCredential(credential) {
        return utils_1.wrapPromise(() => this.fbAuth.signInWithCredential(credential))
            .map(user => new firebase_user_1.FirebaseUser(user));
    }
    /**
     * @param token
     * @returns {Observable<FirebaseUser>} - Returns {@link SignInWithCustomTokenError} if operation
     *     fails.
     */
    signInWithCustomToken(token) {
        return utils_1.wrapPromise(() => this.fbAuth.signInWithCustomToken(token))
            .map(user => new firebase_user_1.FirebaseUser(user));
    }
    /**
     * @param email
     * @param password
     * @returns {Observable<FirebaseUser>} - Returns {@link SignInWithEmailAndPasswordError} if
     *     operation fails.
     */
    signInWithEmailAndPassword(email, password) {
        return utils_1.wrapPromise(() => this.fbAuth.signInWithEmailAndPassword(email, password))
            .map(user => new firebase_user_1.FirebaseUser(user));
    }
    /**
     * @param provider
     * @returns {Observable<FirebaseUser>} - Returns {@link SignInWithPopupError} if operation fails.
     */
    signInWithPopup(provider) {
        return utils_1.wrapPromise(() => this.fbAuth.signInWithPopup(provider))
            .map(cred => new firebase_user_1.FirebaseUserCredential(cred));
    }
    /**
     * @param provider
     * @returns {Observable<FirebaseUser>} - Returns {@link SignInWithRedirectError} if operation
     *     fails.
     */
    signInWithRedirect(provider) {
        return utils_1.wrapPromise(() => this.fbAuth.signInWithRedirect(provider))
            .map(cred => new firebase_user_1.FirebaseUserCredential(cred));
    }
    signOut() {
        return utils_1.wrapPromise(() => this.fbAuth.signOut());
    }
    /**
     *
     * @param code
     * @returns {Observable<string>} - Returns {@link VerifyPasswordResetCodeError} if operation
     * fails.
     */
    verifyPasswordResetCode(code) {
        return utils_1.wrapPromise(() => this.fbAuth.verifyPasswordResetCode(code));
    }
}
FirebaseAuth.decorators = [
    { type: core_1.Injectable },
];
/** @nocollapse */
FirebaseAuth.ctorParameters = () => [
    { type: native_firebase_1.NativeFirebaseAuth, },
    { type: core_1.NgZone, },
];
exports.FirebaseAuth = FirebaseAuth;
