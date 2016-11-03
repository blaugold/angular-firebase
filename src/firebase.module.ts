import {
  NgModule, ModuleWithProviders, NgZone, OpaqueToken, Injectable,
  Inject, Optional
} from '@angular/core';
import { LogService, LogServiceDummy, Logger } from '@blaugold/angular-logger'
import * as firebase from 'firebase'

import { FirebaseAuthService } from './firebase-auth.service'
import { FirebaseDatabaseService } from './firebase-database.service'
import { FirebaseAuth, FirebaseDatabase } from './firebase.service'

export interface FirebaseAppConfig {
  name?: string
  config: {
    apiKey: string
    authDomain: string
    databaseURL: string
    storageBucket: string
    messagingSenderId: string
  }
}

const FIREBASE_APP_CONFIGS = new OpaqueToken('FirebaseAppConfigs')

let lazyInvocation = true

export function invokeLazy(): boolean {
  return lazyInvocation
}

function setLazyInvocation(lazy: boolean) {
  lazyInvocation = lazy
}

@NgModule({})
export class FirebaseModule {
  static forRoot(config: FirebaseAppConfig[], lazyInvocation = true): ModuleWithProviders {

    setLazyInvocation(lazyInvocation)

    return {
      ngModule:  FirebaseModule,
      providers: [
        { provide: FIREBASE_APP_CONFIGS, useValue: config },
        Firebase
      ]
    }
  }
}

@Injectable()
export class Firebase {

  static lastInstanceId: number = -1

  apps: { [appName: string]: {
    auth: FirebaseAuthService,
    database: FirebaseDatabaseService
  }} = {}

  private instId: number
  private defaultAppName: string
  private logger: Logger

  static getProjectName(config: FirebaseAppConfig): string {
    return config.config.authDomain.split('.')[0]
  }

  constructor(@Inject(FIREBASE_APP_CONFIGS) private configs: FirebaseAppConfig[],
              private ngZone: NgZone,
              @Optional() logService: LogService) {
    this.instId         = ++Firebase.lastInstanceId
    this.defaultAppName = `default-${this.instId}`

    logService          = logService || new LogServiceDummy()
    this.logger         = logService.getLogger('Firebase')

    configs.forEach(config => {
      const name = config.name || this.defaultAppName
      this.logger.info(`Setting up project "${Firebase.getProjectName(config)}" as app "${name}"`)

      if (this.hasApp(name)) {
        throw new Error(`Firebase: App with name: "${name}" already exists.`)
      }

      let app         = firebase.initializeApp(config.config, name)
      this.apps[name] = {
        auth:     new FirebaseAuthService(app.auth() as FirebaseAuth, this.ngZone),
        database: new FirebaseDatabaseService(app.database() as FirebaseDatabase, this.ngZone)
      }
    })
  }

  auth(appName = this.defaultAppName): FirebaseAuthService {
    this.assertAppExists(appName)
    return this.apps[appName].auth
  }

  database(appName = this.defaultAppName): FirebaseDatabaseService {
    this.assertAppExists(appName)
    return this.apps[appName].database
  }

  private assertAppExists(appName: string) {
    if (!this.apps[appName]) {
      throw new Error(`Firebase app: ${appName} does not exist.'`)
    }
  }

  private hasApp(appName: string): boolean {
    return (firebase.apps as Array<firebase.app.App>).some(app => app.name === appName)
  }
}
