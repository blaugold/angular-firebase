"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
class FirebaseUserCredential {
    constructor(cred) {
        this.credential = cred.credential;
        this.user = cred.user ? new FirebaseUser(cred.user) : null;
    }
}
exports.FirebaseUserCredential = FirebaseUserCredential;
class FirebaseUser {
    constructor(user) {
        this.user = user;
    }
    get displayName() {
        return this.user.displayName;
    }
    get email() {
        return this.user.email;
    }
    get emailVerified() {
        return this.user.emailVerified;
    }
    get isAnonymous() {
        return this.user.isAnonymous;
    }
    get photoURL() {
        return this.user.photoURL;
    }
    get providerData() {
        return this.user.providerData;
    }
    get providerId() {
        return this.user.providerId;
    }
    get refreshToken() {
        return this.user.refreshToken;
    }
    get uid() {
        return this.user.uid;
    }
    /**
     * @returns {Observable<void>} - Returns {@link DeleteUserError} if operation fails.
     */
    delete() {
        return utils_1.wrapPromise(() => this.user.delete());
    }
    getToken(forceRefresh) {
        return utils_1.wrapPromise(() => this.user.getToken(forceRefresh));
    }
    /**
     * @returns {Observable<FirebaseUser>} - Returns {@link LinkUserError} if operation fails.
     */
    link(credential) {
        return utils_1.wrapPromise(() => this.user.link(credential))
            .map(user => new FirebaseUser(user));
    }
    /**
     * @returns {Observable<FirebaseUserCredential>} - Returns {@link LinkUserWithPopupError} if
     *     operation fails.
     */
    linkWithPopup(provider) {
        return utils_1.wrapPromise(() => this.user.linkWithPopup(provider))
            .map(cred => new FirebaseUserCredential(cred));
    }
    /**
     * @returns {Observable<FirebaseUserCredential>} - Returns {@link LinkUserWithRedirectError} if
     *     operation fails.
     */
    linkWithRedirect(provider) {
        return utils_1.wrapPromise(() => this.user.linkWithRedirect(provider))
            .map(cred => new FirebaseUserCredential(cred));
    }
    /**
     * @returns {Observable<void>} - Returns {@link ReauthenticateError} if operation
     * fails.
     */
    reauthenticate(credential) {
        return utils_1.wrapPromise(() => this.user.reauthenticate(credential));
    }
    reload() {
        return utils_1.wrapPromise(() => this.user.reload());
    }
    sendEmailVerification() {
        return utils_1.wrapPromise(() => this.user.sendEmailVerification());
    }
    unlink(providerId) {
        return utils_1.wrapPromise(() => this.user.unlink(providerId))
            .map(user => new FirebaseUser(user));
    }
    /**
     * @returns {Observable<void>} - Returns {@link UpdateEmailError} if operation
     * fails.
     */
    updateEmail(newEmail) {
        return utils_1.wrapPromise(() => this.user.updateEmail(newEmail));
    }
    /**
     * @returns {Observable<void>} - Returns {@link UpdatePasswordError} if operation
     * fails.
     */
    updatePassword(newPassword) {
        return utils_1.wrapPromise(() => this.user.updatePassword(newPassword));
    }
    updateProfile(profile) {
        return utils_1.wrapPromise(() => this.user.updateProfile(profile));
    }
}
exports.FirebaseUser = FirebaseUser;
