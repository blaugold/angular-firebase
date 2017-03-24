import { InjectionToken, Injector, ModuleWithProviders, NgModule } from '@angular/core'
import { FirebaseApp, FirebaseAppConfig } from './firebase-app.service'
import { FirebaseAuth } from './firebase-auth.service'
import { FirebaseDatabase } from './firebase-database.service'

/** @internal */
let lazyInvocation = true

/** @internal */
export function invokeLazy(): boolean {
  return lazyInvocation
}

/**
 * Enable or disable lazy invocation of firebase operations.
 *
 * Since the library focuses on observables, all operations are invoked lazily as is usually the
 * case with observables. This means for example, calling `someRef.set({ foo: 'bar' })` will do
 * nothing without either subscribing to the returned observable or calling `toPromise()` on it.
 *
 * This is in contrast to the Firebase Web-API which starts the operation when the function is
 * called. It is possible to globally configure the library to behave like the native Firebase
 * Web-API by calling `setLazyInvocation(false)`
 *
 * @param lazy
 */
export function setLazyInvocation(lazy: boolean) {
  lazyInvocation = lazy
}

/** @internal */
export function appFactory(injector: Injector, config: FirebaseAppConfig) {
  return new FirebaseApp(config, injector)
}

/** @internal */
export function authFactory(app: FirebaseApp) {
  return app.auth()
}

/** @internal */
export function databaseFactory(app: FirebaseApp) {
  return app.database()
}

@NgModule({})
export class FirebaseModule {
  /**
   * Provides a firebase app which will be be injected for {@link FirebaseApp}. Further the app's
   * {@link FirebaseAuth} and {@link FirebaseDatabase} can be injected in the same way.
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
   * Provides a {@link FirebaseApp} which will be injected for token.
   *
   * @param token Token for which {@link FirebaseApp} will be injected.
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
