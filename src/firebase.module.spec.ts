import { TestBed } from '@angular/core/testing'
import { FirebaseModule } from './firebase.module'
import { FirebaseAppConfig, FirebaseApp } from './firebase-app.service'
import { OpaqueToken } from '@angular/core'
import { FirebaseAuth } from './firebase-auth.service'
import { FirebaseDatabase } from './firebase-database.service'

describe('Module: Firebase', () => {

  it('support multiple firebase project', () => {
    const secondAppToken = new OpaqueToken('App two')

    TestBed.configureTestingModule({
      imports: [FirebaseModule.forRoot([
        new FirebaseAppConfig({ options: firebaseConfig }),
        new FirebaseAppConfig({ options: firebaseConfig, token: secondAppToken })
      ])]
    })

    const defaultApp = TestBed.get(FirebaseApp)
    const defaultAuth = TestBed.get(FirebaseAuth)
    const defaultDatabase = TestBed.get(FirebaseDatabase)

    const secondApp: FirebaseApp = TestBed.get(secondAppToken)
    const secondAuth = secondApp.auth()
    const secondDatabase = secondApp.database()

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
