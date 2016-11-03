/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing'
import { FirebaseModule, Firebase } from './firebase.module'
import { Observable } from 'rxjs'

import { environment } from '../../environments/environment.test'
import { Event } from './firebase-database.service'

describe('Service: FirebaseDatabase', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FirebaseModule.forRoot([{ config: environment.firebaseConfig }])],
    });
  });

  beforeEach(done => inject([Firebase], (fb: Firebase) => {
    expectObservableToComplete(done, fb.database().ref().set(null))
  })())

  it('should set node', done => inject([Firebase],
    (fb: Firebase) => {
      const ref = fb.database().ref('foo')
      expectObservableToComplete(done,
        ref.set('bar')
          .mergeMapTo(ref.once(Event.Value).val())
          .do(val => expect(val).toBe('bar'))
      )
    })())

  it('should update node', done => inject([Firebase],
    (fb: Firebase) => {
      const ref = fb.database().ref('foo')
      expectObservableToComplete(done,
        ref.set({ a: 'A', b: 'B' })
          .mergeMapTo(ref.update({ a: 'AA', c: 'C' }))
          .mergeMapTo(ref.once(Event.Value).val())
          .do(node => expect(node).toEqual({ a: 'AA', b: 'B', c: 'C' }))
      )
    })())

  it('push node', done => inject([Firebase],
    (fb: Firebase) => {
      const parent  = fb.database().ref('foo')
      const newNode = { a: 'A', b: 'B' }
      expectObservableToComplete(done,
        parent.push(newNode)
          .mergeMap(child => child.once(Event.Value).val())
          .do(node => expect(node).toEqual(newNode))
      )
    })())

  it('listen to updates', done => inject([Firebase],
    (fb: Firebase) => {
      const node = fb.database().ref().child('foo')

      expectObservableToComplete(done,
        node.on(Event.Value).take(2)
      )

      Observable.concat(node.set('a'), node.set('b')).subscribe()
    })())

  it('orderByChild', done => inject([Firebase],
    (fb: Firebase) => {
      const node     = fb.database().ref('foo')
      const nodeData = {
        c: { c: 'c' },
        a: { c: 'a' },
        d: { c: 'd' },
        b: { c: 'b' },
      }
      expectObservableToComplete(done,
        node.set(nodeData)
          .mergeMapTo(node.orderByChild('c')
            .once(Event.Value)
            .children()
          )
          .mergeMap(childrenSnapshot => childrenSnapshot.val())
          .toArray()
          .do(children => expect(children).toEqual([
            { c: 'a' },
            { c: 'b' },
            { c: 'c' },
            { c: 'd' }
          ]))
      )
    })())

  it('observable ops', done => inject([Firebase],
    (fb: Firebase) => {
      const node     = fb.database().ref().child('foo')
      const nodeData = {
        a: {
          b: 'b',
          d: {
            e: 'e'
          }
        },
      }
      const srcObs   = node.once(Event.Value)
      expectObservableToComplete(done,
        node.set(nodeData).mergeMapTo(Observable.combineLatest(
          srcObs.exists().do(exists => expect(exists).toBeTruthy()),
          srcObs.getPriority().do(priority => expect(priority).toBeNull()),
          srcObs.key().do(key => expect(key).toEqual('foo')),
          srcObs.hasChildren().do(hasChildren => expect(hasChildren).toBeTruthy()),
          srcObs.hasChild('a').do(hasChild => expect(hasChild).toBeTruthy()),
          srcObs.numChildren().do(children => expect(children).toEqual(1)),
          srcObs.child('a').val().do(child => expect(child).toEqual({ b: 'b', d: { e: 'e' } })),
        ))
      )
    })())

  // TODO test(#transaction)
})

function expectObservableToComplete(done: () => any, obs: Observable<any>) {
  obs.subscribe(() => {}, err => expect(err).toBeNull(), () => done())
}
