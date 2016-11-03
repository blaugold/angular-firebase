import { Injectable, NgZone } from '@angular/core'
import { Observable, Subscriber } from 'rxjs'
import { database } from 'firebase'

import { FirebaseDatabase } from './firebase.service'
import { wrapPromise } from './utils'
import { DataSnapshot } from './reexports'

import './add/run-in-zone'

export type DatabaseReference = database.Reference
export type Query = database.Query

export type EventType = 'value' | 'child_added' | 'child_changed' | 'child_removed' | 'child_moved'

export class Event {
  static Value: EventType        = 'value'
  static ChildAdded: EventType   = 'child_added'
  static ChildChanged: EventType = 'child_changed'
  static ChildRemoved: EventType = 'child_removed'
  static ChildMoved: EventType   = 'child_moved'
}

export interface ExtendedDataSnapshot extends DataSnapshot {
  prevKey: string
}

export class DataSnapshotObservable<T> extends Observable<ExtendedDataSnapshot> {

  exists(): Observable<boolean> {
    return this.map(snapshot => snapshot.exists())
  }

  children<C>(): Observable<DataSnapshotObservable<C>> {
    return this.map(snapshot => new DataSnapshotObservable(sub => {
      snapshot.forEach(childSnapshot => sub.next(childSnapshot))
      sub.complete()
    }))
  }

  /**
   * This operator takes the result of .val() for all children of the snapshot and emits
   * them as an array.
   * Contents of source snapshot:
   * ```
   * {
   *  childA: { prop: 'Hello' },
   *  childB: { prop: 'World!' },
   * }
   * ```
   * Result of operator:
   * ```
   * [
   *  { prop: 'Hello' },
   *  { prop: 'World!' },
   * ]
   * ```
   * @returns {Observable<C[]>}
   */
  toValArray<C>(): Observable<C[]> {
    return this.children<C>()
      .switchMap(children => children
        .val()
        .toArray()
      )
  }

  key(): Observable<string> {
    return this.map(snapshot => snapshot.key)
  }

  prevKey(): Observable<string> {
    return this.map(snapshot => snapshot.prevKey)
  }

  val<T>(): Observable<T> {
    return this.map(snapshot => snapshot.val())
  }

  getPriority(): Observable<number | string> {
    return this.map((snapshot: ExtendedDataSnapshot) => snapshot.getPriority())
  }

  exportVal(): Observable<any> {
    return this.map((snapshot: ExtendedDataSnapshot) => snapshot.exportVal())
  }

  hasChild(path: string): Observable<boolean> {
    return this.map((snapshot: ExtendedDataSnapshot) => snapshot.hasChild(path))
  }

  hasChildren(): Observable<boolean> {
    return this.map((snapshot: ExtendedDataSnapshot) => snapshot.hasChildren())
  }

  numChildren(): Observable<number> {
    return this.map((snapshot: ExtendedDataSnapshot) => snapshot.numChildren())
  }

  child<C>(path: string): DataSnapshotObservable<C> {
    return new DataSnapshotObservable(sub => {
      const subscription = this
        .map((snapshot: ExtendedDataSnapshot) => snapshot.child(path))
        .subscribe(sub)

      return () => subscription.unsubscribe()
    })
  }
}

export class FirebaseQuery {
  private query: Query
  protected wrappedRef: FirebaseDatabaseRef

  get ref(): FirebaseDatabaseRef {
    return this.wrappedRef
  }

  constructor(protected _ref: DatabaseReference,
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
      (snapshot as ExtendedDataSnapshot).prevKey = prevKey
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

export class FirebaseDatabaseRef extends FirebaseQuery {

  get key(): string | null {
    return this._ref.key
  }

  constructor(_ref: DatabaseReference,
              protected ngZone: NgZone,
              public parent: FirebaseDatabaseRef,
              public root: FirebaseDatabaseRef) {
    super(_ref, ngZone)
    this.root       = root || this
    this.wrappedRef = this
  }

  child(path: string): FirebaseDatabaseRef {
    const childRef = this._ref.child(path)
    return new FirebaseDatabaseRef(childRef, this.ngZone, this, this.root)
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
    const ref     = new FirebaseDatabaseRef(pushRef, this.ngZone, this, this.root)

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
              applyLocally?: boolean): Observable<{committed: boolean, snapshot: DataSnapshot}> {
    return wrapPromise<{committed: boolean, snapshot: DataSnapshot}>(
      () => new Promise((resolve, reject) => this._ref.transaction(
        transactionUpdate,
        (err, committed, snapshot) => err ? reject(err) : resolve({ committed, snapshot }),
        applyLocally
      ))
    )
  }
}

@Injectable()
export class FirebaseDatabaseService {

  constructor(private fbDatabase: FirebaseDatabase, private ngZone: NgZone) { }

  ref(path?: string): FirebaseDatabaseRef {
    return new FirebaseDatabaseRef(this.fbDatabase.ref(path), this.ngZone, null, null)
  }
}
