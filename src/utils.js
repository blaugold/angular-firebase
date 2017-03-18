"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
require("zone.js");
const firebase_module_1 = require("./firebase.module");
function wrapExternalPromise(promise) {
    return new Promise((resolve, reject) => {
        promise
            .then(res => resolve(res))
            .catch(err => reject(err));
    });
}
exports.wrapExternalPromise = wrapExternalPromise;
function wrapPromise(promiseFact) {
    if (firebase_module_1.invokeLazy()) {
        return new rxjs_1.Observable(sub => {
            rxjs_1.Observable.fromPromise(wrapExternalPromise(promiseFact()))
                .subscribe(sub);
        });
    }
    return rxjs_1.Observable.fromPromise(wrapExternalPromise(promiseFact()));
}
exports.wrapPromise = wrapPromise;
