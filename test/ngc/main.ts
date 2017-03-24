import { Component, NgModule } from '@angular/core'
import { BrowserModule } from '@angular/platform-browser'
import { Observable } from 'rxjs/Observable'
import { FirebaseModule, FirebaseDatabase } from '../../angular-firebase'

@Component({
  selector: 'ngc-spec-child-component',
  template: `

            `
})
export class NgcSpecChildComponent {
}

@NgModule({
  declarations: [
    NgcSpecChildComponent,
  ],
  exports:      [
    NgcSpecChildComponent,
  ]
})
export class FeatureModule {
}

export interface DBSchema {
  count: number;
}

@Component({
  selector: 'ngc-spec-component',
  template: `
                <button (click)="increment()"> +</button>
                <span>  Count : {{ count | async }}  </span>
                <button (click)="decrement()"> +</button>
                <ngc-spec-child-component></ngc-spec-child-component>
            `
})
export class NgcSpecComponent {
  count: Observable<number>

  constructor(private db: FirebaseDatabase<DBSchema>) {
    this.count = db.ref().child('count').onValue().val()
  }

  increment() {
    this.db.ref().child('count').transaction(cur => cur + 1).subscribe()
  }

  decrement() {
    this.db.ref().child('count').transaction(cur => cur - 1).subscribe()
  }
}

@NgModule({
  imports:      [
    BrowserModule,
    FirebaseModule.primaryApp({
      options: {
        apiKey:            '',
        authDomain:        '',
        databaseURL:       '',
        messagingSenderId: '',
        storageBucket:     ''
      }
    }),
    FeatureModule
  ],
  declarations: [NgcSpecComponent],
  bootstrap:    [NgcSpecComponent]
})
export class NgcSpecModule {
}
