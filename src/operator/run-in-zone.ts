import { Observable } from 'rxjs/Observable'
import { NgZone } from '@angular/core'

export function runInZone<T extends Observable<any>>(this: T, zone: NgZone): T {
  return new (this.constructor as any)(sub => {
    const subscription = this.subscribe(
      value => zone.run(() => sub.next(value)),
      err => zone.run(() => sub.error(err)),
      () => zone.run(() => sub.complete())
    )

    return () => subscription.unsubscribe()
  })
}
