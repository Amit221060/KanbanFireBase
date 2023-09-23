import { Injectable, NgZone } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import {
  AngularFirestore,
  AngularFirestoreDocument,
} from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import firebase from 'firebase/app';


@Injectable()
export class AuthService {
  userData: any; // Save logged in user data
  uniqueId = new BehaviorSubject<string>('');
  isValidUser = false;
  constructor(
    private store: AngularFirestore,
    public afAuth: AngularFireAuth,
    public router: Router,
    public ngZone: NgZone 
  ) {}

  getUniqueId() {
    return this.uniqueId.asObservable();
  }

  setUniqueId(value) {
    this.uniqueId.next(value);
  }

  async checkUser(userDetails) {
    let isvalid = {};
    const password = userDetails.password;
    const username = userDetails.username;
    await this.afAuth
      .signInWithEmailAndPassword(username, password)
      .then(async (result) => {
        await this.SetUserData(result.user);
        isvalid['msg'] = 'loged in';
        isvalid['status'] = true;
      })
      .catch((error) => {
        isvalid['msg'] = error.message;
        isvalid['status'] = false;
      });

    return isvalid;
  }

  async userSignUp(userDetails) {
    let isSignedUp = {};
    const password = userDetails.password;
    const email = userDetails.username;
    await this.afAuth
      .createUserWithEmailAndPassword(email, password)
      .then(async (result) => {
        isSignedUp['msg'] = 'loged in';
        isSignedUp['status'] = true;
        
        await this.SetUserData(result.user);
        this.SendVerificationMail();
        
      })
      .catch((error) => {
        isSignedUp['msg'] = error.message;
        isSignedUp['status'] = false;
      });

    return isSignedUp;
  }

  async SendVerificationMail() {
    return this.afAuth.currentUser
      .then((u: any) => u.sendEmailVerification())
      .then(() => {
        this.router.navigate(['verifyEmail']);
      });
  }

  async SetUserData(user: any) {
    this.afAuth.authState.subscribe((user) => {
      if (user) {
        this.isValidUser = true;
        this.setUniqueId(user.uid);
      }
    });

    const userRef: AngularFirestoreDocument<any> = this.store.doc(
      `users/${user.uid}`
    );

    const userData = {
      uid: user.uid,
      email: user.email,
      displayName: user.displayName,
      photoURL: user.photoURL,
      emailVerified: user.emailVerified,
    };
    this.store.collection('users').doc(userData.uid).set(userData);
    this.userData =userData

    return userRef.set(userData, {
      merge: true,
    });
  }

   GoogleAuth() {
      return this.authLogin(new firebase.auth.GoogleAuthProvider()).then((res: any) => {
        this.router.navigate(['/entery']);
      });
    }

    authLogin(provider: any) {
      return this.afAuth
        .signInWithPopup(provider)
        .then((result) => {
          this.router.navigate(['/entery']);
          this.SetUserData(result.user);
        })
        .catch((error) => {
          window.alert(error);
        });
    }
}
