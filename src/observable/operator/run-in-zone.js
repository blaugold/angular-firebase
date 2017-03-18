"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function runInZone(zone) {
    const z = Zone.current;
    return new this.constructor(sub => {
        const subscription = this.subscribe(z.wrap(sub.next, 'Observable.next').bind(sub), z.wrap(sub.error, 'Observable.error').bind(sub), z.wrap(sub.complete, 'Observable.complete').bind(sub));
        return () => subscription.unsubscribe();
    });
}
exports.runInZone = runInZone;
// z.wrap(sub.next, 'Observable.next').bind(sub),
//   z.wrap(sub.error, 'Observable.error').bind(sub),
//   z.wrap(sub.complete, 'Observable.complete').bind(sub), 
