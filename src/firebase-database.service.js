"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@angular/core");
const rxjs_1 = require("rxjs");
const native_firebase_1 = require("./native-firebase");
const utils_1 = require("./utils");
const data_snapshot_observable_1 = require("./observable/data-snapshot-observable");
require("./observable/add/run-in-zone");
class Event {
}
Event.Value = 'value';
Event.ChildAdded = 'child_added';
Event.ChildChanged = 'child_changed';
Event.ChildRemoved = 'child_removed';
Event.ChildMoved = 'child_moved';
exports.Event = Event;
class FirebaseQuery {
    constructor(_ref, ngZone) {
        this._ref = _ref;
        this.ngZone = ngZone;
    }
    get ref() {
        return this.wrappedRef;
    }
    orderByChild(child) {
        this._call('orderByChild', child);
        return this;
    }
    orderByKey() {
        this._call('orderByKey');
        return this;
    }
    orderByPriority() {
        this._call('orderByPriority');
        return this;
    }
    orderByValue() {
        this._call('orderByValue');
        return this;
    }
    startAt(value, key) {
        this._call('startAt', value, key);
        return this;
    }
    endAt(value, key) {
        this._call('endAt', value, key);
        return this;
    }
    equalTo(value, key) {
        this._call('equalTo', value, key);
        return this;
    }
    limitToFirst(limit) {
        this._call('limitToFirst', limit);
        return this;
    }
    limitToLast(limit) {
        this._call('limitToLast', limit);
        return this;
    }
    once(event) {
        return new data_snapshot_observable_1.DataSnapshotObservable(sub => {
            this.getQueryOrRef().once(event, this.getEventHandler(sub, true), err => () => sub.error(err));
        }).runInZone(this.ngZone);
    }
    onceValue() {
        return this.once(Event.Value);
    }
    onceChildAdded() {
        return this.once(Event.ChildAdded);
    }
    onceChildChanged() {
        return this.once(Event.ChildChanged);
    }
    onceChildMoved() {
        return this.once(Event.ChildMoved);
    }
    onceChildRemoved() {
        return this.once(Event.ChildRemoved);
    }
    on(event) {
        return new data_snapshot_observable_1.DataSnapshotObservable(sub => {
            const cb = this.getQueryOrRef().on(event, this.getEventHandler(sub), err => sub.error(err));
            return () => this.getQueryOrRef().off(event, cb);
        }).runInZone(this.ngZone);
    }
    onValue() {
        return this.on(Event.Value);
    }
    onChildAdded() {
        return this.on(Event.ChildAdded);
    }
    onChildChanged() {
        return this.on(Event.ChildChanged);
    }
    onChildMoved() {
        return this.on(Event.ChildMoved);
    }
    onChildRemoved() {
        return this.on(Event.ChildRemoved);
    }
    isEqual(query) {
        return this.getQueryOrRef().isEqual(query.getQueryOrRef());
    }
    getEventHandler(sub, complete) {
        return (snapshot, prevKey) => {
            snapshot.prevKey = prevKey;
            sub.next(snapshot);
            if (complete) {
                sub.complete();
            }
        };
    }
    getQueryOrRef() {
        if (this.query) {
            return this.query;
        }
        return this._ref;
    }
    _call(fnName, ...args) {
        if (this.query) {
            this.query = this.query[fnName](...args);
        }
        else {
            this.query = this._ref[fnName](...args);
        }
    }
}
exports.FirebaseQuery = FirebaseQuery;
class FirebaseDatabaseRefConfig {
    constructor(parent, ref) {
        this.parent = parent;
        this.ref = ref;
    }
}
exports.FirebaseDatabaseRefConfig = FirebaseDatabaseRefConfig;
class FirebaseDatabaseRef extends FirebaseQuery {
    constructor(ngZone, config, injector) {
        super(config.ref, ngZone);
        this.config = config;
        this.injector = injector;
        this.wrappedRef = this;
    }
    static create(parent, injector, ref) {
        const childInjector = core_1.ReflectiveInjector.resolveAndCreate([
            {
                provide: FirebaseDatabaseRefConfig,
                useValue: new FirebaseDatabaseRefConfig(parent, ref),
            },
            FirebaseDatabaseRef
        ], injector);
        return childInjector.get(FirebaseDatabaseRef);
    }
    get key() {
        return this._ref.key;
    }
    child(path) {
        return FirebaseDatabaseRef.create(this, this.injector, this._ref.child(path));
    }
    set(value) {
        return utils_1.wrapPromise(() => this._ref.set(value));
    }
    setPriority(priority) {
        // There seems to be a bug with the typing for #setPriority(priority, onComplete): Promise
        // The firebase library, in every other case, declares the onComplete function optional since a
        // Promise is returned as well.
        return utils_1.wrapPromise(() => this._ref.setPriority(priority));
    }
    setWithPriority(newVal, priority) {
        return utils_1.wrapPromise(() => this._ref.setWithPriority(newVal, priority));
    }
    push(value) {
        const pushRef = this._ref.push(value);
        const ref = FirebaseDatabaseRef.create(this, this.injector, pushRef);
        // Only if a value to push was given, use ref as promise, since otherwise
        // pushRef.then will be undefined
        if (value) {
            return utils_1.wrapPromise(() => pushRef)
                .mapTo(ref);
        }
        return rxjs_1.Observable.of(ref);
    }
    update(value) {
        return utils_1.wrapPromise(() => this._ref.update(value));
    }
    remove() {
        return utils_1.wrapPromise(() => this._ref.remove());
    }
    transaction(transactionUpdate, applyLocally) {
        return utils_1.wrapPromise(() => new Promise((resolve, reject) => this._ref.transaction(transactionUpdate, (err, committed, snapshot) => err ? reject(err) : resolve({ committed, snapshot }), applyLocally)));
    }
}
FirebaseDatabaseRef.decorators = [
    { type: core_1.Injectable },
];
/** @nocollapse */
FirebaseDatabaseRef.ctorParameters = () => [
    { type: core_1.NgZone, },
    { type: FirebaseDatabaseRefConfig, },
    { type: core_1.Injector, },
];
exports.FirebaseDatabaseRef = FirebaseDatabaseRef;
class FirebaseDatabase {
    constructor(db, injector) {
        this.db = db;
        this.injector = injector;
    }
    ref(path) {
        return FirebaseDatabaseRef.create(null, this.injector, this.db.ref(path));
    }
}
FirebaseDatabase.decorators = [
    { type: core_1.Injectable },
];
/** @nocollapse */
FirebaseDatabase.ctorParameters = () => [
    { type: native_firebase_1.NativeFirebaseDatabase, },
    { type: core_1.Injector, },
];
exports.FirebaseDatabase = FirebaseDatabase;
