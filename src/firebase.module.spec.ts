import { TestBed } from '@angular/core/testing'
import { FirebaseModule } from './firebase.module'
import { FirebaseApp } from './firebase-app.service'
import { InjectionToken } from '@angular/core'
import { FirebaseAuth } from './firebase-auth.service'
import { FirebaseDatabase } from './firebase-database.service'

describe('Module: Firebase', () => {

  it('support multiple firebase project', () => {
    const secondAppToken = new InjectionToken('App two')

    TestBed.configureTestingModule({
      imports: [
        FirebaseModule.primaryApp({
          options: {
            apiKey:            "bar",
            authDomain:        "bar.firebaseapp.com",
            databaseURL:       "https://bar.firebaseio.com",
            storageBucket:     "bar.appspot.com",
            messagingSenderId: "99999999999"
          }
        }),
        FirebaseModule.secondaryApp(secondAppToken, {
          options: {
            apiKey:            "foo",
            authDomain:        "foo.firebaseapp.com",
            databaseURL:       "https://foo.firebaseio.com",
            storageBucket:     "foo.appspot.com",
            messagingSenderId: "00000000000"
          }
        }),
      ]
    })

    const defaultApp      = TestBed.get(FirebaseApp)
    const defaultAuth     = TestBed.get(FirebaseAuth)
    const defaultDatabase = TestBed.get(FirebaseDatabase)

    const secondApp: FirebaseApp = TestBed.get(secondAppToken)
    const secondAuth             = secondApp.auth()
    const secondDatabase         = secondApp.database()

    expect(secondApp).toBeDefined()
    expect(secondAuth).toBeDefined()
    expect(secondDatabase).toBeDefined()

    expect(defaultApp).toBeDefined()
    expect(defaultAuth).toBeDefined()
    expect(defaultDatabase).toBeDefined()

    expect(defaultApp).not.toBe(secondApp)
    expect(defaultAuth).not.toBe(secondAuth)
    expect(defaultDatabase).not.toBe(secondDatabase)
  })

})
