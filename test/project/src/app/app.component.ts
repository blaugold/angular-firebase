import { Component } from '@angular/core'
import { FirebaseDatabase } from '@blaugold/angular-firebase'
import { DatabaseSchema } from './database-schema'

@Component({
  selector:    'app-root',
  templateUrl: './app.component.html',
  styleUrls:   ['./app.component.css']
})
export class AppComponent {
  constructor(private fb: FirebaseDatabase<DatabaseSchema>) {}

  title = 'app works!';
}
