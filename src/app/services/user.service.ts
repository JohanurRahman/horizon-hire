import { Injectable } from '@angular/core';
import { from, Observable } from 'rxjs';
import { doc, Firestore, setDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})

export class UserService {

  constructor(
    private firestore: Firestore
  ) {}

  addUser(user: any): Observable<void> {
    const ref = doc(this.firestore, 'users', user.uid);
    return from(setDoc(ref, user));
  }
}