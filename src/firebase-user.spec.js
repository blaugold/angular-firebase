"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@angular/core/testing");
const firebase_module_1 = require("./firebase.module");
const firebase_auth_service_1 = require("./firebase-auth.service");
const utils_spec_1 = require("./utils.spec");
describe('FirebaseUser', () => {
    describe('Password & Email', () => {
        const userCreds = { email: randomEmail(), password: 'password' };
        const profile = { displayName: 'Bob', photoURL: 'photo://url' };
        let auth;
        let user;
        it('should sign up', utils_spec_1.awaitPromise(function () {
            return __awaiter(this, void 0, void 0, function* () {
                testing_1.TestBed.configureTestingModule({
                    imports: [firebase_module_1.FirebaseModule.primaryApp({ options: firebaseConfig })]
                });
                auth = testing_1.TestBed.get(firebase_auth_service_1.FirebaseAuth);
                user = yield auth.createUserWithEmailAndPassword(userCreds.email, userCreds.password)
                    .toPromise();
            });
        }));
        it('should update profile', utils_spec_1.awaitPromise(function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield user.updateProfile(profile).toPromise();
            });
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
            expect(user.providerData[0].uid).toEqual(user.email);
        });
        it('should get token', utils_spec_1.awaitPromise(function () {
            return __awaiter(this, void 0, void 0, function* () {
                const token = yield user.getToken(true).toPromise();
                expect(typeof token === 'string').toBeTruthy();
            });
        }));
        // Only applicable for providers other than password.
        it('should reauthenticate', () => pending());
        it('should link', () => pending());
        it('should linkWithPopup', () => pending());
        it('should linkWithRedirect', () => pending());
        it('should unlink', () => pending());
        it('should reload user profile', utils_spec_1.awaitPromise(function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield user.reload().toPromise();
            });
        }));
        it('should send email verification', utils_spec_1.awaitPromise(function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield user.sendEmailVerification().toPromise();
            });
        }));
        it('should update email', utils_spec_1.awaitPromise(function () {
            return __awaiter(this, void 0, void 0, function* () {
                userCreds.email = randomEmail();
                yield user.updateEmail(userCreds.email).toPromise();
                expect(user.email).toBe(userCreds.email);
            });
        }));
        it('should update password', utils_spec_1.awaitPromise(function () {
            return __awaiter(this, void 0, void 0, function* () {
                userCreds.password = randomString();
                yield user.updatePassword(userCreds.password).toPromise();
                user = yield auth.signInWithEmailAndPassword(userCreds.email, userCreds.password).toPromise();
                expect(user).toBeDefined();
            });
        }));
        it('should delete user', utils_spec_1.awaitPromise(function () {
            return __awaiter(this, void 0, void 0, function* () {
                yield user.delete().toPromise();
            });
        }));
    });
});
function randomString() {
    return Math.random().toString(36).substring(7);
}
function randomEmail() {
    return `${randomString()}@yopmail.com`;
}
