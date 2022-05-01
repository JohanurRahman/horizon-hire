import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';

import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
import { UserCredential } from '@firebase/auth';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(private auth: Auth) {}

  signUp(email: string, password: string): Observable<UserCredential> {
    return from(createUserWithEmailAndPassword(this.auth, email, password));
  }

  signIn(email: string, password: string): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

  logout(): Observable<void> {
    return from(this.auth.signOut());
  }

}

