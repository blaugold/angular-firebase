import { Observable } from 'rxjs/Observable'
import { database } from 'firebase'
import 'rxjs/add/operator/map'
import 'rxjs/add/operator/mergeMap'
import 'rxjs/add/operator/toArray'

export interface ExtendedDataSnapshot extends database.DataSnapshot {
  prevKey?: string
}

export class DataSnapshotObservable<T> extends Observable<ExtendedDataSnapshot> {

  exists(): Observable<boolean> {
    return this.map(snapshot => snapshot.exists())
  }

  children(): Observable<DataSnapshotObservable<T[keyof T]>> {
    return this.map(snapshot => new DataSnapshotObservable<T[keyof T]>(sub => {
      snapshot.forEach(childSnapshot => {
        sub.next(childSnapshot);
        return false
      })
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
  toValArray(): Observable<T[keyof T][]> {
    return this.children().mergeMap(children => children.val().toArray())
  }

  values(): Observable<T[keyof T][]> {
    return this.toValArray();
  }

  keys(): Observable<string[]> {
    return this.children().mergeMap(children => children.key().toArray())
  }

  list(): Observable<{ val: T[keyof T], key: string }[]> {
    return this.children().mergeMap(children => children.entry().toArray())
  }

  entry(): Observable<{ val: T, key: string }> {
    return this.map(snap => ({ val: snap.val(), key: snap.key }))
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

  val(): Observable<T> {
    return this.map(snapshot => snapshot.val())
  }

  getPriority(): Observable<number | string> {
    return this.map((snapshot: ExtendedDataSnapshot) => snapshot.getPriority())
  }

  exportVal(): Observable<T> {
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

  child<P extends keyof T>(path: P): DataSnapshotObservable<T[P]> {
    return new DataSnapshotObservable<T[P]>(sub => {
      const subscription = this
        .map((snapshot: ExtendedDataSnapshot) => snapshot.child(path))
        .subscribe(sub)

      return () => subscription.unsubscribe()
    })
  }
}