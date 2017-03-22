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

export class FirebaseQuery<T> {
  private query: Query
  protected wrappedRef: FirebaseDatabaseRef<T>

  get ref(): FirebaseDatabaseRef<T> {
    return this.wrappedRef
  }

  constructor(protected _ref: NativeDatabaseRef,
              protected ngZone: NgZone) {}

  orderByChild(child: string): FirebaseQuery<T> {
    this._call('orderByChild', child)
    return this
  }

  orderByKey(): FirebaseQuery<T> {
    this._call('orderByKey')
    return this
  }

  orderByPriority(): FirebaseQuery<T> {
    this._call('orderByPriority')
    return this
  }

  orderByValue(): FirebaseQuery<T> {
    this._call('orderByValue')
    return this
  }

  startAt(value: number | string | boolean | null, key?: string): FirebaseQuery<T> {
    this._call('startAt', value, key)
    return this
  }

  endAt(value: number | string | boolean | null, key?: string): FirebaseQuery<T> {
    this._call('endAt', value, key)
    return this
  }

  equalTo(value: number | string | boolean | null, key?: string): FirebaseQuery<T> {
    this._call('equalTo', value, key)
    return this
  }

  limitToFirst(limit: number): FirebaseQuery<T> {
    this._call('limitToFirst', limit)
    return this
  }

  limitToLast(limit: number): FirebaseQuery<T> {
    this._call('limitToLast', limit)
    return this
  }

  once(event: EventType): DataSnapshotObservable<T> {
    return new DataSnapshotObservable(sub => {
      this.getQueryOrRef().once(
        event, this.getEventHandler(sub, true),
        (err: any) => () => sub.error(err)
      )
    }).runInZone(this.ngZone)
  }

  onceValue(): DataSnapshotObservable<T> {
    return this.once(Event.Value)
  }

  onceChildAdded(): DataSnapshotObservable<T> {
    return this.once(Event.ChildAdded)
  }

  onceChildChanged(): DataSnapshotObservable<T> {
    return this.once(Event.ChildChanged)
  }

  onceChildMoved(): DataSnapshotObservable<T> {
    return this.once(Event.ChildMoved)
  }

  onceChildRemoved(): DataSnapshotObservable<T> {
    return this.once(Event.ChildRemoved)
  }

  on(event: EventType): DataSnapshotObservable<T> {
    return new DataSnapshotObservable(sub => {
      const cb = this.getQueryOrRef().on(
        event, this.getEventHandler(sub),
        (err: any) => sub.error(err)
      )

      return () => this.getQueryOrRef().off(event, cb)
    }).runInZone(this.ngZone)
  }

  onValue(): DataSnapshotObservable<T> {
    return this.on(Event.Value)
  }

  onChildAdded(): DataSnapshotObservable<T> {
    return this.on(Event.ChildAdded)
  }

  onChildChanged(): DataSnapshotObservable<T> {
    return this.on(Event.ChildChanged)
  }

  onChildMoved(): DataSnapshotObservable<T> {
    return this.on(Event.ChildMoved)
  }

  onChildRemoved(): DataSnapshotObservable<T> {
    return this.on(Event.ChildRemoved)
  }

  isEqual(query: FirebaseQuery<any>): boolean {
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

  private _call(fnName: string, ...args: any[]) {
    if (this.query) {
      this.query = (this.query as any)[fnName](...args)
    }
    else {
      this.query = (this._ref as any)[fnName](...args)
    }
  }
}


export class FirebaseDatabaseRefConfig {
  constructor(public parent: FirebaseDatabaseRef<any> | null,
              public ref: NativeDatabaseRef) {
  }
}

@Injectable()
export class FirebaseDatabaseRef<T> extends FirebaseQuery<T> {

  static create(parent: FirebaseDatabaseRef<any> | null,
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

  child<P extends keyof T>(path: P): FirebaseDatabaseRef<T[P]> {
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

  push<P>(value?: P): Observable<FirebaseDatabaseRef<P>> {
    const pushRef = this._ref.push(value)
    const ref     = FirebaseDatabaseRef.create(this, this.injector, pushRef)

    // Only if a value to push was given, use ref as promise, since otherwise
    // pushRef.then will be undefined
    if (value) {
      return wrapPromise<FirebaseDatabaseRef<P>>(() => pushRef)
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
export class FirebaseDatabase<T> {

  constructor(private db: NativeFirebaseDatabase,
              private injector: Injector) { }

  ref(): FirebaseDatabaseRef<T>
  ref(path: string): FirebaseDatabaseRef<any>
  ref<F>(path: string): FirebaseDatabaseRef<F>
  ref<F>(path?: string): FirebaseDatabaseRef<F> {
    return FirebaseDatabaseRef.create(null, this.injector, this.db.ref(path))
  }
}
