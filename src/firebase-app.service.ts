import { Injectable, Injector, ReflectiveInjector } from '@angular/core'
import { Observable } from 'rxjs'
import * as firebase from 'firebase'

import { FirebaseAuth } from './firebase-auth.service'
import { FirebaseDatabase } from './firebase-database.service'
import { NativeFirebaseApp, NativeFirebaseAuth, NativeFirebaseDatabase } from './native-firebase'
import { wrapPromise } from './utils'

let lastAppId = 0

export class FirebaseAppConfig {
  token?: any
  name: string
  options: {
    apiKey: string
    authDomain?: string
    databaseURL?: string
    storageBucket?: string
    messagingSenderId?: string
  }

  constructor(config: {
    name?: string,
    options: {
      apiKey: string
      authDomain?: string
      databaseURL?: string
      storageBucket?: string
      messagingSenderId?: string
    }
  }) {
    this.name    = config.name || `app-${lastAppId++}`
    this.options = config.options
  }
}

@Injectable()
export class FirebaseApp {
  nativeApp: NativeFirebaseApp

  private _auth: FirebaseAuth
  private _database: FirebaseDatabase

  constructor(public config: FirebaseAppConfig,
              private injector: Injector) {
    this.nativeApp = firebase.initializeApp(config.options, config.name)
  }

  delete(): Observable<void> {
    return wrapPromise<void>(() => this.nativeApp.delete())
  }

  auth(): FirebaseAuth {
    if (!this._auth) {
      const authInjector = ReflectiveInjector.resolveAndCreate([
        {
          provide:  NativeFirebaseAuth,
          useValue: this.nativeApp.auth()
        },
        FirebaseAuth
      ], this.injector)
      this._auth         = authInjector.get(FirebaseAuth)
    }
    return this._auth
  }

  database(): FirebaseDatabase {
    if (!this._database) {
      const databaseInjector = ReflectiveInjector.resolveAndCreate([
        {
          provide:  NativeFirebaseDatabase,
          useValue: this.nativeApp.database()
        },
        FirebaseDatabase
      ], this.injector)
      this._database         = databaseInjector.get(FirebaseDatabase)
    }
    return this._database
  }
}