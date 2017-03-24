import { Injector, ReflectiveInjector } from '@angular/core'
import * as firebase from 'firebase'
import { Observable } from 'rxjs/Observable'
import { FirebaseAuth } from './firebase-auth.service'
import { FirebaseDatabase } from './firebase-database.service'
import { NativeFirebaseApp, NativeFirebaseAuth, NativeFirebaseDatabase } from './native-firebase'
import { wrapPromise } from './utils'

let lastAppId = 0

export interface FirebaseAppConfig {
  /**
   * Name of the app internally used by firebase. If non is given one will be generated.
   */
  name?: string
  /**
   * Firebase App configuration.
   */
  options: {
    apiKey: string
    authDomain?: string
    databaseURL?: string
    storageBucket?: string
    messagingSenderId?: string
  }
}

export class FirebaseApp {
  nativeApp: NativeFirebaseApp

  private _auth: FirebaseAuth
  private _database: FirebaseDatabase<any>

  constructor(public config: FirebaseAppConfig,
              private injector: Injector) {
    config.name    = config.name || `app-${lastAppId++}`
    this.nativeApp = firebase.initializeApp(config.options, config.name)
  }

  delete(): Observable<void> {
    return wrapPromise<void>(() => this.nativeApp.delete())
  }

  /**
   * Get the with this {@link FirebaseApp} associated {@link FirebaseAuth} instance.
   */
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

  /**
   * Get the with this {@link FirebaseApp} associated {@link FirebaseDatabase}.
   *
   * The type parameter T is used to supply the schema of your database. If you do not want to
   * use one set it to `any`. Using a schema provides type safety when accessing the database.
   */
  database<T>(): FirebaseDatabase<T> {
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