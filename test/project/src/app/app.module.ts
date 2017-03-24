import { NgModule } from '@angular/core'
import { FormsModule } from '@angular/forms'
import { HttpModule } from '@angular/http'
import { BrowserModule } from '@angular/platform-browser'
import { FirebaseModule } from '@blaugold/angular-firebase'

import { AppComponent } from './app.component'

@NgModule({
  declarations: [
    AppComponent
  ],
  imports:      [
    BrowserModule,
    FormsModule,
    HttpModule,
    FirebaseModule.primaryApp({
      options: {
        apiKey:            "AIzaSyCGuQgsk0esrVbWVhMhG-4yPeTLWsRKTsU",
        authDomain:        "angular-firebase-example-658f5.firebaseapp.com",
        databaseURL:       "https://angular-firebase-example-658f5.firebaseio.com",
        storageBucket:     "angular-firebase-example-658f5.appspot.com",
        messagingSenderId: "130215066168"
      }
    })
  ],
  providers:    [],
  bootstrap:    [AppComponent]
})
export class AppModule {
}
