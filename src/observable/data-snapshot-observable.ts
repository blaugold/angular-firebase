import { Observable } from 'rxjs'

import { database } from 'firebase'

export interface ExtendedDataSnapshot extends database.DataSnapshot {
  prevKey?: string
}

export class DataSnapshotObservable<T> extends Observable<ExtendedDataSnapshot> {

  exists(): Observable<boolean> {
    return this.map(snapshot => snapshot.exists())
  }

  children<C>(): Observable<DataSnapshotObservable<C>> {
    return this.map(snapshot => new DataSnapshotObservable(sub => {
      snapshot.forEach(childSnapshot => {sub.next(childSnapshot); return false})
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
      .mergeMap(children => children
        .val()
        .toArray()
      )
  }

  key(): Observable<string> {
    return this.map(snapshot => snapshot.key)
  }

  /**
   * When listening to events such as {@link Event.ChildMoved} the snapshot includes
   * the key of the child before this snapshots one. This operator maps to this key.
   * @returns {Observable<string>}
   */
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