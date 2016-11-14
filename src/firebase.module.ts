import { NgModule, ModuleWithProviders, Injector, Provider } from '@angular/core'

import { FirebaseAuth } from './firebase-auth.service'
import { FirebaseDatabase } from './firebase-database.service'
import { FirebaseAppConfig, FirebaseApp } from './firebase-app.service'

/** @internal */
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
    this.validateConfig(config)

    setLazyInvocation(lazyInvocation)

    return {
      ngModule:  FirebaseModule,
      providers: this.getProviders(config)
    }
  }

  private static validateConfig(config: FirebaseAppConfig[]) {
    const defaultApps = config.filter(config => !config.token)
    if (defaultApps.length > 1) {
      throw new Error('There can only be one default Firebase App')
    }
  }

  private static getProviders(config: FirebaseAppConfig[]): Provider[] {
    const defaultApp     = config.filter(config => !config.token)[0]
    const additionalApps = config.filter(config => !!config.token)

    return [
      {
        provide:    FirebaseApp,
        useFactory: (injector: Injector) => new FirebaseApp(defaultApp, injector),
        deps:       [Injector]
      },
      {
        provide:    FirebaseAuth,
        useFactory: (firebaseApp: FirebaseApp) => firebaseApp.auth(),
        deps:       [FirebaseApp]
      },
      {
        provide:    FirebaseDatabase,
        useFactory: (firebaseApp: FirebaseApp) => firebaseApp.database(),
        deps:       [FirebaseApp]
      },
      ...additionalApps.map(config => ({
        provide:    config.token,
        useFactory: (injector: Injector) => new FirebaseApp(config, injector),
        deps:       [Injector]
      }))
    ]
  }
}
