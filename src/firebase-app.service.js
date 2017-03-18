"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const firebase = require("firebase");
const firebase_auth_service_1 = require("./firebase-auth.service");
const firebase_database_service_1 = require("./firebase-database.service");
const native_firebase_1 = require("./native-firebase");
const utils_1 = require("./utils");
let lastAppId = 0;
class FirebaseApp {
    constructor(config, injector) {
        this.config = config;
        this.injector = injector;
        config.name = config.name || `app-${lastAppId++}`;
        this.nativeApp = firebase.initializeApp(config.options, config.name);
    }
    delete() {
        return utils_1.wrapPromise(() => this.nativeApp.delete());
    }
    auth() {
        if (!this._auth) {
            const authInjector = core_1.ReflectiveInjector.resolveAndCreate([
                {
                    provide: native_firebase_1.NativeFirebaseAuth,
                    useValue: this.nativeApp.auth()
                },
                firebase_auth_service_1.FirebaseAuth
            ], this.injector);
            this._auth = authInjector.get(firebase_auth_service_1.FirebaseAuth);
        }
        return this._auth;
    }
    database() {
        if (!this._database) {
            const databaseInjector = core_1.ReflectiveInjector.resolveAndCreate([
                {
                    provide: native_firebase_1.NativeFirebaseDatabase,
                    useValue: this.nativeApp.database()
                },
                firebase_database_service_1.FirebaseDatabase
            ], this.injector);
            this._database = databaseInjector.get(firebase_database_service_1.FirebaseDatabase);
        }
        return this._database;
    }
}
exports.FirebaseApp = FirebaseApp;
