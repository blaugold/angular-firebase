"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const rxjs_1 = require("rxjs");
class DataSnapshotObservable extends rxjs_1.Observable {
    exists() {
        return this.map(snapshot => snapshot.exists());
    }
    children() {
        return this.map(snapshot => new DataSnapshotObservable(sub => {
            snapshot.forEach(childSnapshot => { sub.next(childSnapshot); return false; });
            sub.complete();
        }));
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
    toValArray() {
        return this.children()
            .mergeMap(children => children
            .val()
            .toArray());
    }
    key() {
        return this.map(snapshot => snapshot.key);
    }
    /**
     * When listening to events such as {@link Event.ChildMoved} the snapshot includes
     * the key of the child before this snapshots one. This operator maps to this key.
     * @returns {Observable<string>}
     */
    prevKey() {
        return this.map(snapshot => snapshot.prevKey);
    }
    val() {
        return this.map(snapshot => snapshot.val());
    }
    getPriority() {
        return this.map((snapshot) => snapshot.getPriority());
    }
    exportVal() {
        return this.map((snapshot) => snapshot.exportVal());
    }
    hasChild(path) {
        return this.map((snapshot) => snapshot.hasChild(path));
    }
    hasChildren() {
        return this.map((snapshot) => snapshot.hasChildren());
    }
    numChildren() {
        return this.map((snapshot) => snapshot.numChildren());
    }
    child(path) {
        return new DataSnapshotObservable(sub => {
            const subscription = this
                .map((snapshot) => snapshot.child(path))
                .subscribe(sub);
            return () => subscription.unsubscribe();
        });
    }
}
exports.DataSnapshotObservable = DataSnapshotObservable;
