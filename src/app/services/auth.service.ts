import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';

import { Auth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from '@angular/fire/auth';
import { UserCredential } from '@firebase/auth';

@Injectable({
  providedIn: 'root'
})

export class AuthService {

  constructor(private auth: Auth) {}

  register(email: string, password: string): Observable<UserCredential> {
    return from(createUserWithEmailAndPassword(this.auth, email, password));
  }

  login(email: string, password: string): Observable<UserCredential> {
    return from(signInWithEmailAndPassword(this.auth, email, password));
  }

}

