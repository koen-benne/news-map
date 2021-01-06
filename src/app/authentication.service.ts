import { Injectable } from '@angular/core';
// @ts-ignore
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthenticateService {

  constructor(
      private afAuth: AngularFireAuth
  ) { }

  registerUser(value) {

    return new Promise<any>((resolve, reject) => {

      this.afAuth.createUserWithEmailAndPassword(value.email, value.password)
          .then(
              res => resolve(res),
              err => reject(err));
    });

  }

  loginUser(value) {
    return new Promise<any>((resolve, reject) => {
      this.afAuth.signInWithEmailAndPassword(value.email, value.password)
          .then(
              res => resolve(res),
              err => reject(err));
    });
  }

  logoutUser() {
    return new Promise((resolve, reject) => {
      if (this.afAuth.currentUser) {
        this.afAuth.signOut()
            .then(() => {
              console.log('Log Out');
              resolve();
            }).catch((error) => {
          reject();
        });
      }
    });
  }

  userDetails() {
    return this.afAuth.user;
  }
}
