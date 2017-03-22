import { FirebaseDatabase } from './'

interface DBSchema {
  todoLists: {
    [listId: string]: {
      name: string
      createdBy: string
      todoItems: {
        [itemId: string]: {
          title: string
          checked: boolean
        }
      }
    }
  }
  users: {
    [userId: string]: {
      name: string
      email: string
      birthday: string
    }
  }
}

let db: FirebaseDatabase<DBSchema>

db.ref().child('todoLists').child('1').child('todoItems')
  .onValue().values().map(x => x.map(xs => xs.checked))