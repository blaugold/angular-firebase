import { wrapExternalPromise } from './utils'
import { async } from '@angular/core/testing'
export function awaitPromise(promFact: () => Promise<any>): (done) => void {
  return done => {
    promFact().then(done, err => fail(err));
  }
}

describe('utils', () => {
  it('wrapExternalPromise should wrap compliant promise', async(() => {
    const resolvedPromise = wrapExternalPromise(Promise.resolve(true))
    resolvedPromise
      .then(res => expect(res).toBeTruthy())
      .catch(err => fail(err))

    const cause           = new Error()
    const rejectedPromise = wrapExternalPromise(Promise.reject(cause))
    rejectedPromise
      .then(res => fail('should not resolve'))
      .catch(err => expect(err).toBe(cause))
  }))
})