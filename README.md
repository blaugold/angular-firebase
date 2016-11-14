## Angular Firebase

[![CircleCI](https://circleci.com/gh/blaugold/angular-firebase.svg?style=svg&circle-token=bf5f61f7f9737852ea53e4e80981312624078636)](https://circleci.com/gh/blaugold/angular-firebase)

Wrapper around Firebase JS-API for Angular 2 Apps.

The library runs Firebase calls in the angular zone to make change detection work. It is focused on 
observables and returns them for every operation. To make working with observables and 
Firebase easier, the returned observables are extended with helper operators and aliases to snapshot 
methods.

At the moment Auth and Database are almost completely implemented.

**[Reference](https://blaugold.github.io/angular-firebase/index.html)**

## Installation

```
    npm i --save @blaugold/angular-firebase
```

## Usage
For most apps, which only use one firebase project, add the `FirebaseModule` to your root module.
```typescript
import { FirebaseModule, FirebaseAppConfig } from '@blaugold/angular-firebase'

@NgModule({
    imports: [
        FirebaseModule.forRoot([new FirebaseAppConfig({
            options: {
                apiKey: '<your-api-key>',
                authDomain: '<your-auth-domain>',
                databaseURL: '<your-database-url>',
                storageBucket: '<your-storage-bucket>',
                messagingSenderId: '<your-messaging-sender-id>'
            }
        })])
    ]
})
export class AppModule {}
```

In your service or component inject `FirebaseDatabase` and `FirebaseAuth`:
```typescript
const todoLists = 'todoLists'

@Injectable()
export class TodoService {

    constructor(private db: FirebaseDatabase) {}
    
    addItem(listId: string, item: TodoItem): Observable<void> {
        return this.db.ref(todoLists).child(listId).push()
            .mergeMap(ref => {
                // Add key as id to item for easier access to id in components
                item.id = ref.key
                return ref.set(item)
            })
    }
    
    // Returns observable of array of 10 last TodoItems 
    onList(listId: string): Observable<TodoItem[]> {
        return this.db.ref(todoLists).child(listId)
            .limitToLast(10)
            // Emits list every time there is a change.
            .onValue()
            // Calls .val() on all children and returns them in an array.
            .toValArray<TodoItem>()
    }
}
```

The api mirrors closely how the Firebase Web-API works. The biggest difference is that all 
operations return observables. To get an overview of the api, take a look at [`FirebaseDatabaseRef`](https://blaugold.github.io/angular-firebase/classes/firebasedatabaseref.html), [`DataSnapshotObservable`](https://blaugold.github.io/angular-firebase/classes/datasnapshotobservable.html), [`FirebaseAuth`](https://blaugold.github.io/angular-firebase/classes/firebaseauth.html) and [`FirebaseDatabase`](https://blaugold.github.io/angular-firebase/classes/firebasedatabase.html).

## Multiple Projects
For every project a `FirebaseApp` instance is created. The default project app is injected when
requesting `FirebaseApp`. The default app's `FirebaseDatabase` and `FirebaseAuth`
are available like this as well. To get additional apps set a token in the `FirebaseAppConfig`
and use this token with `@Inject(token)` in a constructor:
```typescript
const secondAppToken = new OpaqueToken('Second App')

// Default project
new FirebaseAppConfig({ options: defaultProjectConfig })
// Second project
new FirebaseAppConfig({ token: secondAppToken, options: secondProjectConfig })

@Component(...)
class AppComponent {
    
    constructor(@Inject(secondAppToken) app: FirebaseApp,
                defaultApp: FirebaseApp,
                defaultDb: FirebaseDatabase,
                defaultAuth: FirebaseAuth) {
        const db = app.database()
        const auth = app.auth()
    }
    
}
```
 


## Operation Invocation
Since the library focuses on observables all operations are invoked lazily as is usually the case 
with observables. This means for example, calling `someRef.set({ foo: 'bar' })` will do nothing 
without either subscribing to the returned observable or calling `toPromise()` on it.

This is in contrast to the Firebase Web-API which starts the operation when the function is
called. It is possible to globally configure the library to behave like the native Firebase Web-API
by calling `FirebaseModule.forRoot(config, false)`

## TODO
- wrap User class to include methods in change detection
- wrap onDisconnect class to include methods in change detection
- Storage
- Messaging
- More Tests

