/* tslint:disable:no-unused-variable */

import { TestBed, inject } from '@angular/core/testing'
import { Observable } from 'rxjs'

import { FirebaseAppConfig, FirebaseApp } from './firebase-app.service'
import { FirebaseModule } from './firebase.module'
import { FirebaseDatabase } from './firebase-database.service'
import { DataSnapshot } from './reexports'
import { NgZone } from '@angular/core'
import { awaitPromise } from './utils.spec'

let firebaseApp: FirebaseApp

describe('Service: FirebaseDatabase', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [FirebaseModule.forRoot([new FirebaseAppConfig({ options: firebaseConfig })])],
    });

    firebaseApp = TestBed.get(FirebaseApp)
  });

  afterEach(done => {
    firebaseApp.delete().toPromise().then(done, done)
  })

  beforeEach(done => inject([FirebaseDatabase], (fb: FirebaseDatabase) => {
    expectObservableToComplete(done, fb.ref().set(null))
  })())

  it('should provide default FirebaseDatabase', inject([FirebaseDatabase],
    (fb: FirebaseDatabase) => {
      expect(fb).toBe(firebaseApp.database())
    }))

  it('should set node', done => inject([FirebaseDatabase],
    (fb: FirebaseDatabase) => {
      const ref = fb.ref('foo')
      expectObservableToComplete(done,
        ref.set('bar')
          .mergeMapTo(ref.onceValue().val())
          .do(val => expect(val).toBe('bar'))
      )
    })())

  it('should wrap callbacks to stay in current zone', done => inject([FirebaseDatabase, NgZone],
    (fb: FirebaseDatabase, zone: NgZone) => {
      zone.run(() => {
        const angularZone = Zone.current
        fb.ref('foo')
          .onceValue()
          .do(() => expect(Zone.current).toBe(angularZone))
          .subscribe(() => done(), err => fail(err))
      })
    })())

  it('should update node', done => inject([FirebaseDatabase],
    (fb: FirebaseDatabase) => {
      const ref = fb.ref('foo')
      expectObservableToComplete(done,
        ref.set({ a: 'A', b: 'B' })
          .mergeMapTo(ref.update({ a: 'AA', c: 'C' }))
          .mergeMapTo(ref.onceValue().val())
          .do(node => expect(node).toEqual({ a: 'AA', b: 'B', c: 'C' }))
      )
    })())

  it('push node', done => inject([FirebaseDatabase],
    (fb: FirebaseDatabase) => {
      const parent  = fb.ref('foo')
      const newNode = { a: 'A', b: 'B' }
      expectObservableToComplete(done,
        parent.push(newNode)
          .mergeMap(child => child.onceValue().val())
          .do(node => expect(node).toEqual(newNode))
      )
    })())

  it('listen to updates', done => inject([FirebaseDatabase],
    (fb: FirebaseDatabase) => {
      const node = fb.ref().child('foo')

      expectObservableToComplete(done,
        node.onValue().take(2)
      )

      Observable.concat(node.set('a'), node.set('b')).subscribe()
    })())

  it('orderByChild', done => inject([FirebaseDatabase],
    (fb: FirebaseDatabase) => {
      const node     = fb.ref('foo')
      const nodeData = {
        c: { c: 'c' },
        a: { c: 'a' },
        d: { c: 'd' },
        b: { c: 'b' },
      }
      expectObservableToComplete(done,
        node.set(nodeData)
          .mergeMapTo(node.orderByChild('c')
            .onceValue()
            .toValArray()
          )
          .do(children => expect(children).toEqual([
            { c: 'a' },
            { c: 'b' },
            { c: 'c' },
            { c: 'd' }
          ]))
      )
    })())

  it('observable ops', done => inject([FirebaseDatabase],
    (fb: FirebaseDatabase) => {
      const node     = fb.ref().child('foo')
      const nodeData = {
        a: {
          b: 'b',
          d: {
            e: 'e'
          }
        },
      }
      const srcObs   = node.onceValue()
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
