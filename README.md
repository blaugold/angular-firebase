## Angular Firebase

[![CircleCI](https://circleci.com/gh/blaugold/angular-firebase.svg?style=svg&circle-token=bf5f61f7f9737852ea53e4e80981312624078636)](https://circleci.com/gh/blaugold/angular-firebase)

Wrapper around Firebase JS-API for Angular Apps.

The library runs Firebase calls inside zone.js to make change detection work. It is focused on 
observables and returns them for every operation. To make working with observables and 
Firebase easier, the returned observables are extended with helper operators and aliases to snapshot 
methods.
The library support type checking of a database schema to let the compiler catch misspellings and
wrong access patterns.

At the moment Auth and Database are implemented.

**[Reference](https://blaugold.github.io/angular-firebase/index.html)**

## Installation

```
    npm i --save @blaugold/angular-firebase
```

## Usage
For most apps, which only use one firebase project, add the `FirebaseModule` to your root module.

```typescript
import { NgModule } from '@angular/core'
import { FirebaseModule } from '@blaugold/angular-firebase'

@NgModule({
    imports: [
        FirebaseModule.primaryApp({
            options: {
                apiKey: '<your-api-key>',
                authDomain: '<your-auth-domain>',
                databaseURL: '<your-database-url>',
                storageBucket: '<your-storage-bucket>',
                messagingSenderId: '<your-messaging-sender-id>'
            }
        })
    ]
})
export class AppModule {}
```

In your service or component inject `FirebaseDatabase` and `FirebaseAuth`:

```typescript
import { Injectable } from '@angular/core'
import { FirebaseDatabase } from '@blaugold/angular-firebase'
import { Observable } from 'rxjs/Observable'

const todoLists = 'todoLists'

@Injectable()
export class TodoService {

    constructor(private db: FirebaseDatabase<any>) {}
    
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

To use a database schema define interfaces representing the structure of your tree.

```typescript
import { Injectable } from '@angular/core'
import { FirebaseDatabase } from '@blaugold/angular-firebase'
import { Observable } from 'rxjs/Observable'

export interface UserData {
  name: string
  email: string
  signedUpAt: number
}

export interface DatabaseSchema {
  users: {
    [uid: string]: UserData
  }
}

@Injectable()
export class UserService {

  constructor(private db: FirebaseDatabase<DatabaseSchema>) {}
    
  // It is important to either use `db.ref()` without any argument or alternatively declare 
  // the type of the part of the tree the ref points to: `db.ref<UserData>('/users/1')`

  getUserName(uid: string): Observable<string> {
    // No compile error
    return this.db.ref().child('users').child(uid).child('name').val()
  }
  
  getUserEmail(uid: string): Observable<string> {
    // 'user' does not exist at that location in the schema so compiler will complain.  
    return this.db.ref().child('user').child(uid).child('email').val()
  }
}
```

The api mirrors closely how the Firebase Web-API works. The biggest difference is that all 
operations return observables. To get an overview of the api, take a look at [`FirebaseDatabaseRef`](https://blaugold.github.io/angular-firebase/classes/firebasedatabaseref.html), [`DataSnapshotObservable`](https://blaugold.github.io/angular-firebase/classes/datasnapshotobservable.html), [`FirebaseAuth`](https://blaugold.github.io/angular-firebase/classes/firebaseauth.html) and [`FirebaseDatabase`](https://blaugold.github.io/angular-firebase/classes/firebasedatabase.html).

## Multiple Projects
For every project a `FirebaseApp` instance is created. The default project app is injected when
requesting `FirebaseApp`. The default app's `FirebaseDatabase` and `FirebaseAuth`
are available like this as well. To setup additional apps use `FirebaseModule.secondaryApp` and pass
an `InjectionToken` which then can be used to inject the app in services, components, etc.:

```typescript
import { InjectionToken, NgModule, Component, Inject } from '@angular/core'
import { FirebaseModule, FirebaseApp, FirebaseDatabase, FirebaseAuth } from '@blaugold/angular-firebase'

const secondAppToken = new InjectionToken('Second App')

@NgModule({
    imports: [
        FirebaseModule.secondaryApp(secondAppToken, {
            options: {...}
        }),
        FirebaseModule.primaryApp({
            options: {...}
        })
    ]
})
export class AppModule {}

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
- wrap onDisconnect class to include methods in change detection
- Storage
- Messaging

