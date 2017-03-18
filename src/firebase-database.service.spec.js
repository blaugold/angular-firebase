"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/* tslint:disable:no-unused-variable */
const testing_1 = require("@angular/core/testing");
const rxjs_1 = require("rxjs");
const firebase_app_service_1 = require("./firebase-app.service");
const firebase_module_1 = require("./firebase.module");
const firebase_database_service_1 = require("./firebase-database.service");
const core_1 = require("@angular/core");
let firebaseApp;
describe('Service: FirebaseDatabase', () => {
    beforeEach(() => {
        testing_1.TestBed.configureTestingModule({
            imports: [firebase_module_1.FirebaseModule.primaryApp({ options: firebaseConfig })],
        });
        firebaseApp = testing_1.TestBed.get(firebase_app_service_1.FirebaseApp);
    });
    afterEach(done => {
        firebaseApp.delete().toPromise().then(done, done);
    });
    beforeEach(done => testing_1.inject([firebase_database_service_1.FirebaseDatabase], (fb) => {
        expectObservableToComplete(done, fb.ref().set(null));
    })());
    it('should provide default FirebaseDatabase', testing_1.inject([firebase_database_service_1.FirebaseDatabase], (fb) => {
        expect(fb).toBe(firebaseApp.database());
    }));
    it('should set node', done => testing_1.inject([firebase_database_service_1.FirebaseDatabase], (fb) => {
        const ref = fb.ref('getProviders');
        expectObservableToComplete(done, ref.set('bar')
            .mergeMapTo(ref.onceValue().val())
            .do(val => expect(val).toBe('bar')));
    })());
    it('should wrap callbacks to stay in current zone', done => testing_1.inject([firebase_database_service_1.FirebaseDatabase, core_1.NgZone], (fb, zone) => {
        zone.run(() => {
            const angularZone = Zone.current;
            fb.ref('getProviders')
                .onceValue()
                .do(() => expect(Zone.current).toBe(angularZone))
                .subscribe(() => done(), err => fail(err));
        });
    })());
    it('should update node', done => testing_1.inject([firebase_database_service_1.FirebaseDatabase], (fb) => {
        const ref = fb.ref('getProviders');
        expectObservableToComplete(done, ref.set({ a: 'A', b: 'B' })
            .mergeMapTo(ref.update({ a: 'AA', c: 'C' }))
            .mergeMapTo(ref.onceValue().val())
            .do(node => expect(node).toEqual({ a: 'AA', b: 'B', c: 'C' })));
    })());
    it('push node', done => testing_1.inject([firebase_database_service_1.FirebaseDatabase], (fb) => {
        const parent = fb.ref('getProviders');
        const newNode = { a: 'A', b: 'B' };
        expectObservableToComplete(done, parent.push(newNode)
            .mergeMap(child => child.onceValue().val())
            .do(node => expect(node).toEqual(newNode)));
    })());
    it('listen to updates', done => testing_1.inject([firebase_database_service_1.FirebaseDatabase], (fb) => {
        const node = fb.ref().child('getProviders');
        expectObservableToComplete(done, node.onValue().take(2));
        rxjs_1.Observable.concat(node.set('a'), node.set('b')).subscribe();
    })());
    it('orderByChild', done => testing_1.inject([firebase_database_service_1.FirebaseDatabase], (fb) => {
        const node = fb.ref('getProviders');
        const nodeData = {
            c: { c: 'c' },
            a: { c: 'a' },
            d: { c: 'd' },
            b: { c: 'b' },
        };
        expectObservableToComplete(done, node.set(nodeData)
            .mergeMapTo(node.orderByChild('c')
            .onceValue()
            .toValArray())
            .do(children => expect(children).toEqual([
            { c: 'a' },
            { c: 'b' },
            { c: 'c' },
            { c: 'd' }
        ])));
    })());
    it('observable ops', done => testing_1.inject([firebase_database_service_1.FirebaseDatabase], (fb) => {
        const node = fb.ref().child('getProviders');
        const nodeData = {
            a: {
                b: 'b',
                d: {
                    e: 'e'
                }
            },
        };
        const srcObs = node.onceValue();
        expectObservableToComplete(done, node.set(nodeData).mergeMapTo(rxjs_1.Observable.combineLatest(srcObs.exists().do(exists => expect(exists).toBeTruthy()), srcObs.getPriority().do(priority => expect(priority).toBeNull()), srcObs.key().do(key => expect(key).toEqual('getProviders')), srcObs.hasChildren().do(hasChildren => expect(hasChildren).toBeTruthy()), srcObs.hasChild('a').do(hasChild => expect(hasChild).toBeTruthy()), srcObs.numChildren().do(children => expect(children).toEqual(1)), srcObs.child('a').val().do(child => expect(child).toEqual({ b: 'b', d: { e: 'e' } })))));
    })());
    // TODO test(#transaction)
});
function expectObservableToComplete(done, obs) {
    obs.subscribe(() => { }, err => expect(err).toBeNull(), () => done());
}
