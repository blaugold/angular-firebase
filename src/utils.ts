import * as firebase from 'firebase'
import { Observable } from 'rxjs/Observable'
import { fromPromise } from 'rxjs/observable/fromPromise'
import { invokeLazy } from './firebase.module'

export function wrapExternalPromise<T>(promise: any): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    promise
      .then((res: T) => resolve(res))
      .catch((err: any) => reject(err))
  })
}

export function wrapPromise<T>(promiseFact: () => firebase.Promise<T>): Observable<T> {
  if (invokeLazy()) {
    return new Observable<T>(sub => {
      fromPromise<T>(wrapExternalPromise<T>(promiseFact()))
        .subscribe(sub)
    })
  }
  return fromPromise<T>(wrapExternalPromise<T>(promiseFact()))
}
