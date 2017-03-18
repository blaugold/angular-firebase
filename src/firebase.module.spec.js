"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const testing_1 = require("@angular/core/testing");
const firebase_module_1 = require("./firebase.module");
const firebase_app_service_1 = require("./firebase-app.service");
const core_1 = require("@angular/core");
const firebase_auth_service_1 = require("./firebase-auth.service");
const firebase_database_service_1 = require("./firebase-database.service");
describe('Module: Firebase', () => {
    it('support multiple firebase project', () => {
        const secondAppToken = new core_1.InjectionToken('App two');
        testing_1.TestBed.configureTestingModule({
            imports: [
                firebase_module_1.FirebaseModule.primaryApp({
                    options: {
                        apiKey: "bar",
                        authDomain: "bar.firebaseapp.com",
                        databaseURL: "https://bar.firebaseio.com",
                        storageBucket: "bar.appspot.com",
                        messagingSenderId: "99999999999"
                    }
                }),
                firebase_module_1.FirebaseModule.secondaryApp(secondAppToken, {
                    options: {
                        apiKey: "foo",
                        authDomain: "foo.firebaseapp.com",
                        databaseURL: "https://foo.firebaseio.com",
                        storageBucket: "foo.appspot.com",
                        messagingSenderId: "00000000000"
                    }
                }),
            ]
        });
        const defaultApp = testing_1.TestBed.get(firebase_app_service_1.FirebaseApp);
        const defaultAuth = testing_1.TestBed.get(firebase_auth_service_1.FirebaseAuth);
        const defaultDatabase = testing_1.TestBed.get(firebase_database_service_1.FirebaseDatabase);
        const secondApp = testing_1.TestBed.get(secondAppToken);
        const secondAuth = secondApp.auth();
        const secondDatabase = secondApp.database();
        expect(secondApp).toBeDefined();
        expect(secondAuth).toBeDefined();
        expect(secondDatabase).toBeDefined();
        expect(defaultApp).toBeDefined();
        expect(defaultAuth).toBeDefined();
        expect(defaultDatabase).toBeDefined();
        expect(defaultApp).not.toBe(secondApp);
        expect(defaultAuth).not.toBe(secondAuth);
        expect(defaultDatabase).not.toBe(secondDatabase);
    });
});
