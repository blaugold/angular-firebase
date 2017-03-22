import { Observable } from 'rxjs/Observable'
import { NgZone } from '@angular/core'
import { Observer } from 'rxjs'

export function runInZone<T extends Observable<any>>(this: T, zone: NgZone): T {
  const z = Zone.current
  return new (this.constructor as any)((sub: Observer<T>) => {
    const subscription = this.subscribe(
      z.wrap(sub.next, 'Observable.next').bind(sub),
      z.wrap(sub.error, 'Observable.error').bind(sub),
      z.wrap(sub.complete, 'Observable.complete').bind(sub),
    )

    return () => subscription.unsubscribe()
  })
}

// z.wrap(sub.next, 'Observable.next').bind(sub),
//   z.wrap(sub.error, 'Observable.error').bind(sub),
//   z.wrap(sub.complete, 'Observable.complete').bind(sub),