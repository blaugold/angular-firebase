import { Observable } from 'rxjs/Observable'
import { runInZone } from '../operator/run-in-zone'

Observable.prototype.runInZone = runInZone

declare module 'rxjs/Observable' {
  interface Observable<T> {
    runInZone: typeof runInZone;
  }
}


