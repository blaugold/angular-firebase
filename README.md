## Angular Firebase

Wrapper around Firebase JS-API for Angular 2 Apps.

The library runs Firebase calls in the angular zone to make change detection work. It is focused on 
observables and returns them for every async operation. To make working with observables and 
Firebase easier, the returned observables are extended with helper operators and aliases to snapshot 
methods.

At the moment Auth and Database are almost completely implemented.

## Installation

```
    npm i --save @blaugold/angular-firebase
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
- Tests

