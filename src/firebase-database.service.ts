import { Injectable, NgZone, Injector, ReflectiveInjector } from '@angular/core'
import { Observable, Subscriber } from 'rxjs'
import { database } from 'firebase'
import { NativeFirebaseDatabase } from './native-firebase'
import { wrapPromise } from './utils'
import { DataSnapshot } from './reexports'
import { DataSnapshotObservable } from './observable/data-snapshot-observable'
import './observable/add/run-in-zone'

export type NativeDatabaseRef = database.Reference
export type Query = database.Query

export type EventType =
  'value'
    | 'child_added'
    | 'child_changed'
    | 'child_removed'
    | 'child_moved'

export class Event {
  static Value: EventType        = 'value'
  static ChildAdded: EventType   = 'child_added'
  static ChildChanged: EventType = 'child_changed'
  static ChildRemoved: EventType = 'child_removed'
  static ChildMoved: EventType   = 'child_moved'
}

export class FirebaseQuery {
  private query: Query
  protected wrappedRef: FirebaseDatabaseRef

  get ref(): FirebaseDatabaseRef {
    return this.wrappedRef
  }

  constructor(protected _ref: NativeDatabaseRef,
              protected ngZone: NgZone) {}

  orderByChild(child: string): FirebaseQuery {
    this._call('orderByChild', child)
    return this
  }

  orderByKey(): FirebaseQuery {
    this._call('orderByKey')
    return this
  }

  orderByPriority(): FirebaseQuery {
    this._call('orderByPriority')
    return this
  }

  orderByValue(): FirebaseQuery {
    this._call('orderByValue')
    return this
  }

  startAt(value: number | string | boolean | null, key?: string): FirebaseQuery {
    this._call('startAt', value, key)
    return this
  }

  endAt(value: number | string | boolean | null, key?: string): FirebaseQuery {
    this._call('endAt', value, key)
    return this
  }

  equalTo(value: number | string | boolean | null, key?: string): FirebaseQuery {
    this._call('equalTo', value, key)
    return this
  }

  limitToFirst(limit: number): FirebaseQuery {
    this._call('limitToFirst', limit)
    return this
  }

  limitToLast(limit: number): FirebaseQuery {
    this._call('limitToLast', limit)
    return this
  }

  once<T>(event: EventType): DataSnapshotObservable<T> {
    return new DataSnapshotObservable(sub => {
      this.getQueryOrRef().once(
        event, this.getEventHandler(sub, true),
        err => () => sub.error(err)
      )
    }).runInZone(this.ngZone)
  }

  onceValue<T>(): DataSnapshotObservable<T> {
    return this.once<T>(Event.Value)
  }

  onceChildAdded<T>(): DataSnapshotObservable<T> {
    return this.once<T>(Event.ChildAdded)
  }

  onceChildChanged<T>(): DataSnapshotObservable<T> {
    return this.once<T>(Event.ChildChanged)
  }

  onceChildMoved<T>(): DataSnapshotObservable<T> {
    return this.once<T>(Event.ChildMoved)
  }

  onceChildRemoved<T>(): DataSnapshotObservable<T> {
    return this.once<T>(Event.ChildRemoved)
  }

  on<T>(event: EventType): DataSnapshotObservable<T> {
    return new DataSnapshotObservable(sub => {
      const cb = this.getQueryOrRef().on(
        event, this.getEventHandler(sub),
        err => sub.error(err)
      )

      return () => this.getQueryOrRef().off(event, cb)
    }).runInZone(this.ngZone)
  }

  onValue<T>(): DataSnapshotObservable<T> {
    return this.on<T>(Event.Value)
  }

  onChildAdded<T>(): DataSnapshotObservable<T> {
    return this.on<T>(Event.ChildAdded)
  }

  onChildChanged<T>(): DataSnapshotObservable<T> {
    return this.on<T>(Event.ChildChanged)
  }

  onChildMoved<T>(): DataSnapshotObservable<T> {
    return this.on<T>(Event.ChildMoved)
  }

  onChildRemoved<T>(): DataSnapshotObservable<T> {
    return this.on<T>(Event.ChildRemoved)
  }

  isEqual(query: FirebaseQuery): boolean {
    return this.getQueryOrRef().isEqual(query.getQueryOrRef())
  }

  private getEventHandler(sub: Subscriber<any>, complete?: boolean) {
    return (snapshot: DataSnapshot, prevKey: any) => {
      (snapshot as DataSnapshot).prevKey = prevKey
      sub.next(snapshot)
      if (complete) {
        sub.complete()
      }
    }
  }

  private getQueryOrRef() {
    if (this.query) {
      return this.query
    }
    return this._ref
  }

  private _call(fnName: string, ...args) {
    if (this.query) {
      this.query = this.query[fnName](...args)
    }
    else {
      this.query = this._ref[fnName](...args)
    }
  }
}


export class FirebaseDatabaseRefConfig {
  constructor(public parent: FirebaseDatabaseRef,
              public ref: NativeDatabaseRef) {
  }
}

@Injectable()
export class FirebaseDatabaseRef extends FirebaseQuery {

  static create(parent: FirebaseDatabaseRef,
                injector: Injector,
                ref: NativeDatabaseRef) {
    const childInjector = ReflectiveInjector.resolveAndCreate([
      {
        provide:  FirebaseDatabaseRefConfig,
        useValue: new FirebaseDatabaseRefConfig(parent, ref),
      },
      FirebaseDatabaseRef
    ], injector)
    return childInjector.get(FirebaseDatabaseRef)
  }


  get key(): string | null {
    return this._ref.key
  }

  constructor(ngZone: NgZone,
              private config: FirebaseDatabaseRefConfig,
              private injector: Injector) {
    super(config.ref, ngZone)

    this.wrappedRef = this
  }

  child(path: string): FirebaseDatabaseRef {
    return FirebaseDatabaseRef.create(this, this.injector, this._ref.child(path))
  }

  set(value: any): Observable<void> {
    return wrapPromise<void>(() => this._ref.set(value))
  }

  setPriority(priority: string | number | null): Observable<void> {
    // There seems to be a bug with the typing for #setPriority(priority, onComplete): Promise
    // The firebase library, in every other case, declares the onComplete function optional since a
    // Promise is returned as well.
    return wrapPromise<void>(() => (this._ref as any).setPriority(priority))
  }

  setWithPriority(newVal: any, priority: string | number | null): Observable<void> {
    return wrapPromise<void>(() => this._ref.setWithPriority(newVal, priority))
  }

  push(value?: any): Observable<FirebaseDatabaseRef> {
    const pushRef = this._ref.push(value)
    const ref     = FirebaseDatabaseRef.create(this, this.injector, pushRef)

    // Only if a value to push was given, use ref as promise, since otherwise
    // pushRef.then will be undefined
    if (value) {
      return wrapPromise<FirebaseDatabaseRef>(() => pushRef)
        .mapTo(ref)
    }
    return Observable.of(ref)
  }

  update(value: Object): Observable<void> {
    return wrapPromise<void>(() => this._ref.update(value))
  }

  remove(): Observable<void> {
    return wrapPromise<void>(() => this._ref.remove())
  }

  transaction(transactionUpdate: (node: any) => any | never,
              applyLocally?: boolean): Observable<{ committed: boolean, snapshot: DataSnapshot }> {
    return wrapPromise<{ committed: boolean, snapshot: DataSnapshot }>(
      () => new Promise((resolve, reject) => this._ref.transaction(
        transactionUpdate,
        (err, committed, snapshot) => err ? reject(err) : resolve({ committed, snapshot }),
        applyLocally
      ))
    )
  }
}

@Injectable()
export class FirebaseDatabase {

  constructor(private db: NativeFirebaseDatabase,
              private injector: Injector) { }

  ref(path?: string): FirebaseDatabaseRef {
    return FirebaseDatabaseRef.create(null, this.injector, this.db.ref(path))
  }
}
