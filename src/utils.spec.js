"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
const testing_1 = require("@angular/core/testing");
function awaitPromise(promFact) {
    return done => {
        promFact().then(done, err => fail(err));
    };
}
exports.awaitPromise = awaitPromise;
describe('utils', () => {
    it('wrapExternalPromise should wrap compliant promise', testing_1.async(() => {
        const resolvedPromise = utils_1.wrapExternalPromise(Promise.resolve(true));
        resolvedPromise
            .then(res => expect(res).toBeTruthy())
            .catch(err => fail(err));
        const cause = new Error();
        const rejectedPromise = utils_1.wrapExternalPromise(Promise.reject(cause));
        rejectedPromise
            .then(res => fail('should not resolve'))
            .catch(err => expect(err).toBe(cause));
    }));
});
