import { Observable } from 'rxjs'
import * as firebase from 'firebase'
import 'zone.js'
import { invokeLazy } from './firebase.module'

export function wrapExternalPromise<T>(promise: any): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    promise
      .then(res => resolve(res))
      .catch(err => reject(err))
  })
}

export function wrapPromise<T>(promiseFact: () => firebase.Promise<T>): Observable<T> {
  if (invokeLazy()) {
    return new Observable<T>(sub => {
      Observable.fromPromise<T>(wrapExternalPromise<T>(promiseFact()))
        .subscribe(sub)
    })
  }
  return Observable.fromPromise<T>(wrapExternalPromise<T>(promiseFact()))
}
