import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

@Injectable()
export class AuthService {
  uniqueId = new BehaviorSubject<string>('');
  isValidUser = false;
  constructor(private store: AngularFirestore) {}

  async checkUser(userDetails) {
    const password = userDetails.password;
    const username = userDetails.username;

    const users = await this.getUser(username, password);

    if (users.length && password == users[0].password && username == users[0].username) {
      this.isValidUser = true;
      this.setUniqueId(users[0].uniqueId) ;
      return true;
    }
    return false;
  }

  getUser(username, password) {
    return new Promise<any>((resolve) => {
      // this.store
      //   .collection('users')
      //   .valueChanges({ idField: 'id' })
      //   .subscribe((users) => resolve(users));
      this.store
        .collection('users', (ref) =>
          ref
            .where('username', '==', username)
            .where('password', '==', password)
        )
        .valueChanges()
        .subscribe((users) => resolve(users));
    });
  }


  getUniqueId(){
    return this.uniqueId.asObservable();
  }

  setUniqueId(value) {
    this.uniqueId.next(value);
  }
}
