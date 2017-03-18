"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const firebase_auth_service_1 = require("./firebase-auth.service");
const firebase_database_service_1 = require("./firebase-database.service");
const firebase_app_service_1 = require("./firebase-app.service");
/** @internal */
let lazyInvocation = true;
function invokeLazy() {
    return lazyInvocation;
}
exports.invokeLazy = invokeLazy;
function setLazyInvocation(lazy) {
    lazyInvocation = lazy;
}
exports.setLazyInvocation = setLazyInvocation;
function appFactory(injector, config) {
    return new firebase_app_service_1.FirebaseApp(config, injector);
}
exports.appFactory = appFactory;
function authFactory(app) {
    return app.auth();
}
exports.authFactory = authFactory;
function databaseFactory(app) {
    return app.database();
}
exports.databaseFactory = databaseFactory;
class FirebaseModule {
    /**
     * Provides a firebase app which will be be injected for `FirebaseApp`. Further the app's
     * `FirebaseAuth` and `FirebaseDatabase` can be injected in the same way.
     * @param config Firebase app config.
     */
    static primaryApp(config) {
        return {
            ngModule: FirebaseModule,
            providers: [
                {
                    provide: 'firebase-config-' + config.options.apiKey,
                    useValue: config
                },
                {
                    provide: firebase_app_service_1.FirebaseApp,
                    useFactory: appFactory,
                    deps: [core_1.Injector, 'firebase-config-' + config.options.apiKey]
                },
                {
                    provide: firebase_auth_service_1.FirebaseAuth,
                    useFactory: authFactory,
                    deps: [firebase_app_service_1.FirebaseApp]
                },
                {
                    provide: firebase_database_service_1.FirebaseDatabase,
                    useFactory: databaseFactory,
                    deps: [firebase_app_service_1.FirebaseApp]
                }
            ]
        };
    }
    /**
     * Provides a `FirebaseApp` which will be injected for {@param token}.
     *
     * @param config Firebase app config.
     */
    static secondaryApp(token, config) {
        return {
            ngModule: FirebaseModule,
            providers: [
                {
                    provide: 'firebase-config-' + config.options.apiKey,
                    useValue: config
                },
                {
                    provide: token,
                    useFactory: appFactory,
                    deps: [core_1.Injector, 'firebase-config-' + config.options.apiKey,]
                }
            ]
        };
    }
}
FirebaseModule.decorators = [
    { type: core_1.NgModule, args: [{},] },
];
/** @nocollapse */
FirebaseModule.ctorParameters = () => [];
exports.FirebaseModule = FirebaseModule;
