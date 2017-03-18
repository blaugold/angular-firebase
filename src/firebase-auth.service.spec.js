"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-unused-variable */
const testing_1 = require("@angular/core/testing");
const firebase_module_1 = require("./firebase.module");
const firebase_app_service_1 = require("./firebase-app.service");
const firebase_auth_service_1 = require("./firebase-auth.service");
let firebaseApp;
describe('Service: FirebaseAuth', () => {
    beforeEach(() => {
        testing_1.TestBed.configureTestingModule({
            imports: [firebase_module_1.FirebaseModule.primaryApp({ options: firebaseConfig })],
        });
        firebaseApp = testing_1.TestBed.get(firebase_app_service_1.FirebaseApp);
    });
    afterEach(done => {
        firebaseApp.delete().toPromise().then(done, done);
    });
    it('should provide default FirebaseAuth', testing_1.inject([firebase_auth_service_1.FirebaseAuth], (auth) => {
        expect(auth).toBe(firebaseApp.auth());
    }));
});
