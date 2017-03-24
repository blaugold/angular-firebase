import { InjectionToken, Injector, ModuleWithProviders, NgModule } from '@angular/core'
import { FirebaseApp, FirebaseAppConfig } from './firebase-app.service'
import { FirebaseAuth } from './firebase-auth.service'
import { FirebaseDatabase } from './firebase-database.service'

/** @internal */
let lazyInvocation = true

export function invokeLazy(): boolean {
  return lazyInvocation
}

export function setLazyInvocation(lazy: boolean) {
  lazyInvocation = lazy
}

export function appFactory(injector: Injector, config: FirebaseAppConfig) {
  return new FirebaseApp(config, injector)
}

export function authFactory(app: FirebaseApp) {
  return app.auth()
}

export function databaseFactory(app: FirebaseApp) {
  return app.database()
}

@NgModule({})
export class FirebaseModule {
  /**
   * Provides a firebase app which will be be injected for `FirebaseApp`. Further the app's
   * `FirebaseAuth` and `FirebaseDatabase` can be injected in the same way.
   * @param config Firebase app config.
   */
  static primaryApp(config: FirebaseAppConfig): ModuleWithProviders {

    return {
      ngModule:  FirebaseModule,
      providers: [
        {
          provide:  'firebase-config-' + config.options.apiKey,
          useValue: config
        },
        {
          provide:    FirebaseApp,
          useFactory: appFactory,
          deps:       [Injector, 'firebase-config-' + config.options.apiKey]
        },
        {
          provide:    FirebaseAuth,
          useFactory: authFactory,
          deps:       [FirebaseApp]
        },
        {
          provide:    FirebaseDatabase,
          useFactory: databaseFactory,
          deps:       [FirebaseApp]
        }
      ]
    }
  }

  /**
   * Provides a `FirebaseApp` which will be injected for {@param token}.
   *
   * @param config Firebase app config.
   */
  static secondaryApp(token: InjectionToken<FirebaseApp>, config: FirebaseAppConfig) {
    return {
      ngModule:  FirebaseModule,
      providers: [
        {
          provide:  'firebase-config-' + config.options.apiKey,
          useValue: config
        },
        {
          provide:    token,
          useFactory: appFactory,
          deps:       [Injector, 'firebase-config-' + config.options.apiKey,]
        }
      ]
    }
  }
}
